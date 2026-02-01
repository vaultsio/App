// Authentication Configuration
const AUTH_CONFIG = {
    // Default credentials (change these in production!)
    defaultUsername: 'admin',
    defaultPassword: 'vaultsio2025',
    sessionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    storageKey: 'vaultsio_admin_session'
};

// Hash function for password (simple SHA-256 simulation)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check if user is authenticated
function isAuthenticated() {
    const session = localStorage.getItem(AUTH_CONFIG.storageKey);
    if (!session) return false;
    
    try {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        
        // Check if session is expired
        if (now > sessionData.expiresAt) {
            logout();
            return false;
        }
        
        return sessionData.authenticated === true;
    } catch (error) {
        return false;
    }
}

// Create session
function createSession(rememberMe = false) {
    const now = new Date().getTime();
    const duration = rememberMe ? AUTH_CONFIG.sessionDuration * 7 : AUTH_CONFIG.sessionDuration; // 7 days if remember me
    
    const sessionData = {
        authenticated: true,
        timestamp: now,
        expiresAt: now + duration,
        rememberMe: rememberMe
    };
    
    localStorage.setItem(AUTH_CONFIG.storageKey, JSON.stringify(sessionData));
}

// Logout
function logout() {
    localStorage.removeItem(AUTH_CONFIG.storageKey);
    window.location.href = 'login.html';
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Show error message
function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    errorAlert.style.display = 'flex';
    
    // Hide after 5 seconds
    setTimeout(() => {
        errorAlert.style.display = 'none';
    }, 5000);
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
    // Only run login form code if we're on the login page
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return; // Not on login page, exit
    
    // Redirect if already authenticated
    if (isAuthenticated()) {
        window.location.href = 'admin.html';
        return;
    }
    
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Disable button
        loginBtn.disabled = true;
        loginBtnText.style.display = 'none';
        loginSpinner.style.display = 'inline-block';
        
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check credentials
        if (username === AUTH_CONFIG.defaultUsername && password === AUTH_CONFIG.defaultPassword) {
            // Success!
            createSession(rememberMe);
            
            // Show success state
            loginBtnText.textContent = 'Success!';
            loginBtnText.style.display = 'inline';
            loginSpinner.style.display = 'none';
            loginBtn.style.backgroundColor = 'var(--success)';
            
            // Redirect to admin
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 500);
        } else {
            // Failed
            loginBtn.disabled = false;
            loginBtnText.style.display = 'inline';
            loginSpinner.style.display = 'none';
            
            showError('Invalid username or password. Please try again.');
            
            // Clear password
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
        }
    });
    
    // Focus on username input
    document.getElementById('username').focus();
});
