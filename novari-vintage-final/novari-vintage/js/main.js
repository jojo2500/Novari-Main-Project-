// Main JavaScript file to connect all pages and initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common elements
    initializeHeader();
    initializeFooter();
    initializeToasts();
    
    // Initialize page-specific functionality
    initializeCurrentPage();
    
    // Load cart and favorites count
    updateCartCount();
    updateFavoritesCount();
});

// Initialize header functionality
function initializeHeader() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
            mobileMenu.classList.toggle('show');
            
            if (mobileMenu.classList.contains('show')) {
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Search toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    
    if (searchToggle && searchForm) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchForm.classList.toggle('show');
            
            if (searchForm.classList.contains('show')) {
                searchForm.querySelector('input').focus();
            }
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    
    if (searchInput && searchSuggestions) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            if (query.length > 2) {
                // Search products
                searchProducts(query).then(results => {
                    if (results.length > 0) {
                        let suggestionsHTML = '';
                        results.slice(0, 5).forEach(product => {
                            suggestionsHTML += `
                                <div class="suggestion-item" data-product-id="${product.id}">
                                    <span>${product.name}</span>
                                </div>
                            `;
                        });
                        
                        searchSuggestions.innerHTML = suggestionsHTML;
                        searchSuggestions.style.display = 'block';
                        
                        // Add click event to suggestion items
                        document.querySelectorAll('.suggestion-item').forEach(item => {
                            item.addEventListener('click', function() {
                                const productId = this.getAttribute('data-product-id');
                                window.location.href = `product.html?id=${productId}`;
                            });
                        });
                    } else {
                        searchSuggestions.innerHTML = `
                            <div class="suggestion-item no-results">
                                <span>No results found for "${query}"</span>
                            </div>
                        `;
                        searchSuggestions.style.display = 'block';
                    }
                });
            } else {
                searchSuggestions.style.display = 'none';
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });
        
        // Handle search form submission
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const query = searchInput.value.trim();
                
                if (query.length > 0) {
                    window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
                }
            });
        }
    }
    
    // Update header based on authentication status
    if (typeof isLoggedIn === 'function') {
        updateHeaderAuth();
    }
}

// Update header based on authentication status
function updateHeaderAuth() {
    const accountLink = document.querySelector('.nav-icon[title="Account"]');
    if (accountLink) {
        const accountIcon = accountLink.querySelector('i');
        
        if (isLoggedIn()) {
            // Update account icon
            if (accountIcon) {
                accountIcon.className = 'fas fa-user';
            }
            
            // Update account link
            accountLink.href = 'account.html?section=dashboard';
            
            // Add admin dashboard link if admin
            if (isAdmin()) {
                const adminLink = document.createElement('a');
                adminLink.href = 'admin.html';
                adminLink.className = 'nav-icon';
                adminLink.title = 'Admin';
                adminLink.innerHTML = '<i class="fas fa-cog"></i>';
                
                // Insert before cart icon
                const cartLink = document.querySelector('.nav-icon[title="Cart"]');
                if (cartLink && cartLink.parentNode) {
                    cartLink.parentNode.insertBefore(adminLink, cartLink);
                }
            }
        } else {
            // Update account icon
            if (accountIcon) {
                accountIcon.className = 'far fa-user';
            }
            
            // Update account link
            accountLink.href = 'account.html';
        }
    }
}

// Initialize footer functionality
function initializeFooter() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // In a real implementation, this would subscribe to newsletter
                showToast('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
            }
        });
    }
}

// Initialize toast notifications
function initializeToasts() {
    // Create toast container if it doesn't exist
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

// Initialize page-specific functionality
function initializeCurrentPage() {
    const currentPath = window.location.pathname;
    
    // Home page
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        initializeHomePage();
    }
    
    // Shop page
    if (currentPath.endsWith('shop.html')) {
        // Shop page functionality is handled in shop.js
    }
    
    // Product page
    if (currentPath.endsWith('product.html')) {
        // Product page functionality is handled in product.js
    }
    
    // Cart page
    if (currentPath.endsWith('cart.html')) {
        initializeCartPage();
    }
    
    // Checkout pages
    if (currentPath.endsWith('checkout.html')) {
        initializeCheckoutPage();
    }
    
    if (currentPath.endsWith('payment.html')) {
        initializePaymentPage();
    }
    
    if (currentPath.endsWith('confirmation.html')) {
        initializeConfirmationPage();
    }
    
    // Account page
    if (currentPath.endsWith('account.html')) {
        // Account page functionality is handled in auth.js
    }
    
    // Admin page
    if (currentPath.endsWith('admin.html')) {
        initializeAdminPage();
    }
    
    // Favorites page
    if (currentPath.endsWith('favorites.html')) {
        initializeFavoritesPage();
    }
    
    // Contact page
    if (currentPath.endsWith('contact.html')) {
        initializeContactPage();
    }
    
    // About page
    if (currentPath.endsWith('about.html')) {
        initializeAboutPage();
    }
}

// Initialize home page
function initializeHomePage() {
    // Hero slider
    const heroSlider = document.querySelector('.hero-slider');
    
    if (heroSlider) {
        let currentSlide = 0;
        const slides = heroSlider.querySelectorAll('.hero-slide');
        const totalSlides = slides.length;
        
        // Auto slide function
        function autoSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
        }
        
        // Set interval for auto slide
        const slideInterval = setInterval(autoSlide, 5000);
        
        // Pause on hover
        heroSlider.addEventListener('mouseenter', function() {
            clearInterval(slideInterval);
        });
        
        // Resume on mouse leave
        heroSlider.addEventListener('mouseleave', function() {
            clearInterval(slideInterval);
            slideInterval = setInterval(autoSlide, 5000);
        });
    }
    
    // Featured products
    loadFeaturedProducts();
    
    // New arrivals
    loadNewArrivals();
    
    // Sale products
    loadSaleProducts();
}

// Load featured products for home page
async function loadFeaturedProducts() {
    const featuredProductsContainer = document.querySelector('.featured-products .row');
    if (!featuredProductsContainer) return;
    
    // Show loading state
    featuredProductsContainer.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Get popular products
    const popularProducts = await getPopularProducts(4);
    
    if (!popularProducts.length) {
        featuredProductsContainer.innerHTML = `
            <div class="col-12 text-center py-4">
                <p class="text-muted">No featured products found.</p>
            </div>
        `;
        return;
    }
    
    // Generate HTML for featured products
    let featuredProductsHTML = '';
    popularProducts.forEach(product => {
        featuredProductsHTML += `
            <div class="col-md-3 col-sm-6 mb-4">
                ${generateProductCardHTML(product)}
            </div>
        `;
    });
    
    // Update featured products container
    featuredProductsContainer.innerHTML = featuredProductsHTML;
    
    // Setup product interactions
    setupProductInteractions();
}

// Load new arrivals for home page
async function loadNewArrivals() {
    const newArrivalsContainer = document.querySelector('.new-arrivals .row');
    if (!newArrivalsContainer) return;
    
    // Show loading state
    newArrivalsContainer.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Get new arrivals
    const newProducts = await getNewArrivals(4);
    
    if (!newProducts.length) {
        newArrivalsContainer.innerHTML = `
            <div class="col-12 text-center py-4">
                <p class="text-muted">No new arrivals found.</p>
            </div>
        `;
        return;
    }
    
    // Generate HTML for new arrivals
    let newArrivalsHTML = '';
    newProducts.forEach(product => {
        newArrivalsHTML += `
            <div class="col-md-3 col-sm-6 mb-4">
                ${generateProductCardHTML(product)}
            </div>
        `;
    });
    
    // Update new arrivals container
    newArrivalsContainer.innerHTML = newArrivalsHTML;
    
    // Setup product interactions
    setupProductInteractions();
}

// Load sale products for home page
async function loadSaleProducts() {
    const saleProductsContainer = document.querySelector('.sale-products .row');
    if (!saleProductsContainer) return;
    
    // Show loading state
    saleProductsContainer.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Get sale products
    const saleProducts = await getSaleProducts(4);
    
    if (!saleProducts.length) {
        saleProductsContainer.innerHTML = `
            <div class="col-12 text-center py-4">
                <p class="text-muted">No sale products found.</p>
            </div>
        `;
        return;
    }
    
    // Generate HTML for sale products
    let saleProductsHTML = '';
    saleProducts.forEach(product => {
        saleProductsHTML += `
            <div class="col-md-3 col-sm-6 mb-4">
                ${generateProductCardHTML(product)}
            </div>
        `;
    });
    
    // Update sale products container
    saleProductsContainer.innerHTML = saleProductsHTML;
    
    // Setup product interactions
    setupProductInteractions();
}

// Initialize cart page
function initializeCartPage() {
    // Update cart items
    updateCartItems();
    
    // Setup quantity selectors
    setupCartQuantitySelectors();
    
    // Setup remove buttons
    setupCartRemoveButtons();
    
    // Setup coupon form
    setupCouponForm();
    
    // Setup checkout button
    setupCheckoutButton();
}

// Update cart items
function updateCartItems() {
    // In a real implementation, this would get cart items from localStorage or API
    // For this demo, we'll use dummy data
    
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    
    if (!cartItemsContainer || !cartSummaryContainer) return;
    
    // Get cart count from localStorage
    const cartCount = parseInt(localStorage.getItem('cartCount') || '0');
    
    if (cartCount === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="mb-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted"></i>
                </div>
                <h3>Your cart is empty</h3>
                <p class="text-muted">Looks like you haven't added any items to your cart yet.</p>
                <a href="shop.html" class="btn btn-primary mt-3">Continue Shopping</a>
            </div>
        `;
        
        // Hide cart summary
        cartSummaryContainer.style.display = 'none';
        
        return;
    }
    
    // Get random products for cart
    loadProducts().then(products => {
        // Get random products
        const randomProducts = [];
        const usedIndices = new Set();
        
        for (let i = 0; i < Math.min(cartCount, 3); i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * products.length);
            } while (usedIndices.has(randomIndex));
            
            usedIndices.add(randomIndex);
            randomProducts.push(products[randomIndex]);
        }
        
        // Generate cart items HTML
        let cartItemsHTML = '';
        let subtotal = 0;
        
        randomProducts.forEach(product => {
            const quantity = Math.floor(Math.random() * 2) + 1;
            const price = product.salePrice || product.price;
            const itemTotal = price * quantity;
            subtotal += itemTotal;
            
            cartItemsHTML += `
                <div class="cart-item" data-product-id="${product.id}">
                    <div class="cart-item-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title"><a href="product.html?id=${product.id}">${product.name}</a></h3>
                        <div class="cart-item-meta">
                            <span class="cart-item-category">${capitalizeFirstLetter(product.category)}</span>
                            <span class="cart-item-era">${product.era}</span>
                        </div>
                        <div class="cart-item-options">
                            <span class="cart-item-size">Size: ${product.availableSizes[0]}</span>
                            <span class="cart-item-color">Color: ${product.colors[0].name}</span>
                        </div>
                    </div>
                    <div class="cart-item-quantity">
                        <div class="quantity-selector">
                            <button class="quantity-decrease" aria-label="Decrease quantity">-</button>
                            <input type="number" class="quantity-input" value="${quantity}" min="1" max="10">
                            <button class="quantity-increase" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    <div class="cart-item-price">$${price.toFixed(2)}</div>
                    <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                    <div class="cart-item-remove">
                        <button class="remove-item" aria-label="Remove item"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
        });
        
        // Update cart items container
        cartItemsContainer.innerHTML = cartItemsHTML;
        
        // Calculate shipping and total
        const shipping = subtotal > 100 ? 0 : 5.99;
        const total = subtotal + shipping;
        
        // Update cart summary
        cartSummaryContainer.querySelector('.summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        cartSummaryContainer.querySelector('.summary-shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        cartSummaryContainer.querySelector('.summary-total').textContent = `$${total.toFixed(2)}`;
        
        // Show cart summary
        cartSummaryContainer.style.display = 'block';
        
        // Setup quantity selectors
        setupCartQuantitySelectors();
        
        // Setup remove buttons
        setupCartRemoveButtons();
    });
}

// Setup cart quantity selectors
function setupCartQuantitySelectors() {
    const quantitySelectors = document.querySelectorAll('.cart-item .quantity-selector');
    
    if (!quantitySelectors.length) return;
    
    quantitySelectors.forEach(selector => {
        const decreaseBtn = selector.querySelector('.quantity-decrease');
        const increaseBtn = selector.querySelector('.quantity-increase');
        const quantityInput = selector.querySelector('.quantity-input');
        
        if (!decreaseBtn || !increaseBtn || !quantityInput) return;
        
        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value > 1) {
                quantityInput.value = value - 1;
                updateCartItemTotal(selector.closest('.cart-item'));
            }
        });
        
        increaseBtn.addEventListener('click', function() {
            let value = parseInt(quantityInput.value);
            if (value < 10) {
                quantityInput.value = value + 1;
                updateCartItemTotal(selector.closest('.cart-item'));
            }
        });
        
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
            updateCartItemTotal(selector.closest('.cart-item'));
        });
    });
}

// Update cart item total
function updateCartItemTotal(cartItem) {
    if (!cartItem) return;
    
    const priceElement = cartItem.querySelector('.cart-item-price');
    const quantityInput = cartItem.querySelector('.quantity-input');
    const totalElement = cartItem.querySelector('.cart-item-total');
    
    if (!priceElement || !quantityInput || !totalElement) return;
    
    const price = parseFloat(priceElement.textContent.replace('$', ''));
    const quantity = parseInt(quantityInput.value);
    const total = price * quantity;
    
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Update cart summary
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const cartItems = document.querySelectorAll('.cart-item');
    const summarySubtotal = document.querySelector('.summary-subtotal');
    const summaryShipping = document.querySelector('.summary-shipping');
    const summaryTotal = document.querySelector('.summary-total');
    
    if (!cartItems.length || !summarySubtotal || !summaryShipping || !summaryTotal) return;
    
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const totalElement = item.querySelector('.cart-item-total');
        if (totalElement) {
            subtotal += parseFloat(totalElement.textContent.replace('$', ''));
        }
    });
    
    // Calculate shipping and total
    const shipping = subtotal > 100 ? 0 : 5.99;
    const total = subtotal + shipping;
    
    // Update cart summary
    summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    summaryShipping.textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    summaryTotal.textContent = `$${total.toFixed(2)}`;
}

// Setup cart remove buttons
function setupCartRemoveButtons() {
    const removeButtons = document.querySelectorAll('.cart-item .remove-item');
    
    if (!removeButtons.length) return;
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            if (cartItem) {
                cartItem.classList.add('removing');
                
                setTimeout(() => {
                    cartItem.remove();
                    
                    // Update cart count
                    let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
                    if (cartCount > 0) {
                        cartCount--;
                        localStorage.setItem('cartCount', cartCount.toString());
                        updateCartCount();
                    }
                    
                    // Update cart summary
                    updateCartSummary();
                    
                    // Check if cart is empty
                    const remainingItems = document.querySelectorAll('.cart-item');
                    if (remainingItems.length === 0) {
                        // Show empty cart message
                        document.querySelector('.cart-items').innerHTML = `
                            <div class="text-center py-5">
                                <div class="mb-4">
                                    <i class="fas fa-shopping-cart fa-3x text-muted"></i>
                                </div>
                                <h3>Your cart is empty</h3>
                                <p class="text-muted">Looks like you haven't added any items to your cart yet.</p>
                                <a href="shop.html" class="btn btn-primary mt-3">Continue Shopping</a>
                            </div>
                        `;
                        
                        // Hide cart summary
                        document.querySelector('.cart-summary').style.display = 'none';
                    }
                }, 300);
            }
        });
    });
}

// Setup coupon form
function setupCouponForm() {
    const couponForm = document.querySelector('.coupon-form');
    
    if (!couponForm) return;
    
    couponForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const couponInput = this.querySelector('input');
        const couponCode = couponInput.value.trim();
        
        if (couponCode) {
            // In a real implementation, this would validate the coupon code
            // For this demo, we'll just show a success message
            if (couponCode.toUpperCase() === 'VINTAGE20') {
                showToast('Coupon applied successfully! 20% discount added.', 'success');
                
                // Update cart summary with discount
                const summarySubtotal = document.querySelector('.summary-subtotal');
                const summaryTotal = document.querySelector('.summary-total');
                
                if (summarySubtotal && summaryTotal) {
                    const subtotal = parseFloat(summarySubtotal.textContent.replace('$', ''));
                    const discount = subtotal * 0.2;
                    const shipping = parseFloat(document.querySelector('.summary-shipping').textContent.replace('$', '')) || 0;
                    const total = subtotal - discount + shipping;
                    
                    // Add discount row
                    const discountRow = document.createElement('div');
                    discountRow.className = 'summary-row discount';
                    discountRow.innerHTML = `
                        <span>Discount (20%)</span>
                        <span class="summary-discount">-$${discount.toFixed(2)}</span>
                    `;
                    
                    // Insert before total row
                    const totalRow = document.querySelector('.summary-row.total');
                    if (totalRow && totalRow.parentNode) {
                        totalRow.parentNode.insertBefore(discountRow, totalRow);
                    }
                    
                    // Update total
                    summaryTotal.textContent = `$${total.toFixed(2)}`;
                }
                
                // Disable coupon form
                couponInput.disabled = true;
                this.querySelector('button').disabled = true;
            } else {
                showToast('Invalid coupon code. Try VINTAGE20 for 20% off.', 'error');
            }
        }
    });
}

// Setup checkout button
function setupCheckoutButton() {
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    if (!checkoutBtn) return;
    
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // In a real implementation, this would validate the cart and redirect to checkout
        window.location.href = 'checkout.html';
    });
}

// Initialize checkout page
function initializeCheckoutPage() {
    // Setup shipping form
    setupShippingForm();
    
    // Setup continue to payment button
    const continueBtn = document.querySelector('.btn-continue-payment');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate form
            const form = document.querySelector('.shipping-form');
            if (form && form.checkValidity()) {
                // Save shipping info to localStorage
                saveShippingInfo();
                
                // Redirect to payment page
                window.location.href = 'payment.html';
            } else {
                // Show validation messages
                form.classList.add('was-validated');
                
                // Scroll to first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            }
        });
    }
}

// Setup shipping form
function setupShippingForm() {
    const shippingForm = document.querySelector('.shipping-form');
    
    if (!shippingForm) return;
    
    // Load saved shipping info
    loadShippingInfo();
    
    // Country select change
    const countrySelect = document.getElementById('country');
    const stateGroup = document.getElementById('stateGroup');
    const stateSelect = document.getElementById('state');
    
    if (countrySelect && stateGroup && stateSelect) {
        countrySelect.addEventListener('change', function() {
            if (this.value === 'US') {
                stateGroup.style.display = 'block';
                stateSelect.setAttribute('required', 'required');
            } else {
                stateGroup.style.display = 'none';
                stateSelect.removeAttribute('required');
            }
        });
    }
    
    // Same as billing checkbox
    const sameAsBilling = document.getElementById('sameAsBilling');
    const billingSection = document.querySelector('.billing-section');
    
    if (sameAsBilling && billingSection) {
        sameAsBilling.addEventListener('change', function() {
            if (this.checked) {
                billingSection.style.display = 'none';
                
                // Remove required attribute from billing fields
                billingSection.querySelectorAll('[required]').forEach(field => {
                    field.removeAttribute('required');
                });
            } else {
                billingSection.style.display = 'block';
                
                // Add required attribute to billing fields
                billingSection.querySelectorAll('.form-control').forEach(field => {
                    field.setAttribute('required', 'required');
                });
            }
        });
        
        // Trigger change event
        sameAsBilling.dispatchEvent(new Event('change'));
    }
}

// Save shipping info to localStorage
function saveShippingInfo() {
    const shippingForm = document.querySelector('.shipping-form');
    
    if (!shippingForm) return;
    
    const shippingInfo = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        address2: document.getElementById('address2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        sameAsBilling: document.getElementById('sameAsBilling').checked
    };
    
    // Save to localStorage
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
}

// Load shipping info from localStorage
function loadShippingInfo() {
    const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo') || '{}');
    
    // Fill form fields
    for (const [key, value] of Object.entries(shippingInfo)) {
        const field = document.getElementById(key);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = value;
            } else {
                field.value = value;
            }
        }
    }
    
    // Trigger country change event
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        countrySelect.dispatchEvent(new Event('change'));
    }
    
    // Trigger same as billing change event
    const sameAsBilling = document.getElementById('sameAsBilling');
    if (sameAsBilling) {
        sameAsBilling.dispatchEvent(new Event('change'));
    }
}

// Initialize payment page
function initializePaymentPage() {
    // Setup payment form
    setupPaymentForm();
    
    // Setup place order button
    const placeOrderBtn = document.querySelector('.btn-place-order');
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate form
            const form = document.querySelector('.payment-form');
            if (form && form.checkValidity()) {
                // Save payment info to localStorage
                savePaymentInfo();
                
                // Show loading state
                this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
                this.disabled = true;
                
                // Simulate processing
                setTimeout(() => {
                    // Redirect to confirmation page
                    window.location.href = 'confirmation.html';
                }, 2000);
            } else {
                // Show validation messages
                form.classList.add('was-validated');
                
                // Scroll to first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstInvalid.focus();
                }
            }
        });
    }
}

// Setup payment form
function setupPaymentForm() {
    const paymentForm = document.querySelector('.payment-form');
    
    if (!paymentForm) return;
    
    // Load saved payment info
    loadPaymentInfo();
    
    // Payment method change
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardFields = document.querySelector('.credit-card-fields');
    const paypalFields = document.querySelector('.paypal-fields');
    
    if (paymentMethods.length && creditCardFields && paypalFields) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                if (this.value === 'credit-card') {
                    creditCardFields.style.display = 'block';
                    paypalFields.style.display = 'none';
                    
                    // Add required attribute to credit card fields
                    creditCardFields.querySelectorAll('.form-control').forEach(field => {
                        field.setAttribute('required', 'required');
                    });
                    
                    // Remove required attribute from PayPal fields
                    paypalFields.querySelectorAll('[required]').forEach(field => {
                        field.removeAttribute('required');
                    });
                } else if (this.value === 'paypal') {
                    creditCardFields.style.display = 'none';
                    paypalFields.style.display = 'block';
                    
                    // Remove required attribute from credit card fields
                    creditCardFields.querySelectorAll('[required]').forEach(field => {
                        field.removeAttribute('required');
                    });
                    
                    // Add required attribute to PayPal fields
                    paypalFields.querySelectorAll('.form-control').forEach(field => {
                        field.setAttribute('required', 'required');
                    });
                }
            });
        });
        
        // Trigger change event for selected payment method
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (selectedMethod) {
            selectedMethod.dispatchEvent(new Event('change'));
        }
    }
    
    // Credit card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Add spaces every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            
            // Update input value
            this.value = value;
        });
    }
    
    // Expiration date formatting
    const expirationInput = document.getElementById('expiration');
    
    if (expirationInput) {
        expirationInput.addEventListener('input', function() {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Add slash after month
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            
            // Update input value
            this.value = value;
        });
    }
}

// Save payment info to localStorage
function savePaymentInfo() {
    const paymentForm = document.querySelector('.payment-form');
    
    if (!paymentForm) return;
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    const paymentInfo = {
        paymentMethod,
        cardholderName: document.getElementById('cardholderName')?.value || '',
        cardNumber: document.getElementById('cardNumber')?.value || '',
        expiration: document.getElementById('expiration')?.value || '',
        cvv: document.getElementById('cvv')?.value || '',
        paypalEmail: document.getElementById('paypalEmail')?.value || ''
    };
    
    // Save to localStorage
    localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
}

// Load payment info from localStorage
function loadPaymentInfo() {
    const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo') || '{}');
    
    // Set payment method
    if (paymentInfo.paymentMethod) {
        const paymentMethod = document.querySelector(`input[name="paymentMethod"][value="${paymentInfo.paymentMethod}"]`);
        if (paymentMethod) {
            paymentMethod.checked = true;
            paymentMethod.dispatchEvent(new Event('change'));
        }
    }
    
    // Fill form fields
    for (const [key, value] of Object.entries(paymentInfo)) {
        if (key === 'paymentMethod') continue;
        
        const field = document.getElementById(key);
        if (field) {
            field.value = value;
        }
    }
}

// Initialize confirmation page
function initializeConfirmationPage() {
    // Generate order number
    const orderNumber = document.querySelector('.order-number');
    
    if (orderNumber) {
        // Generate random order number
        const randomOrderNumber = Math.floor(100000000 + Math.random() * 900000000);
        orderNumber.textContent = `#${randomOrderNumber}`;
    }
    
    // Clear cart
    localStorage.setItem('cartCount', '0');
    updateCartCount();
    
    // Update order summary
    updateOrderSummary();
}

// Update order summary
function updateOrderSummary() {
    // In a real implementation, this would get order details from localStorage or API
    // For this demo, we'll use dummy data
    
    const orderItemsContainer = document.querySelector('.order-items');
    
    if (!orderItemsContainer) return;
    
    // Get random products for order
    loadProducts().then(products => {
        // Get random products
        const randomProducts = [];
        const usedIndices = new Set();
        
        for (let i = 0; i < 2; i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * products.length);
            } while (usedIndices.has(randomIndex));
            
            usedIndices.add(randomIndex);
            randomProducts.push(products[randomIndex]);
        }
        
        // Generate order items HTML
        let orderItemsHTML = '';
        let subtotal = 0;
        
        randomProducts.forEach(product => {
            const quantity = Math.floor(Math.random() * 2) + 1;
            const price = product.salePrice || product.price;
            const itemTotal = price * quantity;
            subtotal += itemTotal;
            
            orderItemsHTML += `
                <div class="order-item">
                    <div class="order-item-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="order-item-details">
                        <h3 class="order-item-title">${product.name}</h3>
                        <div class="order-item-meta">
                            <span class="order-item-category">${capitalizeFirstLetter(product.category)}</span>
                            <span class="order-item-era">${product.era}</span>
                        </div>
                        <div class="order-item-options">
                            <span class="order-item-size">Size: ${product.availableSizes[0]}</span>
                            <span class="order-item-color">Color: ${product.colors[0].name}</span>
                        </div>
                    </div>
                    <div class="order-item-quantity">
                        <span>Qty: ${quantity}</span>
                    </div>
                    <div class="order-item-price">$${price.toFixed(2)}</div>
                    <div class="order-item-total">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        });
        
        // Update order items container
        orderItemsContainer.innerHTML = orderItemsHTML;
        
        // Calculate shipping, discount, and total
        const shipping = subtotal > 100 ? 0 : 5.99;
        const discount = Math.random() > 0.5 ? subtotal * 0.1 : 0;
        const total = subtotal + shipping - discount;
        
        // Update order summary
        document.querySelector('.summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.summary-shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
        
        // Add discount row if applicable
        if (discount > 0) {
            const discountRow = document.createElement('div');
            discountRow.className = 'summary-row discount';
            discountRow.innerHTML = `
                <span>Discount (10%)</span>
                <span class="summary-discount">-$${discount.toFixed(2)}</span>
            `;
            
            // Insert before total row
            const totalRow = document.querySelector('.summary-row.total');
            if (totalRow && totalRow.parentNode) {
                totalRow.parentNode.insertBefore(discountRow, totalRow);
            }
        }
        
        document.querySelector('.summary-total').textContent = `$${total.toFixed(2)}`;
    });
}

// Initialize admin page
function initializeAdminPage() {
    // Protect admin route
    if (typeof protectAdminRoute === 'function') {
        if (!protectAdminRoute()) {
            return;
        }
    }
    
    // Setup sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.admin-content').classList.toggle('expanded');
        });
    }
    
    // Setup tab navigation
    const tabLinks = document.querySelectorAll('.admin-nav-link');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');
    
    if (tabLinks.length && tabPanes.length) {
        tabLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all tab links
                tabLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to clicked tab link
                this.classList.add('active');
                
                // Hide all tab panes
                tabPanes.forEach(pane => {
                    pane.classList.remove('active');
                });
                
                // Show corresponding tab pane
                const target = this.getAttribute('data-tab');
                const targetPane = document.querySelector(`.admin-tab-pane[data-tab="${target}"]`);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
                
                // Update URL hash
                window.location.hash = target;
            });
        });
        
        // Check URL hash on page load
        const hash = window.location.hash.substring(1);
        if (hash) {
            const tabLink = document.querySelector(`.admin-nav-link[data-tab="${hash}"]`);
            if (tabLink) {
                tabLink.click();
            }
        } else {
            // Click first tab link by default
            tabLinks[0].click();
        }
    }
    
    // Load admin data
    loadAdminData();
}

// Load admin data
function loadAdminData() {
    // Load products for product management
    loadAdminProducts();
    
    // Load orders for order management
    loadAdminOrders();
    
    // Load customers for customer management
    loadAdminCustomers();
    
    // Load analytics data
    loadAdminAnalytics();
}

// Load products for admin
function loadAdminProducts() {
    const productsTable = document.querySelector('#products-tab .products-table tbody');
    
    if (!productsTable) return;
    
    // Show loading state
    productsTable.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </td>
        </tr>
    `;
    
    // Get products
    loadProducts().then(products => {
        // Generate products HTML
        let productsHTML = '';
        
        products.forEach(product => {
            productsHTML += `
                <tr>
                    <td>${product.id}</td>
                    <td>
                        <div class="product-info">
                            <img src="${product.thumbnails[0]}" alt="${product.name}" class="product-thumbnail">
                            <span>${product.name}</span>
                        </div>
                    </td>
                    <td>${capitalizeFirstLetter(product.category)}</td>
                    <td>${product.era}</td>
                    <td>
                        ${product.salePrice ? 
                            `<span class="sale-price">$${product.salePrice.toFixed(2)}</span>
                             <span class="original-price">$${product.price.toFixed(2)}</span>` : 
                            `$${product.price.toFixed(2)}`
                        }
                    </td>
                    <td>
                        <span class="status-badge ${product.isNew ? 'new' : (product.salePrice ? 'sale' : 'regular')}">
                            ${product.isNew ? 'New' : (product.salePrice ? 'Sale' : 'Regular')}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-primary edit-product" data-product-id="${product.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-product" data-product-id="${product.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        // Update products table
        productsTable.innerHTML = productsHTML;
        
        // Setup product action buttons
        setupProductActionButtons();
    });
}

// Setup product action buttons
function setupProductActionButtons() {
    // Edit product buttons
    const editButtons = document.querySelectorAll('.edit-product');
    
    if (editButtons.length) {
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                
                // In a real implementation, this would open a product edit modal
                // For this demo, we'll just show a toast notification
                showToast(`Editing product #${productId}`, 'info');
            });
        });
    }
    
    // Delete product buttons
    const deleteButtons = document.querySelectorAll('.delete-product');
    
    if (deleteButtons.length) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                
                // In a real implementation, this would show a confirmation modal
                // For this demo, we'll just show a toast notification
                showToast(`Deleted product #${productId}`, 'success');
                
                // Remove row from table
                this.closest('tr').remove();
            });
        });
    }
}

// Load orders for admin
function loadAdminOrders() {
    const ordersTable = document.querySelector('#orders-tab .orders-table tbody');
    
    if (!ordersTable) return;
    
    // Show loading state
    ordersTable.innerHTML = `
        <tr>
            <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </td>
        </tr>
    `;
    
    // Generate dummy orders
    const orders = [];
    
    for (let i = 1; i <= 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const total = (Math.random() * 200 + 50).toFixed(2);
        
        orders.push({
            id: 100000 + i,
            date: date.toLocaleDateString(),
            customer: `Customer ${i}`,
            email: `customer${i}@example.com`,
            total: total,
            status: status,
            items: Math.floor(Math.random() * 5) + 1
        });
    }
    
    // Generate orders HTML
    let ordersHTML = '';
    
    orders.forEach(order => {
        ordersHTML += `
            <tr>
                <td>#${order.id}</td>
                <td>${order.date}</td>
                <td>${order.customer}</td>
                <td>${order.email}</td>
                <td>$${order.total}</td>
                <td>
                    <span class="status-badge ${order.status.toLowerCase()}">
                        ${order.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-primary view-order" data-order-id="${order.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary update-status" data-order-id="${order.id}">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    // Update orders table
    ordersTable.innerHTML = ordersHTML;
    
    // Setup order action buttons
    setupOrderActionButtons();
}

// Setup order action buttons
function setupOrderActionButtons() {
    // View order buttons
    const viewButtons = document.querySelectorAll('.view-order');
    
    if (viewButtons.length) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-order-id');
                
                // In a real implementation, this would open an order details modal
                // For this demo, we'll just show a toast notification
                showToast(`Viewing order #${orderId}`, 'info');
            });
        });
    }
    
    // Update status buttons
    const updateButtons = document.querySelectorAll('.update-status');
    
    if (updateButtons.length) {
        updateButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-order-id');
                
                // In a real implementation, this would open a status update modal
                // For this demo, we'll just show a toast notification
                showToast(`Updated status for order #${orderId}`, 'success');
                
                // Update status badge
                const statusBadge = this.closest('tr').querySelector('.status-badge');
                if (statusBadge) {
                    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
                    const currentStatus = statusBadge.classList[1];
                    const currentIndex = statuses.indexOf(currentStatus);
                    const nextIndex = (currentIndex + 1) % statuses.length;
                    const nextStatus = statuses[nextIndex];
                    
                    statusBadge.classList.remove(currentStatus);
                    statusBadge.classList.add(nextStatus);
                    statusBadge.textContent = capitalizeFirstLetter(nextStatus);
                }
            });
        });
    }
}

// Load customers for admin
function loadAdminCustomers() {
    const customersTable = document.querySelector('#customers-tab .customers-table tbody');
    
    if (!customersTable) return;
    
    // Show loading state
    customersTable.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </td>
        </tr>
    `;
    
    // Generate dummy customers
    const customers = [];
    
    for (let i = 1; i <= 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));
        
        const orders = Math.floor(Math.random() * 10);
        const spent = (orders * (Math.random() * 100 + 50)).toFixed(2);
        
        customers.push({
            id: i,
            name: `Customer ${i}`,
            email: `customer${i}@example.com`,
            joined: date.toLocaleDateString(),
            orders: orders,
            spent: spent
        });
    }
    
    // Generate customers HTML
    let customersHTML = '';
    
    customers.forEach(customer => {
        customersHTML += `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.joined}</td>
                <td>${customer.orders}</td>
                <td>$${customer.spent}</td>
            </tr>
        `;
    });
    
    // Update customers table
    customersTable.innerHTML = customersHTML;
}

// Load analytics data for admin
function loadAdminAnalytics() {
    // Update dashboard stats
    updateDashboardStats();
    
    // Load sales chart
    loadSalesChart();
    
    // Load top products chart
    loadTopProductsChart();
    
    // Load customer acquisition chart
    loadCustomerAcquisitionChart();
}

// Update dashboard stats
function updateDashboardStats() {
    // Generate random stats
    const stats = {
        totalSales: (Math.random() * 10000 + 5000).toFixed(2),
        totalOrders: Math.floor(Math.random() * 500 + 100),
        averageOrder: (Math.random() * 100 + 50).toFixed(2),
        totalCustomers: Math.floor(Math.random() * 1000 + 200)
    };
    
    // Update stats
    document.querySelector('.total-sales').textContent = `$${stats.totalSales}`;
    document.querySelector('.total-orders').textContent = stats.totalOrders;
    document.querySelector('.average-order').textContent = `$${stats.averageOrder}`;
    document.querySelector('.total-customers').textContent = stats.totalCustomers;
}

// Load sales chart
function loadSalesChart() {
    const salesChartCanvas = document.getElementById('salesChart');
    
    if (!salesChartCanvas) return;
    
    // Generate random sales data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesData = [];
    
    for (let i = 0; i < 12; i++) {
        salesData.push(Math.floor(Math.random() * 5000 + 1000));
    }
    
    // Create chart
    const salesChart = new Chart(salesChartCanvas, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Sales',
                data: salesData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

// Load top products chart
function loadTopProductsChart() {
    const topProductsChartCanvas = document.getElementById('topProductsChart');
    
    if (!topProductsChartCanvas) return;
    
    // Get products
    loadProducts().then(products => {
        // Get random top products
        const topProducts = [];
        const usedIndices = new Set();
        
        for (let i = 0; i < 5; i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * products.length);
            } while (usedIndices.has(randomIndex));
            
            usedIndices.add(randomIndex);
            topProducts.push(products[randomIndex]);
        }
        
        // Generate random sales data
        const salesData = [];
        
        for (let i = 0; i < 5; i++) {
            salesData.push(Math.floor(Math.random() * 100 + 10));
        }
        
        // Create chart
        const topProductsChart = new Chart(topProductsChartCanvas, {
            type: 'bar',
            data: {
                labels: topProducts.map(product => product.name),
                datasets: [{
                    label: 'Units Sold',
                    data: salesData,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
}

// Load customer acquisition chart
function loadCustomerAcquisitionChart() {
    const customerChartCanvas = document.getElementById('customerChart');
    
    if (!customerChartCanvas) return;
    
    // Generate random customer data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const customerData = [];
    
    for (let i = 0; i < 12; i++) {
        customerData.push(Math.floor(Math.random() * 50 + 10));
    }
    
    // Create chart
    const customerChart = new Chart(customerChartCanvas, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'New Customers',
                data: customerData,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize favorites page
function initializeFavoritesPage() {
    // Update favorites items
    updateFavoritesItems();
    
    // Setup remove buttons
    setupFavoritesRemoveButtons();
}

// Update favorites items
function updateFavoritesItems() {
    // In a real implementation, this would get favorites items from localStorage or API
    // For this demo, we'll use dummy data
    
    const favoritesContainer = document.querySelector('.favorites-items');
    
    if (!favoritesContainer) return;
    
    // Get favorites count from localStorage
    const favoritesCount = parseInt(localStorage.getItem('favoritesCount') || '0');
    
    if (favoritesCount === 0) {
        // Show empty favorites message
        favoritesContainer.innerHTML = `
            <div class="text-center py-5">
                <div class="mb-4">
                    <i class="fas fa-heart fa-3x text-muted"></i>
                </div>
                <h3>Your favorites list is empty</h3>
                <p class="text-muted">Looks like you haven't added any items to your favorites yet.</p>
                <a href="shop.html" class="btn btn-primary mt-3">Continue Shopping</a>
            </div>
        `;
        
        return;
    }
    
    // Get random products for favorites
    loadProducts().then(products => {
        // Get random products
        const randomProducts = [];
        const usedIndices = new Set();
        
        for (let i = 0; i < Math.min(favoritesCount, 4); i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * products.length);
            } while (usedIndices.has(randomIndex));
            
            usedIndices.add(randomIndex);
            randomProducts.push(products[randomIndex]);
        }
        
        // Generate favorites items HTML
        let favoritesHTML = '';
        
        randomProducts.forEach(product => {
            favoritesHTML += `
                <div class="favorites-item" data-product-id="${product.id}">
                    <div class="favorites-item-image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="favorites-item-details">
                        <h3 class="favorites-item-title"><a href="product.html?id=${product.id}">${product.name}</a></h3>
                        <div class="favorites-item-meta">
                            <span class="favorites-item-category">${capitalizeFirstLetter(product.category)}</span>
                            <span class="favorites-item-era">${product.era}</span>
                        </div>
                        <div class="favorites-item-price">
                            ${product.salePrice ? 
                                `<span class="sale-price">$${product.salePrice.toFixed(2)}</span>
                                 <span class="original-price">$${product.price.toFixed(2)}</span>` : 
                                `$${product.price.toFixed(2)}`
                            }
                        </div>
                        <div class="favorites-item-actions">
                            <button class="btn btn-primary btn-sm add-to-cart" data-product-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-outline-danger btn-sm remove-from-favorites" data-product-id="${product.id}">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Update favorites container
        favoritesContainer.innerHTML = favoritesHTML;
        
        // Setup add to cart buttons
        setupFavoritesAddToCartButtons();
        
        // Setup remove buttons
        setupFavoritesRemoveButtons();
    });
}

// Setup favorites add to cart buttons
function setupFavoritesAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.favorites-item .add-to-cart');
    
    if (!addToCartButtons.length) return;
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            
            // Get product data
            getProductById(parseInt(productId)).then(product => {
                if (!product) return;
                
                // Add to cart (in a real implementation, this would add to cart)
                showToast(`${product.name} added to cart`, 'success');
                
                // Update cart count
                updateCartCount();
            });
        });
    });
}

// Setup favorites remove buttons
function setupFavoritesRemoveButtons() {
    const removeButtons = document.querySelectorAll('.favorites-item .remove-from-favorites');
    
    if (!removeButtons.length) return;
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const favoritesItem = this.closest('.favorites-item');
            const productId = this.getAttribute('data-product-id');
            
            if (favoritesItem) {
                // Get product data
                getProductById(parseInt(productId)).then(product => {
                    if (!product) return;
                    
                    // Remove from favorites (in a real implementation, this would remove from favorites)
                    showToast(`${product.name} removed from favorites`, 'info');
                    
                    // Add fade-out class
                    favoritesItem.classList.add('fade-out');
                    
                    // Remove item after animation
                    setTimeout(() => {
                        favoritesItem.remove();
                        
                        // Update favorites count
                        let favoritesCount = parseInt(localStorage.getItem('favoritesCount') || '0');
                        if (favoritesCount > 0) {
                            favoritesCount--;
                            localStorage.setItem('favoritesCount', favoritesCount.toString());
                            updateFavoritesCount();
                        }
                        
                        // Check if favorites is empty
                        const remainingItems = document.querySelectorAll('.favorites-item');
                        if (remainingItems.length === 0) {
                            // Show empty favorites message
                            document.querySelector('.favorites-items').innerHTML = `
                                <div class="text-center py-5">
                                    <div class="mb-4">
                                        <i class="fas fa-heart fa-3x text-muted"></i>
                                    </div>
                                    <h3>Your favorites list is empty</h3>
                                    <p class="text-muted">Looks like you haven't added any items to your favorites yet.</p>
                                    <a href="shop.html" class="btn btn-primary mt-3">Continue Shopping</a>
                                </div>
                            `;
                        }
                    }, 300);
                });
            }
        });
    });
}

// Initialize contact page
function initializeContactPage() {
    // Setup contact form
    setupContactForm();
    
    // Initialize map
    initializeContactMap();
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (this.checkValidity()) {
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending
            setTimeout(() => {
                // Show success message
                showToast('Your message has been sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = 'Send Message';
                submitBtn.disabled = false;
            }, 1500);
        } else {
            // Show validation messages
            this.classList.add('was-validated');
            
            // Scroll to first invalid field
            const firstInvalid = this.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });
}

// Initialize contact map
function initializeContactMap() {
    const mapContainer = document.getElementById('contactMap');
    
    if (!mapContainer) return;
    
    // In a real implementation, this would initialize a map
    // For this demo, we'll just show a placeholder
    mapContainer.innerHTML = `
        <div class="map-placeholder">
            <img src="https://source.unsplash.com/random/800x400/?map,city" alt="Store Location Map" class="img-fluid">
            <div class="map-overlay">
                <div class="map-marker">
                    <i class="fas fa-map-marker-alt"></i>
                </div>
            </div>
        </div>
    `;
}

// Initialize about page
function initializeAboutPage() {
    // Setup team member hover effects
    setupTeamMemberHover();
    
    // Setup testimonial slider
    setupTestimonialSlider();
}

// Setup team member hover effects
function setupTeamMemberHover() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    if (!teamMembers.length) return;
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        member.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });
}

// Setup testimonial slider
function setupTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (!testimonialSlider) return;
    
    let currentSlide = 0;
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;
    const nextBtn = testimonialSlider.querySelector('.testimonial-next');
    const prevBtn = testimonialSlider.querySelector('.testimonial-prev');
    
    // Show first slide
    slides[0].classList.add('active');
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            slides[currentSlide].classList.add('active');
        });
    }
    
    // Auto slide
    let slideInterval = setInterval(function() {
        if (nextBtn) {
            nextBtn.click();
        }
    }, 5000);
    
    // Pause on hover
    testimonialSlider.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });
    
    // Resume on mouse leave
    testimonialSlider.addEventListener('mouseleave', function() {
        clearInterval(slideInterval);
        slideInterval = setInterval(function() {
            if (nextBtn) {
                nextBtn.click();
            }
        }, 5000);
    });
}

// Update cart count
function updateCartCount() {
    // Get cart count from localStorage
    const cartCount = parseInt(localStorage.getItem('cartCount') || '0');
    
    // Update cart count in header
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        if (cartCount > 0) {
            cartCountElement.textContent = cartCount.toString();
            cartCountElement.style.display = 'block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Update favorites count
function updateFavoritesCount() {
    // Get favorites count from localStorage
    const favoritesCount = parseInt(localStorage.getItem('favoritesCount') || '0');
    
    // Update favorites count in header
    const favoritesCountElement = document.querySelector('.favorites-count');
    if (favoritesCountElement) {
        if (favoritesCount > 0) {
            favoritesCountElement.textContent = favoritesCount.toString();
            favoritesCountElement.style.display = 'block';
        } else {
            favoritesCountElement.style.display = 'none';
        }
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function for toast notifications
function showToast(message, type = 'success', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}
