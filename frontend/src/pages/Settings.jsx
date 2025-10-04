import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { rulesAPI, userAPI } from '../api';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rules, setRules] = useState(null);
  const [managers, setManagers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    ruleType: 'percentage',
    threshold: 60,
  });

  const [newApprover, setNewApprover] = useState({
    userId: '',
    level: 1,
    role: '',
    isCFO: false,
  });

  useEffect(() => {
    fetchRules();
    fetchManagers();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await rulesAPI.get();
      setRules(response.data);
      setFormData({
        ruleType: response.data.ruleType,
        threshold: response.data.threshold,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await userAPI.getManagers();
      setManagers(response.data);
    } catch (err) {
      console.error('Failed to fetch managers');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApproverChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userId') {
      const selectedManager = managers.find(m => m._id === value);
      setNewApprover({
        ...newApprover,
        userId: value,
        role: selectedManager?.role || '',
      });
    } else {
      setNewApprover({ ...newApprover, [name]: value });
    }
  };

  const handleUpdateRules = async (e) => {
    e.preventDefault();
    try {
      await rulesAPI.update({
        ruleType: formData.ruleType,
        threshold: formData.threshold,
      });
      setSnackbar({
        open: true,
        message: 'Approval rules updated successfully!',
        severity: 'success',
      });
      fetchRules();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update rules',
        severity: 'error',
      });
    }
  };

  const handleAddApprover = async () => {
    if (!newApprover.userId) {
      setSnackbar({
        open: true,
        message: 'Please select a user',
        severity: 'error',
      });
      return;
    }

    try {
      await rulesAPI.addApprover(newApprover);
      setSnackbar({
        open: true,
        message: 'Approver added successfully!',
        severity: 'success',
      });
      setNewApprover({
        userId: '',
        level: 1,
        role: '',
        isCFO: false,
      });
      fetchRules();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to add approver',
        severity: 'error',
      });
    }
  };

  const handleRemoveApprover = async (userId) => {
    try {
      await rulesAPI.removeApprover(userId);
      setSnackbar({
        open: true,
        message: 'Approver removed successfully!',
        severity: 'success',
      });
      fetchRules();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to remove approver',
        severity: 'error',
      });
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
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure approval rules and workflow settings
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Approval Rules */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Approval Rules
              </Typography>
              
              <form onSubmit={handleUpdateRules}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Rule Type"
                      name="ruleType"
                      value={formData.ruleType}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="percentage">Percentage Based</MenuItem>
                      <MenuItem value="cfo">CFO Override</MenuItem>
                      <MenuItem value="hybrid">Hybrid (Percentage OR CFO)</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Approval Threshold (%)"
                      name="threshold"
                      type="number"
                      value={formData.threshold}
                      onChange={handleChange}
                      required
                      inputProps={{ min: 1, max: 100 }}
                      helperText="Percentage of approvers required for auto-approval"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ bgcolor: '#00A86B', '&:hover': { bgcolor: '#00824F' } }}
                    >
                      Update Rules
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  How Rules Work:
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • <strong>Percentage:</strong> Auto-approve when X% of approvers approve
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                  • <strong>CFO Override:</strong> Instant approval if CFO approves
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  • <strong>Hybrid:</strong> Either condition triggers auto-approval
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Approval Chain */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Approval Chain
              </Typography>

              <List sx={{ mb: 2 }}>
                {rules?.approvers?.sort((a, b) => a.level - b.level).map((approver, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveApprover(approver.userId._id)}
                        sx={{ color: '#f44336' }}
                      >
                        <Delete />
                      </IconButton>
                    }
                    sx={{
                      bgcolor: '#f5f5f5',
                      borderRadius: 2,
                      mb: 1,
                      border: approver.isCFO ? '2px solid #00A86B' : 'none',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Level {approver.level}: {approver.userId.name}
                          </Typography>
                          {approver.isCFO && (
                            <Typography
                              variant="caption"
                              sx={{
                                bgcolor: '#00A86B',
                                color: '#fff',
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                fontWeight: 600,
                              }}
                            >
                              CFO
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={`${approver.role} • ${approver.userId.email}`}
                    />
                  </ListItem>
                ))}
                {(!rules?.approvers || rules.approvers.length === 0) && (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No approvers configured
                  </Typography>
                )}
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Add New Approver
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Select User"
                    name="userId"
                    value={newApprover.userId}
                    onChange={handleApproverChange}
                  >
                    <MenuItem value="">Select a user...</MenuItem>
                    {managers.map((manager) => (
                      <MenuItem key={manager._id} value={manager._id}>
                        {manager.name} ({manager.role})
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Level"
                    name="level"
                    type="number"
                    value={newApprover.level}
                    onChange={handleApproverChange}
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="Is CFO?"
                    name="isCFO"
                    value={newApprover.isCFO}
                    onChange={handleApproverChange}
                  >
                    <MenuItem value={false}>No</MenuItem>
                    <MenuItem value={true}>Yes</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddApprover}
                    sx={{
                      borderColor: '#00A86B',
                      color: '#00A86B',
                      '&:hover': {
                        borderColor: '#00824F',
                        bgcolor: 'rgba(0, 168, 107, 0.05)',
                      },
                    }}
                  >
                    Add Approver
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default Settings;
