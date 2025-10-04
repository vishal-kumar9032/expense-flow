import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'INR', 'EUR', 'GBP', 'AUD', 'CAD'],
    default: 'USD'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Company', companySchema);
