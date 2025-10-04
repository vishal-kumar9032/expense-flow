import mongoose from 'mongoose';

const approvalRuleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  ruleType: {
    type: String,
    enum: ['percentage', 'cfo', 'hybrid'],
    default: 'percentage'
  },
  threshold: {
    type: Number,
    default: 60 // 60% approval threshold
  },
  approvers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    level: Number, // 1 = Manager, 2 = Finance, 3 = Director
    role: String,
    isCFO: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ApprovalRule', approvalRuleSchema);
