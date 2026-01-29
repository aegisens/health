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
function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const loginScreen = document.getElementById('loginScreen');
    const password = passwordInput.value;
    
    // Wyczyść błędy
    errorMessage.textContent = '';
    passwordInput.style.borderColor = '';
    
    // Hasło: 'AegisensStealth2025' (ZMIEN NA SWOJE)
    if (password === 'AegisensStealth2025') {
        // UKRYJ login screen
        loginScreen.style.display = 'none';
        
        // POKAŻ dashboard (zakładam że masz <div id="dashboard"> po login-screen)
        const dashboard = document.getElementById('dashboard');
        if (dashboard) {
            dashboard.style.display = 'block';
        }
        
        // Zapisz logowanie
        localStorage.setItem('aegisensLoggedIn', 'true');
        
    } else {
        // BŁĄD
        errorMessage.textContent = '❌ Nieprawidłowe hasło';
        errorMessage.style.color = '#ff6b6b';
        passwordInput.style.borderColor = '#ff6b6b';
        passwordInput.focus();
    }
}

// Automatyczne logowanie przy odświeżeniu
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('aegisensLoggedIn') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        const dashboard = document.getElementById('dashboard');
        if (dashboard) dashboard.style.display = 'block';
    }
});
        
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
