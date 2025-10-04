import express from 'express';
import Expense from '../models/Expense.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import ApprovalRule from '../models/ApprovalRule.js';
import { protect, authorize } from '../middleware/auth.js';
import { simulateOCR, convertCurrency, checkApprovalRules } from '../utils/helpers.js';

const router = express.Router();

// @route   POST /api/expense/ocr
// @desc    Simulate OCR extraction
// @access  Private
router.post('/ocr', protect, (req, res) => {
  try {
    const ocrData = simulateOCR();
    res.json(ocrData);
  } catch (error) {
    res.status(500).json({ message: 'OCR simulation failed', error: error.message });
  }
});

// @route   POST /api/expense/convert
// @desc    Convert currency
// @access  Private
router.post('/convert', protect, (req, res) => {
  try {
    const { amount, fromCurrency, toCurrency } = req.body;
    const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
    res.json({ convertedAmount, fromCurrency, toCurrency, originalAmount: amount });
  } catch (error) {
    res.status(500).json({ message: 'Currency conversion failed', error: error.message });
  }
});

// @route   POST /api/expense/create
// @desc    Create new expense
// @access  Private (Employee, Manager, Admin)
router.post('/create', protect, async (req, res) => {
  try {
    const { amount, currency, category, description, merchant, date, receiptUrl } = req.body;

    // Get user's company
    const user = await User.findById(req.user._id).populate('companyId');
    const company = user.companyId;

    // Convert to company currency
    const convertedAmount = convertCurrency(amount, currency, company.currency);

    // Find manager as first approver
    let currentApproverId = user.managerId;
    
    // If no manager, get an admin
    if (!currentApproverId) {
      const admin = await User.findOne({ companyId: company._id, role: 'Admin' });
      currentApproverId = admin ? admin._id : null;
    }

    const expense = await Expense.create({
      employeeId: req.user._id,
      companyId: company._id,
      amount,
      currency,
      convertedAmount,
      companyCurrency: company.currency,
      category,
      description,
      merchant: merchant || '',
      date,
      receiptUrl: receiptUrl || '',
      status: 'Pending',
      approverLevel: 1,
      currentApproverId,
      history: [
        {
          approverId: req.user._id,
          approverName: req.user.name,
          action: 'Submitted',
          comment: 'Expense submitted for approval',
          date: new Date()
        }
      ]
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate('employeeId', 'name email')
      .populate('currentApproverId', 'name email role');

    res.status(201).json(populatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create expense', error: error.message });
  }
});

// @route   GET /api/expense/my
// @desc    Get current user's expenses
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ employeeId: req.user._id })
      .populate('employeeId', 'name email')
      .populate('currentApproverId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
});

// @route   GET /api/expense/pending
// @desc    Get pending expenses for approval (Manager/Admin)
// @access  Private (Manager, Admin)
router.get('/pending', protect, authorize('Manager', 'Admin'), async (req, res) => {
  try {
    let expenses;

    if (req.user.role === 'Admin') {
      // Admin sees all pending expenses
      expenses = await Expense.find({ status: { $in: ['Pending', 'In Review'] } })
        .populate('employeeId', 'name email')
        .populate('currentApproverId', 'name email role')
        .sort({ createdAt: -1 });
    } else {
      // Manager sees expenses where they are the current approver
      expenses = await Expense.find({ 
        currentApproverId: req.user._id,
        status: { $in: ['Pending', 'In Review'] }
      })
        .populate('employeeId', 'name email')
        .populate('currentApproverId', 'name email role')
        .sort({ createdAt: -1 });
    }

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending expenses', error: error.message });
  }
});

// @route   GET /api/expense/all
// @desc    Get all expenses (Admin only)
// @access  Private (Admin)
router.get('/all', protect, authorize('Admin'), async (req, res) => {
  try {
    const expenses = await Expense.find({ companyId: req.user.companyId })
      .populate('employeeId', 'name email')
      .populate('currentApproverId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
});

// @route   GET /api/expense/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('employeeId', 'name email')
      .populate('currentApproverId', 'name email role')
      .populate('history.approverId', 'name email role');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check authorization
    if (
      expense.employeeId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin' &&
      (req.user.role !== 'Manager' || expense.currentApproverId?._id.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: 'Not authorized to view this expense' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expense', error: error.message });
  }
});

// @route   PUT /api/expense/:id/approve
// @desc    Approve expense
// @access  Private (Manager, Admin)
router.put('/:id/approve', protect, authorize('Manager', 'Admin'), async (req, res) => {
  try {
    const { comment } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.status === 'Approved' || expense.status === 'Rejected') {
      return res.status(400).json({ message: 'Expense already processed' });
    }

    // Add approval to history
    expense.history.push({
      approverId: req.user._id,
      approverName: req.user.name,
      action: 'Approved',
      comment: comment || 'Approved',
      date: new Date()
    });

    // Get approval rule
    const approvalRule = await ApprovalRule.findOne({ companyId: expense.companyId }).populate('approvers.userId');

    // Check if auto-approve conditions are met
    const approvalCount = expense.history.filter(h => h.action === 'Approved').length;
    const totalApprovers = approvalRule ? approvalRule.approvers.length : 1;

    const { autoApprove, reason } = checkApprovalRules(approvalRule, expense, approvalCount, totalApprovers);

    if (autoApprove || req.user.role === 'Admin') {
      expense.status = 'Approved';
      expense.history.push({
        approverId: req.user._id,
        approverName: 'System',
        action: 'Approved',
        comment: req.user.role === 'Admin' ? 'Admin override - Final approval' : `Auto-approved: ${reason}`,
        date: new Date()
      });
      console.log(`📧 [Email Notification] Expense #${expense._id} approved - Notifying ${expense.employeeId}`);
    } else {
      // Move to next approval level
      expense.status = 'In Review';
      expense.approverLevel += 1;

      // Find next approver
      if (approvalRule && expense.approverLevel <= approvalRule.approvers.length) {
        const nextApprover = approvalRule.approvers.find(a => a.level === expense.approverLevel);
        if (nextApprover) {
          expense.currentApproverId = nextApprover.userId;
        }
      }

      console.log(`📧 [Email Notification] Expense #${expense._id} moved to level ${expense.approverLevel} - Notifying ${expense.currentApproverId}`);
    }

    await expense.save();

    const updatedExpense = await Expense.findById(expense._id)
      .populate('employeeId', 'name email')
      .populate('currentApproverId', 'name email role')
      .populate('history.approverId', 'name email role');

    res.json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve expense', error: error.message });
  }
});

// @route   PUT /api/expense/:id/reject
// @desc    Reject expense
// @access  Private (Manager, Admin)
router.put('/:id/reject', protect, authorize('Manager', 'Admin'), async (req, res) => {
  try {
    const { comment } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.status === 'Approved' || expense.status === 'Rejected') {
      return res.status(400).json({ message: 'Expense already processed' });
    }

    expense.status = 'Rejected';
    expense.history.push({
      approverId: req.user._id,
      approverName: req.user.name,
      action: 'Rejected',
      comment: comment || 'Rejected',
      date: new Date()
    });

    await expense.save();

    console.log(`📧 [Email Notification] Expense #${expense._id} rejected - Notifying ${expense.employeeId}`);

    const updatedExpense = await Expense.findById(expense._id)
      .populate('employeeId', 'name email')
      .populate('currentApproverId', 'name email role')
      .populate('history.approverId', 'name email role');

    res.json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject expense', error: error.message });
  }
});

// @route   GET /api/expense/stats/summary
// @desc    Get expense statistics
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'Employee') {
      filter.employeeId = req.user._id;
    } else {
      filter.companyId = req.user.companyId;
    }

    const totalExpenses = await Expense.countDocuments(filter);
    const pendingExpenses = await Expense.countDocuments({ ...filter, status: 'Pending' });
    const approvedExpenses = await Expense.countDocuments({ ...filter, status: 'Approved' });
    const rejectedExpenses = await Expense.countDocuments({ ...filter, status: 'Rejected' });

    const totalAmount = await Expense.aggregate([
      { $match: { ...filter, status: 'Approved' } },
      { $group: { _id: null, total: { $sum: '$convertedAmount' } } }
    ]);

    const pendingAmount = await Expense.aggregate([
      { $match: { ...filter, status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$convertedAmount' } } }
    ]);

    res.json({
      totalExpenses,
      pendingExpenses,
      approvedExpenses,
      rejectedExpenses,
      totalAmount: totalAmount[0]?.total || 0,
      pendingAmount: pendingAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

export default router;
