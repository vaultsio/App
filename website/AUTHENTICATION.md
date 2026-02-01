# VaultSio Admin Authentication Guide

## Overview
The VaultSio admin dashboard is now protected with a simple authentication system using localStorage-based sessions.

## Features

✅ **Login Page** - Dedicated login interface  
✅ **Session Management** - 24-hour sessions (7 days with "Remember Me")  
✅ **Auto-redirect** - Unauthenticated users redirected to login  
✅ **Logout Functionality** - Secure session termination  
✅ **Password Visibility Toggle** - Show/hide password  
✅ **Remember Me** - Extended session option  
✅ **Session Expiry** - Automatic logout after expiration  

## Access the Admin Dashboard

### Step 1: Navigate to Login Page
```
http://localhost:8000/login.html
```

### Step 2: Enter Credentials

**Default Credentials:**
- **Username:** `admin`
- **Password:** `vaultsio2025`

### Step 3: Access Dashboard
After successful login, you'll be redirected to the admin dashboard.

## File Structure

```
/website
  ├── login.html           # Login page
  ├── admin.html           # Protected admin dashboard
  ├── css/
  │   └── login.css       # Login page styles
  └── js/
      ├── login.js        # Authentication logic
      └── admin.js        # Dashboard (now protected)
```

## How It Works

### 1. Session Creation
When you log in successfully:
- A session object is created with timestamp and expiry
- Stored in localStorage as `vaultsio_admin_session`
- Default duration: 24 hours
- "Remember Me": 7 days

### 2. Authentication Check
Every time you access `admin.html`:
- Checks if valid session exists
- Verifies session hasn't expired
- Redirects to login if not authenticated

### 3. Logout
Clicking the logout button:
- Removes session from localStorage
- Redirects to login page
- Clears all authentication data

## Changing Default Credentials

To change the default username and password, edit `js/login.js`:

```javascript
const AUTH_CONFIG = {
    defaultUsername: 'your_username',    // Change this
    defaultPassword: 'your_password',     // Change this
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours
    storageKey: 'vaultsio_admin_session'
};
```

## Security Features

### Current Implementation (Client-Side)
- ✅ Session expiry
- ✅ Session validation
- ✅ Automatic logout
- ✅ Password masking
- ✅ Redirect protection

### Limitations (Client-Side Only)
- ⚠️ Credentials stored in JavaScript (visible in source code)
- ⚠️ Sessions stored in localStorage (client-side only)
- ⚠️ No server-side validation
- ⚠️ No password hashing in storage
- ⚠️ No rate limiting

## Production Recommendations

For a production environment, you should implement:

### 1. Backend Authentication
```javascript
// Example: Connect to real authentication API
async function login(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('auth_token', token);
        return true;
    }
    return false;
}
```

### 2. Environment Variables
Move credentials to environment variables:
```javascript
const AUTH_CONFIG = {
    apiUrl: process.env.API_URL,
    // Never store credentials in frontend code
};
```

### 3. JWT Tokens
Use JWT tokens for better security:
```javascript
// Store JWT token
localStorage.setItem('auth_token', jwtToken);

// Send with each request
fetch('/api/admin/posts', {
    headers: {
        'Authorization': `Bearer ${jwtToken}`
    }
});
```

### 4. HTTPS Only
Always use HTTPS in production to encrypt data in transit.

### 5. Session Security
- Use httpOnly cookies (requires backend)
- Implement CSRF protection
- Add rate limiting for login attempts
- Use secure password hashing (bcrypt, argon2)

## Upgrading to Production Auth

### Option 1: Use Firebase Authentication
```javascript
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        // Redirect to admin
    })
    .catch((error) => {
        // Handle errors
    });
```

### Option 2: Custom Backend API
Set up a Node.js/Express backend:

```javascript
// Backend (server.js)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Verify credentials from database
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    // Create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
});
```

### Option 3: Use Auth Services
- **Auth0** - auth0.com
- **Clerk** - clerk.dev
- **Supabase** - supabase.com
- **AWS Cognito** - aws.amazon.com/cognito

## Testing the Authentication

### Test Successful Login
1. Go to `http://localhost:8000/login.html`
2. Enter: `admin` / `vaultsio2025`
3. Click "Sign In"
4. Should redirect to admin dashboard

### Test Failed Login
1. Go to `http://localhost:8000/login.html`
2. Enter wrong credentials
3. Should show error message

### Test Session Persistence
1. Log in successfully
2. Close browser tab
3. Open `http://localhost:8000/admin.html` directly
4. Should stay logged in (if session not expired)

### Test Logout
1. Log in and access admin
2. Click "Logout" button
3. Should redirect to login page
4. Try accessing `admin.html` directly
5. Should redirect to login page

### Test Session Expiry
1. Log in
2. In browser console, run:
```javascript
// Manually expire session
const session = JSON.parse(localStorage.getItem('vaultsio_admin_session'));
session.expiresAt = Date.now() - 1000;
localStorage.setItem('vaultsio_admin_session', JSON.stringify(session));
```
3. Refresh page or access admin
4. Should redirect to login

## Troubleshooting

### Can't Log In
- Check browser console for errors
- Verify credentials: `admin` / `vaultsio2025`
- Clear localStorage and try again
- Check if JavaScript is enabled

### Session Not Persisting
- Check if localStorage is enabled in browser
- Verify session data exists: 
  ```javascript
  localStorage.getItem('vaultsio_admin_session')
  ```
- Clear browser cache and cookies

### Logout Not Working
- Check browser console for errors
- Manually clear session:
  ```javascript
  localStorage.removeItem('vaultsio_admin_session')
  ```

### Session Expires Too Quickly
Edit session duration in `js/login.js`:
```javascript
sessionDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
```

## Best Practices

1. **Change Default Credentials**
   - Never use default credentials in production
   - Use strong, unique passwords

2. **Regular Security Audits**
   - Review access logs
   - Monitor failed login attempts
   - Update dependencies regularly

3. **Use HTTPS**
   - Always serve over HTTPS in production
   - Use SSL certificates

4. **Implement 2FA** (Production)
   - Add two-factor authentication
   - Use TOTP or SMS verification

5. **Access Logs**
   - Track login attempts
   - Monitor admin actions
   - Set up alerts for suspicious activity

## Quick Commands

### Clear All Sessions
```javascript
// Run in browser console
localStorage.removeItem('vaultsio_admin_session');
location.reload();
```

### Check Current Session
```javascript
// Run in browser console
const session = localStorage.getItem('vaultsio_admin_session');
console.log(JSON.parse(session));
```

### Force Logout
```javascript
// Run in browser console
logout();
```

---

**Remember:** This is a client-side authentication system suitable for development and personal use. For production applications with sensitive data, always implement proper backend authentication with server-side validation, encrypted credentials, and secure token management.
