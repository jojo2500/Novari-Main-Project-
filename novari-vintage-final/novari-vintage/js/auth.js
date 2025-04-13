// Authentication and admin login functionality

// Admin credentials (in a real application, this would be stored securely on the server)
const ADMIN_CREDENTIALS = {
  email: "admin@novari.com",
  password: "admin123",
  role: "admin"
};

// Regular user credentials for demo purposes
const DEMO_USER_CREDENTIALS = {
  email: "user@example.com",
  password: "user123",
  role: "customer"
};

// Function to handle login
function handleLogin(email, password, rememberMe = false) {
  // Check if credentials match admin
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    // Set authentication data in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('rememberMe', rememberMe);
    
    // Redirect to admin page
    window.location.href = 'admin.html';
    return true;
  }
  
  // Check if credentials match demo user
  if (email === DEMO_USER_CREDENTIALS.email && password === DEMO_USER_CREDENTIALS.password) {
    // Set authentication data in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', 'customer');
    localStorage.setItem('rememberMe', rememberMe);
    
    // Redirect to account page
    window.location.href = 'account.html?section=dashboard';
    return true;
  }
  
  // If no match, return false
  return false;
}

// Function to handle logout
function handleLogout() {
  // Clear authentication data from localStorage
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  localStorage.removeItem('rememberMe');
  
  // Redirect to login page
  window.location.href = 'account.html';
}

// Function to check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Function to check if user is admin
function isAdmin() {
  return isLoggedIn() && localStorage.getItem('userRole') === 'admin';
}

// Function to get current user data
function getCurrentUser() {
  if (!isLoggedIn()) return null;
  
  return {
    email: localStorage.getItem('userEmail'),
    role: localStorage.getItem('userRole')
  };
}

// Function to protect admin routes
function protectAdminRoute() {
  if (!isLoggedIn() || !isAdmin()) {
    // Redirect to login page
    window.location.href = 'account.html';
    return false;
  }
  return true;
}

// Function to protect authenticated routes
function protectAuthenticatedRoute() {
  if (!isLoggedIn()) {
    // Redirect to login page
    window.location.href = 'account.html';
    return false;
  }
  return true;
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
  // Check if on admin page
  if (window.location.pathname.includes('admin.html')) {
    protectAdminRoute();
  }
  
  // Check if on account page
  if (window.location.pathname.includes('account.html')) {
    initializeAccountPage();
  }
  
  // Update navigation based on authentication status
  updateNavigation();
});

// Initialize account page
function initializeAccountPage() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const accountTabs = document.getElementById('accountTabs');
  const loginRegisterSection = document.getElementById('loginRegisterSection');
  const accountDashboard = document.getElementById('accountDashboard');
  
  // If user is logged in, show dashboard
  if (isLoggedIn()) {
    if (loginRegisterSection) loginRegisterSection.style.display = 'none';
    if (accountDashboard) accountDashboard.style.display = 'block';
    
    // Update user info
    updateUserInfo();
    
    // Setup logout button
    setupLogoutButton();
    
    // If user is admin, show admin link
    if (isAdmin()) {
      const adminLink = document.querySelector('.account-menu a[data-section="admin"]');
      if (adminLink) {
        adminLink.style.display = 'block';
      }
    }
  } else {
    // Show login/register forms
    if (loginRegisterSection) loginRegisterSection.style.display = 'block';
    if (accountDashboard) accountDashboard.style.display = 'none';
  }
  
  // Setup login form
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const rememberMe = document.getElementById('rememberMe').checked;
      
      const loginSuccess = handleLogin(email, password, rememberMe);
      
      if (!loginSuccess) {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger mt-3';
        errorMessage.textContent = 'Invalid email or password. Try admin@novari.com / admin123 for admin access.';
        
        // Remove any existing error messages
        const existingError = loginForm.querySelector('.alert');
        if (existingError) {
          existingError.remove();
        }
        
        // Add error message to form
        loginForm.appendChild(errorMessage);
      }
    });
  }
  
  // Setup register form
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // In a real implementation, this would create a new user
      // For this demo, we'll just show a success message
      
      // Show success message
      showToast('Registration successful! Please check your email to confirm your account.');
      
      // Reset form
      this.reset();
      
      // Switch to login tab
      if (accountTabs) {
        const loginTab = accountTabs.querySelector('button[data-bs-target="#login-tab-pane"]');
        if (loginTab) {
          const tabInstance = new bootstrap.Tab(loginTab);
          tabInstance.show();
        }
      }
    });
  }
}

// Update user info in account dashboard
function updateUserInfo() {
  const user = getCurrentUser();
  if (!user) return;
  
  // Update user name elements
  const userNameElements = document.querySelectorAll('.user-name');
  userNameElements.forEach(element => {
    element.textContent = user.email.split('@')[0] || 'User';
  });
  
  // Update user email elements
  const userEmailElements = document.querySelectorAll('.user-email');
  userEmailElements.forEach(element => {
    element.textContent = user.email || 'user@example.com';
  });
  
  // Update role badge if exists
  const roleBadge = document.querySelector('.role-badge');
  if (roleBadge) {
    roleBadge.textContent = user.role === 'admin' ? 'Administrator' : 'Customer';
    roleBadge.className = `role-badge badge ${user.role === 'admin' ? 'bg-danger' : 'bg-success'}`;
  }
}

// Setup logout button
function setupLogoutButton() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
    });
  }
}

// Update navigation based on authentication status
function updateNavigation() {
  const accountIcon = document.querySelector('.nav-icon[title="Account"] i');
  if (accountIcon) {
    if (isLoggedIn()) {
      accountIcon.className = 'fas fa-user';
    } else {
      accountIcon.className = 'far fa-user';
    }
  }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    handleLogin,
    handleLogout,
    isLoggedIn,
    isAdmin,
    getCurrentUser,
    protectAdminRoute,
    protectAuthenticatedRoute
  };
}
