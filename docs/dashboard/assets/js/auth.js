// ===== AEGISENS DASHBOARD AUTHENTICATION =====
const CORRECT_PASSWORD = "AegisensStealth2025";
let loginAttempts = 0;
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 30000; // 30 seconds

function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const inputValue = passwordInput.value.trim();
    
    // Easter egg
    if (inputValue.toLowerCase() === 'alpaca') {
        alert('🦙 Alpaca mode activated! Welcome to the secret garden.');
        inputValue = CORRECT_PASSWORD; // Auto-correct to real password
    }
    
    // Check if locked out
    const lockoutUntil = localStorage.getItem('aegisens_lockout_until');
    if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
        const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000);
        errorMessage.textContent = Too many attempts. Try again in ${remaining} seconds.;
        passwordInput.classList.add('error');
        return;
    }
    
    // Check password
    if (inputValue === CORRECT_PASSWORD) {
        // Successful login
        loginAttempts = 0;
        localStorage.removeItem('aegisens_lockout_until');
        localStorage.setItem('aegisens-authenticated', 'true');
        
        // Hide login screen, show dashboard
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboardContainer').classList.add('visible');
        
        // Trigger event for other scripts
        window.dispatchEvent(new Event('login-success'));
        
        // Save login timestamp
        localStorage.setItem('aegisens_login_time', Date.now().toString());
        
    } else {
        // Failed login
        loginAttempts++;
        passwordInput.classList.add('error');
        errorMessage.textContent = 'Incorrect password. Please try again.';
        passwordInput.value = '';
        
        // Check if max attempts reached
        if (loginAttempts >= MAX_ATTEMPTS) {
            const lockoutUntil = Date.now() + LOCKOUT_TIME;
            localStorage.setItem('aegisens_lockout_until', lockoutUntil.toString());
            errorMessage.textContent = Too many incorrect attempts. Locked for 30 seconds.;
            passwordInput.disabled = true;
            
            setTimeout(() => {
                passwordInput.disabled = false;
                loginAttempts = 0;
                localStorage.removeItem('aegisens_lockout_until');
                errorMessage.textContent = '';
                passwordInput.classList.remove('error');
                passwordInput.focus();
            }, LOCKOUT_TIME);
        }
        
        // Shake animation
        passwordInput.style.animation = 'none';
        setTimeout(() => {
            passwordInput.style.animation = 'shake 0.5s';
        }, 10);
    }
}

// Check if already authenticated
function checkExistingAuth() {
    const isAuthenticated = localStorage.getItem('aegisens-authenticated');
    const loginTime = parseInt(localStorage.getItem('aegisens_login_time') || '0');
    const sessionDuration = 12 * 60 * 60 * 1000; // 12 hours
    
    if (isAuthenticated && (Date.now() - loginTime) < sessionDuration) {
        // Auto-login
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboardContainer').classList.add('visible');
        window.dispatchEvent(new Event('login-success'));
    } else {
        // Clear expired session
        localStorage.removeItem('aegisens-authenticated');
        localStorage.removeItem('aegisens_login_time');
    }
}

// Enter key support
document.getElementById('passwordInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});
// Focus password input on load
window.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        setTimeout(() => passwordInput.focus(), 100);
    }
    checkExistingAuth();
});

// Logout function (called from index.html)
window.logout = function() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('aegisens-authenticated');
        localStorage.removeItem('aegisens_login_time');
        window.location.reload();
    }
};
