// ===== AUTHENTICATION =====
const CORRECT_PASSWORD = "AegisensStealth2025";
let loginAttempts = 0;

function checkPassword() {
    const input = document.getElementById('passwordInput');
    const error = document.getElementById('errorMessage');
    const value = input.value.trim();
    
    if (value === CORRECT_PASSWORD) {
        // Login success
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';
        localStorage.setItem('aegisens-login', 'true');
    } else {
        // Login failed
        error.textContent = 'Incorrect password. Try: ' + CORRECT_PASSWORD;
        input.classList.add('error');
        loginAttempts++;
        
        if (loginAttempts >= 3) {
            error.textContent = 'Too many attempts. Refresh page.';
            input.disabled = true;
        }
    }
}

// Enter key support
document.getElementById('passwordInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkPassword();
});

// Auto-login if previously logged in
if (localStorage.getItem('aegisens-login') === 'true') {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardContainer').style.display = 'block';
}
