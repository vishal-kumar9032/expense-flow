import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';
import ApprovalRule from '../models/ApprovalRule.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user & company (first user becomes admin)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, companyName, country } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate random currency for company
    const currencies = ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD'];
    const randomCurrency = currencies[Math.floor(Math.random() * currencies.length)];

    // Create company
    const company = await Company.create({
      name: companyName,
      country: country || 'United States',
      currency: randomCurrency
    });

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'Admin',
      companyId: company._id
    });

    // Create default approval rule
    await ApprovalRule.create({
      companyId: company._id,
      ruleType: 'percentage',
      threshold: 60,
      approvers: [
        { userId: user._id, level: 1, role: 'Admin', isCFO: false }
      ]
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).populate('companyId');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      managerId: user.managerId,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password').populate('companyId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
