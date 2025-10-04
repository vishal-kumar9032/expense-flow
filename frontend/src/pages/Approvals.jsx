import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  Close,
} from '@mui/icons-material';
import { expenseAPI } from '../api';

const Approvals = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [actionType, setActionType] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchPendingExpenses();
  }, []);

  const fetchPendingExpenses = async () => {
    try {
      const response = await expenseAPI.getPending();
      setExpenses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (expense, action) => {
    setSelectedExpense(expense);
    setActionType(action);
    setComment('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExpense(null);
    setActionType('');
    setComment('');
  };

  const handleSubmitAction = async () => {
    if (!selectedExpense) return;

    setSubmitting(true);
    try {
      if (actionType === 'approve') {
        await expenseAPI.approve(selectedExpense._id, comment);
        setSnackbar({
          open: true,
          message: 'Expense approved successfully!',
          severity: 'success',
        });
      } else {
        await expenseAPI.reject(selectedExpense._id, comment);
        setSnackbar({
          open: true,
          message: 'Expense rejected successfully!',
          severity: 'success',
        });
      }
      handleCloseDialog();
      fetchPendingExpenses();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Action failed',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      case 'In Review':
        return 'info';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Pending Approvals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve expense requests
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No pending approvals at this time
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  expenses.map((expense) => (
                    <TableRow key={expense._id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {expense.employeeId?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {expense.employeeId?.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {expense.currency} {expense.amount.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ≈ {expense.companyCurrency} {expense.convertedAmount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={expense.status} color={getStatusColor(expense.status)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(expense, 'approve')}
                            sx={{ color: '#00A86B' }}
                          >
                            <CheckCircle />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(expense, 'reject')}
                            sx={{ color: '#f44336' }}
                          >
                            <Cancel />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {actionType === 'approve' ? 'Approve Expense' : 'Reject Expense'}
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedExpense && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Employee
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedExpense.employeeId?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(selectedExpense.date).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedExpense.currency} {selectedExpense.amount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedExpense.category}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {selectedExpense.description}
                  </Typography>
                </Grid>
                {selectedExpense.merchant && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Merchant
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedExpense.merchant}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <TextField
                fullWidth
                label="Comment"
                multiline
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'Optional: Add approval comment...'
                    : 'Please provide a reason for rejection...'
                }
                required={actionType === 'reject'}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitAction}
            disabled={submitting || (actionType === 'reject' && !comment)}
            sx={{
              bgcolor: actionType === 'approve' ? '#00A86B' : '#f44336',
              '&:hover': {
                bgcolor: actionType === 'approve' ? '#00824F' : '#d32f2f',
              },
            }}
          >
            {submitting ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Approvals;
