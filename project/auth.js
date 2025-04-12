// auth.js - Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    // If on login page and already logged in, redirect appropriately
    if (window.location.pathname.includes('account.html') && isLoggedIn) {
        if (userRole === 'admin') {
            window.location.href = 'admin.html';
        } else {
            showAccountPage();
        }
        return;
    }

    // If on admin page without admin privileges, redirect to login
    if (window.location.pathname.includes('admin.html') && (!isLoggedIn || userRole !== 'admin')) {
        window.location.href = 'account.html';
        return;
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me')?.checked;
            
            // Check for admin credentials
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('userEmail', 'admin@novari.com');
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                window.location.href = 'admin.html';
                return;
            }
            
            // Normal user login (in a real app, you'd validate against your API)
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'user');
            localStorage.setItem('userEmail', username + '@example.com');
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            showAccountPage();
        });
    }

    // Logout functionality
    document.querySelectorAll('.btn-logout').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('rememberMe');
                window.location.href = 'account.html';
            }
        });
    });

    // Update navigation based on login status
    updateNavigation();
});

function showAccountPage() {
    const loginContainer = document.getElementById('login-container');
    const accountContainer = document.getElementById('account-container');
    
    if (loginContainer) loginContainer.classList.add('d-none');
    if (accountContainer) accountContainer.classList.remove('d-none');
    
    // Load user data
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    document.querySelectorAll('.user-email').forEach(el => el.textContent = userEmail);
    document.querySelectorAll('.username').forEach(el => {
        el.textContent = userEmail.split('@')[0];
    });
}

function updateNavigation() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    const loginLink = document.getElementById('loginLink');
    const accountLink = document.getElementById('accountLink');
    const adminLink = document.getElementById('adminLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (accountLink) accountLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'block';
        
        if (userRole === 'admin' && adminLink) {
            adminLink.style.display = 'block';
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (accountLink) accountLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('login-password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }
});