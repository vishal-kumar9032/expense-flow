// Simulate OCR extraction from receipt
export function simulateOCR() {
  const merchants = ['Dominos', 'Starbucks', 'Uber', 'Amazon', 'Marriott', 'Delta Airlines', 'Shell Gas', 'Walmart'];
  const amount = (Math.random() * 500 + 100).toFixed(2);
  const date = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  return {
    merchant: merchants[Math.floor(Math.random() * merchants.length)],
    amount: parseFloat(amount),
    date: date
  };
}

// Dummy currency conversion
export function convertCurrency(amount, fromCurrency, toCurrency) {
  const rates = {
    USD: 1,
    INR: 83,
    EUR: 0.92,
    GBP: 0.79,
    AUD: 1.52,
    CAD: 1.35
  };

  if (!rates[fromCurrency] || !rates[toCurrency]) {
    throw new Error('Invalid currency');
  }

  const convertedAmount = (amount * (rates[toCurrency] / rates[fromCurrency]));
  return parseFloat(convertedAmount.toFixed(2));
}

// Check approval rules
export function checkApprovalRules(approvalRule, expense, approvalCount, totalApprovers) {
  if (!approvalRule) {
    return { autoApprove: false, reason: 'No rule defined' };
  }

  const { ruleType, threshold } = approvalRule;

  // Check if CFO approved
  const cfoApproved = expense.history.some(h => {
    const approver = approvalRule.approvers.find(a => a.userId.toString() === h.approverId.toString());
    return approver && approver.isCFO && h.action === 'Approved';
  });

  if (ruleType === 'cfo' && cfoApproved) {
    return { autoApprove: true, reason: 'CFO approved' };
  }

  // Check percentage threshold
  const approvalPercentage = (approvalCount / totalApprovers) * 100;
  
  if (ruleType === 'percentage' && approvalPercentage >= threshold) {
    return { autoApprove: true, reason: `${approvalPercentage.toFixed(0)}% approval threshold reached` };
  }

  // Hybrid: CFO OR percentage
  if (ruleType === 'hybrid') {
    if (cfoApproved) {
      return { autoApprove: true, reason: 'CFO approved (hybrid rule)' };
    }
    if (approvalPercentage >= threshold) {
      return { autoApprove: true, reason: `${approvalPercentage.toFixed(0)}% approval threshold reached (hybrid rule)` };
    }
  }

  return { autoApprove: false, reason: 'Awaiting more approvals' };
}
