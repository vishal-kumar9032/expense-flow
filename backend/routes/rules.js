import express from 'express';
import ApprovalRule from '../models/ApprovalRule.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/rules
// @desc    Get company approval rules
// @access  Private (Admin, Manager)
router.get('/', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const rules = await ApprovalRule.findOne({ companyId: req.user.companyId })
      .populate('approvers.userId', 'name email role');

    if (!rules) {
      return res.status(404).json({ message: 'No approval rules found' });
    }

    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rules', error: error.message });
  }
});

// @route   PUT /api/rules
// @desc    Update approval rules
// @access  Private (Admin)
router.put('/', protect, authorize('Admin'), async (req, res) => {
  try {
    const { ruleType, threshold, approvers } = req.body;

    let rules = await ApprovalRule.findOne({ companyId: req.user.companyId });

    if (!rules) {
      // Create new rules
      rules = await ApprovalRule.create({
        companyId: req.user.companyId,
        ruleType: ruleType || 'percentage',
        threshold: threshold || 60,
        approvers: approvers || []
      });
    } else {
      // Update existing rules
      rules.ruleType = ruleType || rules.ruleType;
      rules.threshold = threshold || rules.threshold;
      rules.approvers = approvers || rules.approvers;
      await rules.save();
    }

    const updatedRules = await ApprovalRule.findById(rules._id)
      .populate('approvers.userId', 'name email role');

    res.json(updatedRules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update rules', error: error.message });
  }
});

// @route   POST /api/rules/approver
// @desc    Add approver to approval rule
// @access  Private (Admin)
router.post('/approver', protect, authorize('Admin'), async (req, res) => {
  try {
    const { userId, level, role, isCFO } = req.body;

    let rules = await ApprovalRule.findOne({ companyId: req.user.companyId });

    if (!rules) {
      return res.status(404).json({ message: 'Approval rules not found' });
    }

    // Check if user exists and belongs to company
    const user = await User.findById(userId);
    if (!user || user.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    // Check if approver already exists
    const approverExists = rules.approvers.some(a => a.userId.toString() === userId);
    if (approverExists) {
      return res.status(400).json({ message: 'Approver already exists' });
    }

    rules.approvers.push({
      userId,
      level,
      role: role || user.role,
      isCFO: isCFO || false
    });

    await rules.save();

    const updatedRules = await ApprovalRule.findById(rules._id)
      .populate('approvers.userId', 'name email role');

    res.json(updatedRules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add approver', error: error.message });
  }
});

// @route   DELETE /api/rules/approver/:userId
// @desc    Remove approver from approval rule
// @access  Private (Admin)
router.delete('/approver/:userId', protect, authorize('Admin'), async (req, res) => {
  try {
    let rules = await ApprovalRule.findOne({ companyId: req.user.companyId });

    if (!rules) {
      return res.status(404).json({ message: 'Approval rules not found' });
    }

    rules.approvers = rules.approvers.filter(
      a => a.userId.toString() !== req.params.userId
    );

    await rules.save();

    const updatedRules = await ApprovalRule.findById(rules._id)
      .populate('approvers.userId', 'name email role');

    res.json(updatedRules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove approver', error: error.message });
  }
});

export default router;
