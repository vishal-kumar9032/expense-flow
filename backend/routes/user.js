import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/user/all
// @desc    Get all users in company
// @access  Private (Admin, Manager)
router.get('/all', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const users = await User.find({ companyId: req.user.companyId })
      .select('-password')
      .populate('managerId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// @route   GET /api/user/employees
// @desc    Get all employees (for manager assignment)
// @access  Private (Admin)
router.get('/employees', protect, authorize('Admin'), async (req, res) => {
  try {
    const employees = await User.find({ 
      companyId: req.user.companyId,
      role: 'Employee'
    })
      .select('-password')
      .sort({ name: 1 });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
});

// @route   GET /api/user/managers
// @desc    Get all managers (for assignment)
// @access  Private (Admin)
router.get('/managers', protect, authorize('Admin'), async (req, res) => {
  try {
    const managers = await User.find({ 
      companyId: req.user.companyId,
      role: { $in: ['Manager', 'Admin'] }
    })
      .select('-password')
      .sort({ name: 1 });

    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch managers', error: error.message });
  }
});

// @route   POST /api/user/create
// @desc    Create new user (Admin only)
// @access  Private (Admin)
router.post('/create', protect, authorize('Admin'), async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      companyId: req.user.companyId,
      managerId: managerId || null
    });

    const createdUser = await User.findById(user._id)
      .select('-password')
      .populate('managerId', 'name email role');

    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// @route   PUT /api/user/:id
// @desc    Update user (Admin only)
// @access  Private (Admin)
router.put('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const { name, email, role, managerId } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.managerId = managerId !== undefined ? managerId : user.managerId;

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('managerId', 'name email role');

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// @route   DELETE /api/user/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.companyId.toString() !== req.user.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    await user.deleteOne();

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

// @route   GET /api/user/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('managerId', 'name email role')
      .populate('companyId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

export default router;
