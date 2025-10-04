import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from '../models/Company.js';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import ApprovalRule from '../models/ApprovalRule.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for seeding');

    // Clear existing data
    await Company.deleteMany({});
    await User.deleteMany({});
    await Expense.deleteMany({});
    await ApprovalRule.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Company
    const company = await Company.create({
      name: 'TechCorp Solutions',
      country: 'United States',
      currency: 'USD'
    });
    console.log('✅ Company created:', company.name);

    // Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@techcorp.com',
      password: 'admin123',
      role: 'Admin',
      companyId: company._id
    });
    console.log('✅ Admin created:', admin.email);

    // Create Manager Users
    const manager1 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      password: 'manager123',
      role: 'Manager',
      companyId: company._id
    });

    const manager2 = await User.create({
      name: 'Michael Chen',
      email: 'michael@techcorp.com',
      password: 'manager123',
      role: 'Manager',
      companyId: company._id,
      managerId: admin._id
    });
    console.log('✅ Managers created');

    // Create Employee Users
    const employee1 = await User.create({
      name: 'John Smith',
      email: 'john@techcorp.com',
      password: 'employee123',
      role: 'Employee',
      companyId: company._id,
      managerId: manager1._id
    });

    const employee2 = await User.create({
      name: 'Emily Davis',
      email: 'emily@techcorp.com',
      password: 'employee123',
      role: 'Employee',
      companyId: company._id,
      managerId: manager1._id
    });

    const employee3 = await User.create({
      name: 'David Wilson',
      email: 'david@techcorp.com',
      password: 'employee123',
      role: 'Employee',
      companyId: company._id,
      managerId: manager2._id
    });
    console.log('✅ Employees created');

    // Create Approval Rules
    const approvalRule = await ApprovalRule.create({
      companyId: company._id,
      ruleType: 'hybrid',
      threshold: 60,
      approvers: [
        { userId: manager1._id, level: 1, role: 'Manager', isCFO: false },
        { userId: manager2._id, level: 2, role: 'Finance Manager', isCFO: true },
        { userId: admin._id, level: 3, role: 'Director', isCFO: false }
      ]
    });
    console.log('✅ Approval rules created');

    // Create Sample Expenses
    const expenses = [
      {
        employeeId: employee1._id,
        companyId: company._id,
        amount: 150.50,
        currency: 'USD',
        convertedAmount: 150.50,
        companyCurrency: 'USD',
        category: 'Food',
        description: 'Team lunch at downtown restaurant',
        merchant: 'Olive Garden',
        date: new Date('2025-10-01'),
        status: 'Pending',
        approverLevel: 1,
        currentApproverId: manager1._id,
        history: [
          {
            approverId: employee1._id,
            approverName: 'John Smith',
            action: 'Submitted',
            comment: 'Team building lunch',
            date: new Date('2025-10-01')
          }
        ]
      },
      {
        employeeId: employee2._id,
        companyId: company._id,
        amount: 5000,
        currency: 'USD',
        convertedAmount: 5000,
        companyCurrency: 'USD',
        category: 'Travel',
        description: 'Flight tickets for client meeting in San Francisco',
        merchant: 'Delta Airlines',
        date: new Date('2025-09-28'),
        status: 'In Review',
        approverLevel: 2,
        currentApproverId: manager2._id,
        history: [
          {
            approverId: employee2._id,
            approverName: 'Emily Davis',
            action: 'Submitted',
            comment: 'Client meeting travel',
            date: new Date('2025-09-28')
          },
          {
            approverId: manager1._id,
            approverName: 'Sarah Johnson',
            action: 'Approved',
            comment: 'Approved for business travel',
            date: new Date('2025-09-29')
          }
        ]
      },
      {
        employeeId: employee3._id,
        companyId: company._id,
        amount: 75.25,
        currency: 'USD',
        convertedAmount: 75.25,
        companyCurrency: 'USD',
        category: 'Transportation',
        description: 'Uber rides for client visits',
        merchant: 'Uber',
        date: new Date('2025-10-02'),
        status: 'Approved',
        approverLevel: 3,
        history: [
          {
            approverId: employee3._id,
            approverName: 'David Wilson',
            action: 'Submitted',
            comment: 'Client visit transportation',
            date: new Date('2025-10-02')
          },
          {
            approverId: manager2._id,
            approverName: 'Michael Chen',
            action: 'Approved',
            comment: 'Approved - CFO override',
            date: new Date('2025-10-02')
          }
        ]
      },
      {
        employeeId: employee1._id,
        companyId: company._id,
        amount: 1200,
        currency: 'USD',
        convertedAmount: 1200,
        companyCurrency: 'USD',
        category: 'Accommodation',
        description: 'Hotel stay for conference',
        merchant: 'Marriott Hotel',
        date: new Date('2025-09-25'),
        status: 'Rejected',
        approverLevel: 1,
        history: [
          {
            approverId: employee1._id,
            approverName: 'John Smith',
            action: 'Submitted',
            comment: 'Conference accommodation',
            date: new Date('2025-09-25')
          },
          {
            approverId: manager1._id,
            approverName: 'Sarah Johnson',
            action: 'Rejected',
            comment: 'Conference not pre-approved. Please submit pre-approval first.',
            date: new Date('2025-09-26')
          }
        ]
      },
      {
        employeeId: employee2._id,
        companyId: company._id,
        amount: 45.00,
        currency: 'USD',
        convertedAmount: 45.00,
        companyCurrency: 'USD',
        category: 'Office Supplies',
        description: 'Office supplies for project',
        merchant: 'Amazon',
        date: new Date('2025-10-03'),
        status: 'Pending',
        approverLevel: 1,
        currentApproverId: manager1._id,
        history: [
          {
            approverId: employee2._id,
            approverName: 'Emily Davis',
            action: 'Submitted',
            comment: 'Project supplies',
            date: new Date('2025-10-03')
          }
        ]
      }
    ];

    await Expense.insertMany(expenses);
    console.log('✅ Sample expenses created');

    console.log('\n📋 Seed Data Summary:');
    console.log('-----------------------------------');
    console.log('Company: TechCorp Solutions (USD)');
    console.log('\n👤 Users Created:');
    console.log('Admin: admin@techcorp.com / admin123');
    console.log('Manager 1: sarah@techcorp.com / manager123');
    console.log('Manager 2 (CFO): michael@techcorp.com / manager123');
    console.log('Employee 1: john@techcorp.com / employee123');
    console.log('Employee 2: emily@techcorp.com / employee123');
    console.log('Employee 3: david@techcorp.com / employee123');
    console.log('\n💰 Expenses: 5 sample expenses created');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
