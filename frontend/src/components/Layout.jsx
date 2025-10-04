import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Approval as ApprovalIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  ExitToApp as LogoutIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['Admin', 'Manager', 'Employee'] },
    { text: 'My Expenses', icon: <ReceiptIcon />, path: '/expenses', roles: ['Admin', 'Manager', 'Employee'] },
    { text: 'Approvals', icon: <ApprovalIcon />, path: '/approvals', roles: ['Admin', 'Manager'] },
    { text: 'Users', icon: <PeopleIcon />, path: '/users', roles: ['Admin'] },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', roles: ['Admin'] },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#000' }}>
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h5" sx={{ color: '#00A86B', fontWeight: 700, mb: 0.5 }}>
          ExpenseHub
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Expense Management
        </Typography>
      </Box>

      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {menuItems
          .filter((item) => item.roles.includes(user?.role))
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <Tooltip title={item.text} placement="right" arrow>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }}
                    selected={isActive}
                    sx={{
                      borderRadius: 3,
                      py: 1.5,
                      color: 'rgba(255,255,255,0.7)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': isActive ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        bgcolor: '#00A86B',
                        borderRadius: '0 4px 4px 0',
                      } : {},
                      '&:hover': {
                        bgcolor: 'rgba(0, 168, 107, 0.15)',
                        color: '#00A86B',
                        transform: 'translateX(8px)',
                        '& .MuiListItemIcon-root': {
                          transform: 'scale(1.1)',
                        },
                      },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(0, 168, 107, 0.2)',
                        color: '#00A86B',
                        '&:hover': {
                          bgcolor: 'rgba(0, 168, 107, 0.25)',
                        },
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: 'inherit', 
                        minWidth: 40,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 500,
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#fff', px: 1 }}>
          <Avatar sx={{ bgcolor: '#00A86B', width: 36, height: 36, mr: 1.5 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff', noWrap: true }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              {user?.role}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#fff',
          color: '#000',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'rotate(90deg)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #00A86B 0%, #00824F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            {user?.companyId?.name || 'Dashboard'}
          </Typography>

          <Tooltip title="Notifications">
            <IconButton 
              sx={{ 
                color: '#000',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: '#00A86B',
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton 
              onClick={handleMenuOpen} 
              sx={{ 
                color: '#000',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: '#00A86B',
                },
              }}
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>

          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                '& .MuiMenuItem-root': {
                  borderRadius: 1,
                  mx: 1,
                  my: 0.5,
                },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                {user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main', mt: 1 }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: '#f5f7fa',
          minHeight: '100vh',
          transition: 'all 0.3s ease',
        }}
      >
        <Box
          sx={{
            animation: 'fadeIn 0.5s ease',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
