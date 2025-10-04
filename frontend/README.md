# 🎨 Frontend Documentation

## Tech Stack
- React 18
- Vite
- Material-UI (MUI)
- React Router v6
- Axios
- Context API

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx           # Main layout with sidebar
│   └── ProtectedRoute.jsx   # Route protection HOC
├── context/
│   └── AuthContext.jsx      # Authentication state
├── pages/
│   ├── Login.jsx            # Login page
│   ├── Register.jsx         # Registration page
│   ├── Dashboard.jsx        # Dashboard with stats
│   ├── Expenses.jsx         # Expense submission & viewing
│   ├── Approvals.jsx        # Approval workflow (Manager/Admin)
│   ├── Users.jsx            # User management (Admin)
│   └── Settings.jsx         # Approval rules config (Admin)
├── theme.js                 # Material-UI theme config
├── api.js                   # API client & endpoints
├── App.jsx                  # Main app component
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## Color Theme

```javascript
Primary: #00A86B (Green)
Secondary: #000000 (Black)
Background: #FFFFFF (White)
Success: #00A86B
Error: #d32f2f
Warning: #ff9800
Info: #0288d1
```

## Pages Overview

### Login Page (`/login`)
- Email/password authentication
- Demo account credentials displayed
- Redirects to dashboard on success
- Link to registration

### Register Page (`/register`)
- Company creation (first user becomes admin)
- Auto-assigns random currency
- Creates default approval rules
- Immediately logs in user

### Dashboard (`/dashboard`)
- Role: All users
- Statistics cards:
  - Total Expenses
  - Pending Expenses
  - Approved Expenses
  - Rejected Expenses
  - Total Amount
  - Pending Amount
- Quick actions section

### My Expenses (`/expenses`)
- Role: All users
- Submit new expense form
- OCR simulation button
- Currency selection
- Category dropdown
- Expense list table with filters
- View expense details modal
- Approval history tracking

### Approvals (`/approvals`)
- Role: Manager, Admin
- Pending approvals table
- Approve/Reject actions
- Comment input for decisions
- Employee information display
- Amount with currency conversion

### Users (`/users`)
- Role: Admin only
- Create/Edit/Delete users
- Assign roles (Admin/Manager/Employee)
- Assign reporting manager
- User list with role badges

### Settings (`/settings`)
- Role: Admin only
- Configure approval rules:
  - Percentage-based
  - CFO override
  - Hybrid
- Set approval threshold
- Manage approval chain:
  - Add approvers
  - Remove approvers
  - Set approval levels
  - Designate CFO

## Components

### Layout
- Persistent sidebar navigation
- Role-based menu items
- User profile section
- Responsive mobile drawer
- App bar with company name

### ProtectedRoute
- Guards routes based on authentication
- Role-based access control
- Redirects unauthenticated users
- Shows loading state

## Context & State Management

### AuthContext
Provides:
- `user` - Current user object
- `token` - JWT token
- `loading` - Auth loading state
- `login(email, password)` - Login function
- `register(data)` - Registration function
- `logout()` - Logout function
- `isAuthenticated` - Boolean flag

Usage:
```javascript
import { useAuth } from '../context/AuthContext';

const { user, logout, isAuthenticated } = useAuth();
```

## API Integration

### API Client (`api.js`)
- Base URL: `http://localhost:5000/api`
- Automatic token injection
- Response interceptors
- Error handling

### API Methods
```javascript
import { authAPI, expenseAPI, userAPI, rulesAPI } from '../api';

// Auth
authAPI.login(data)
authAPI.register(data)

// Expenses
expenseAPI.create(data)
expenseAPI.getMy()
expenseAPI.getPending()
expenseAPI.approve(id, comment)
expenseAPI.simulateOCR()

// Users
userAPI.getAll()
userAPI.create(data)

// Rules
rulesAPI.get()
rulesAPI.update(data)
```

## Routing

```javascript
/ -> redirects to /dashboard
/login -> Login page (public)
/register -> Register page (public)
/dashboard -> Dashboard (protected)
/expenses -> My Expenses (protected)
/approvals -> Approvals (Manager/Admin only)
/users -> User Management (Admin only)
/settings -> Settings (Admin only)
```

## Material-UI Customization

### Theme Configuration
- Custom color palette
- Typography with Inter font
- Button styling
- Card styling
- TextField styling
- Border radius: 8px

### Common Components Used
- `Card` - Content containers
- `Table` - Data display
- `Dialog` - Modals
- `Button` - Actions
- `TextField` - Form inputs
- `Chip` - Status badges
- `Snackbar` - Notifications
- `CircularProgress` - Loading states

## Forms & Validation

### Expense Form
- Amount (number, required)
- Currency (select, required)
- Category (select, required)
- Description (textarea, required)
- Merchant (text, optional)
- Date (date picker, required)

### User Form
- Name (text, required)
- Email (email, required)
- Password (password, required for new)
- Role (select, required)
- Manager (select, optional)

### Rules Form
- Rule Type (select, required)
- Threshold (number, 1-100)
- Approver (select)
- Level (number)
- Is CFO (boolean)

## Notifications

Toast notifications using MUI Snackbar:
- Success (green)
- Error (red)
- Auto-hide after 6 seconds
- Bottom-right position

## Responsive Design

Breakpoints:
- `xs`: 0-600px (mobile)
- `sm`: 600-960px (tablet)
- `md`: 960-1280px (small laptop)
- `lg`: 1280-1920px (desktop)
- `xl`: 1920px+ (large desktop)

## Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment

Vite automatically proxies `/api` requests to `http://localhost:5000`

## Common Patterns

### Loading State
```javascript
const [loading, setLoading] = useState(true);

if (loading) {
  return <CircularProgress />;
}
```

### Error Handling
```javascript
try {
  const response = await api.call();
} catch (err) {
  setError(err.response?.data?.message || 'Error');
}
```

### Dialog Management
```javascript
const [open, setOpen] = useState(false);

<Dialog open={open} onClose={() => setOpen(false)}>
  {/* content */}
</Dialog>
```

### Snackbar Notifications
```javascript
const [snackbar, setSnackbar] = useState({
  open: false,
  message: '',
  severity: 'success'
});

setSnackbar({
  open: true,
  message: 'Action completed!',
  severity: 'success'
});
```

## Best Practices

1. **State Management**: Use Context for global state, useState for local
2. **API Calls**: Always in useEffect or event handlers
3. **Error Handling**: Try-catch with user-friendly messages
4. **Loading States**: Show loading indicators during async operations
5. **Form Validation**: Use required attributes and custom validation
6. **Accessibility**: Use semantic HTML and ARIA labels
7. **Responsive**: Test on multiple screen sizes

## Styling Guidelines

- Use MUI's `sx` prop for inline styles
- Keep color values in theme.js
- Consistent spacing (8px grid system)
- Border radius: 8-12px
- Box shadows for elevation
- Hover effects on interactive elements

## Testing User Flows

1. **Employee Flow**: Login → Submit Expense → View Status
2. **Manager Flow**: Login → Approvals → Approve/Reject
3. **Admin Flow**: Login → Users → Create User → Settings → Configure Rules
