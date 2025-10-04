import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD']
  },
  convertedAmount: {
    type: Number,
    required: true
  },
  companyCurrency: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Travel', 'Food', 'Accommodation', 'Transportation', 'Office Supplies', 'Entertainment', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  merchant: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  receiptUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'In Review'],
    default: 'Pending'
  },
  approverLevel: {
    type: Number,
    default: 1
  },
  currentApproverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  history: [{
    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approverName: String,
    action: {
      type: String,
      enum: ['Approved', 'Rejected', 'Submitted']
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Expense', expenseSchema);
