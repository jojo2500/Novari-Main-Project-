// Main JavaScript file for Novari Vintage website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize all Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }

    // Product image hover effect
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length) {
        productCards.forEach(card => {
            const primaryImage = card.querySelector('.primary-image');
            const secondaryImage = card.querySelector('.secondary-image');
            
            if (primaryImage && secondaryImage) {
                // Preload secondary image
                const preloadImage = new Image();
                preloadImage.src = secondaryImage.src;
            }
        });
    }

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    if (wishlistButtons.length) {
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('active');
                
                const heartIcon = this.querySelector('i');
                if (heartIcon) {
                    if (heartIcon.classList.contains('far')) {
                        heartIcon.classList.remove('far');
                        heartIcon.classList.add('fas');
                        showToast('Item added to favorites');
                    } else {
                        heartIcon.classList.remove('fas');
                        heartIcon.classList.add('far');
                        showToast('Item removed from favorites');
                    }
                }
                
                // Update favorites count in header
                updateFavoritesCount();
            });
        });
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    if (addToCartButtons.length) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get product info
                const card = this.closest('.product-card');
                const productName = card ? card.querySelector('.card-title').textContent : 'Product';
                
                // Show success message
                showToast(`${productName} added to cart`);
                
                // Update cart count in header
                updateCartCount();
            });
        });
    }

    // Quantity selector in cart
    const quantitySelectors = document.querySelectorAll('.quantity-selector');
    if (quantitySelectors.length) {
        quantitySelectors.forEach(selector => {
            const minusBtn = selector.querySelector('.qty-btn:first-child');
            const plusBtn = selector.querySelector('.qty-btn:last-child');
            const qtyInput = selector.querySelector('.qty-value');
            
            if (minusBtn && plusBtn && qtyInput) {
                minusBtn.addEventListener('click', function() {
                    let currentQty = parseInt(qtyInput.textContent);
                    if (currentQty > 1) {
                        qtyInput.textContent = currentQty - 1;
                        updateCartTotals();
                    }
                });
                
                plusBtn.addEventListener('click', function() {
                    let currentQty = parseInt(qtyInput.textContent);
                    qtyInput.textContent = currentQty + 1;
                    updateCartTotals();
                });
            }
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // In a real implementation, this would send the data to a server
                showToast('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }

    // Search functionality
    const searchForms = document.querySelectorAll('.search-form');
    if (searchForms.length) {
        searchForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const searchInput = this.querySelector('.search-input');
                if (searchInput && searchInput.value) {
                    // In a real implementation, this would redirect to search results
                    window.location.href = `shop.html?search=${encodeURIComponent(searchInput.value)}`;
                }
            });
        });
    }

    // Account form validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!this.checkValidity()) {
                e.stopPropagation();
            } else {
                // Simulate login (in a real implementation, this would authenticate with a server)
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const rememberMe = document.getElementById('rememberMe').checked;
                
                // For demo purposes only - never store credentials like this in production
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('rememberMe', rememberMe);
                
                // Redirect to account dashboard
                window.location.href = 'account.html?section=dashboard';
            }
            
            this.classList.add('was-validated');
        });
    }

    // Registration form validation
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!this.checkValidity()) {
                e.stopPropagation();
            } else {
                // Simulate registration (in a real implementation, this would send data to a server)
                const email = document.getElementById('registerEmail').value;
                
                // Show success message
                showToast('Registration successful! Please check your email to confirm your account.');
                
                // Reset form
                this.reset();
                this.classList.remove('was-validated');
                
                // Switch to login tab
                const loginTab = document.querySelector('#accountTabs button[data-bs-target="#login-tab-pane"]');
                if (loginTab) {
                    const tabInstance = new bootstrap.Tab(loginTab);
                    tabInstance.show();
                }
            }
            
            this.classList.add('was-validated');
        });
    }

    // Check authentication status for account pages
    checkAuthStatus();

    // Initialize account dashboard if on account page
    initializeAccountDashboard();
});

// Helper Functions

// Show toast notification
function showToast(message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">Novari</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    // Initialize and show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Remove toast after it's hidden
    toastElement.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

// Update favorites count in header
function updateFavoritesCount() {
    const favoritesCountBadge = document.querySelector('.nav-icon[title="Wishlist"] .badge');
    if (favoritesCountBadge) {
        // Get current count
        let count = parseInt(favoritesCountBadge.textContent);
        
        // Toggle count based on active wishlist buttons
        const activeWishlistButtons = document.querySelectorAll('.btn-wishlist.active');
        count = activeWishlistButtons.length;
        
        // Update badge
        favoritesCountBadge.textContent = count;
        favoritesCountBadge.setAttribute('aria-label', `${count} items in wishlist`);
        
        // Hide badge if count is 0
        if (count === 0) {
            favoritesCountBadge.style.display = 'none';
        } else {
            favoritesCountBadge.style.display = 'block';
        }
    }
}

// Update cart count in header
function updateCartCount() {
    const cartCountBadge = document.querySelector('.nav-icon[title="Cart"] .badge');
    if (cartCountBadge) {
        // Get current count
        let count = parseInt(cartCountBadge.textContent);
        
        // Increment count
        count++;
        
        // Update badge
        cartCountBadge.textContent = count;
        cartCountBadge.setAttribute('aria-label', `${count} items in cart`);
    }
}

// Update cart totals when quantity changes
function updateCartTotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const priceElement = item.querySelector('.item-price-value');
        const quantityElement = item.querySelector('.qty-value');
        
        if (priceElement && quantityElement) {
            const price = parseFloat(priceElement.getAttribute('data-price'));
            const quantity = parseInt(quantityElement.textContent);
            const itemTotal = price * quantity;
            
            // Update item total display
            priceElement.textContent = '$' + itemTotal.toFixed(2);
            
            // Add to subtotal
            subtotal += itemTotal;
        }
    });
    
    // Update subtotal display
    const subtotalElement = document.querySelector('.summary-row:first-child span:last-child');
    if (subtotalElement) {
        subtotalElement.textContent = '$' + subtotal.toFixed(2);
    }
    
    // Calculate and update shipping
    let shipping = 5.99; // Default shipping cost
    const shippingElement = document.querySelector('.summary-row:nth-child(2) span:last-child');
    if (shippingElement) {
        // Free shipping for orders over $100
        if (subtotal >= 100) {
            shipping = 0;
            shippingElement.textContent = 'Free';
            shippingElement.classList.add('free');
        } else {
            shippingElement.textContent = '$' + shipping.toFixed(2);
            shippingElement.classList.remove('free');
        }
    }
    
    // Calculate and update tax (assuming 8% tax rate)
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const taxElement = document.querySelector('.summary-row:nth-child(3) span:last-child');
    if (taxElement) {
        taxElement.textContent = '$' + tax.toFixed(2);
    }
    
    // Calculate and update total
    const total = subtotal + shipping + tax;
    const totalElement = document.querySelector('.summary-row.total span:last-child');
    if (totalElement) {
        totalElement.textContent = '$' + total.toFixed(2);
    }
}

// Check authentication status for account pages
function checkAuthStatus() {
    const isAccountPage = window.location.pathname.includes('account.html');
    const isAdminPage = window.location.pathname.includes('admin.html');
    
    if (isAccountPage || isAdminPage) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole') || 'customer';
        
        if (isAdminPage && (!isLoggedIn || userRole !== 'admin')) {
            // Redirect non-admin users from admin page
            window.location.replace('account.html');
            return;
        }
        
        if (isAccountPage) {
            const accountTabs = document.getElementById('accountTabs');
            const accountContent = document.getElementById('accountContent');
            const loginRegisterSection = document.getElementById('loginRegisterSection');
            const accountDashboard = document.getElementById('accountDashboard');
            
            if (accountTabs && accountContent && loginRegisterSection && accountDashboard) {
                if (isLoggedIn) {
                    // Show account dashboard for logged in users
                    loginRegisterSection.style.display = 'none';
                    accountDashboard.style.display = 'block';
                    
                    // Update user info
                    const userNameElements = document.querySelectorAll('.user-name');
                    userNameElements.forEach(element => {
                        element.textContent = userEmail.split('@')[0] || 'User';
                    });
                    
                    const userEmailElements = document.querySelectorAll('.user-email');
                    userEmailElements.forEach(element => {
                        element.textContent = userEmail || 'user@example.com';
                    });
                } else {
                    // Show login/register for logged out users
                    loginRegisterSection.style.display = 'block';
                    accountDashboard.style.display = 'none';
                }
            }
        }
    }
}

// Initialize account dashboard
function initializeAccountDashboard() {
    const accountDashboard = document.getElementById('accountDashboard');
    if (!accountDashboard) return;
    
    // Handle account menu navigation
    const accountMenuLinks = document.querySelectorAll('.account-menu .nav-link');
    const accountSections = document.querySelectorAll('.account-section');
    
    if (accountMenuLinks.length && accountSections.length) {
        // Check URL for section parameter
        const urlParams = new URLSearchParams(window.location.search);
        const sectionParam = urlParams.get('section');
        
        // Default to dashboard if no section specified
        let activeSection = sectionParam || 'dashboard';
        
        // Show active section and highlight active menu item
        showAccountSection(activeSection);
        
        // Add click handlers to menu items
        accountMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const section = this.getAttribute('data-section');
                if (section) {
                    showAccountSection(section);
                    
                    // Update URL without page reload
                    const url = new URL(window.location);
                    url.searchParams.set('section', section);
                    window.history.pushState({}, '', url);
                }
            });
        });
    }
    
    // Handle logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear authentication data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');
            localStorage.removeItem('rememberMe');
            
            // Redirect to login page
            window.location.href = 'account.html';
        });
    }
}

// Show specific account section
function showAccountSection(sectionId) {
    // Hide all sections
    const accountSections = document.querySelectorAll('.account-section');
    accountSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show requested section
    const targetSection = document.getElementById(`${sectionId}Section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update active menu item
    const accountMenuLinks = document.querySelectorAll('.account-menu .nav-link');
    accountMenuLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Update page title
    const sectionTitle = document.querySelector('.account-header h1');
    if (sectionTitle) {
        const activeLinkText = document.querySelector(`.account-menu .nav-link[data-section="${sectionId}"]`).textContent;
        sectionTitle.textContent = activeLinkText.trim();
    }
}
