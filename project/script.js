// script.js

const API_URL = "https://jsonplaceholder.typicode.com/photos"; // Mock API

// Fetch and display products
async function fetchProducts(containerId) {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch products");
        const products = await response.json();
        displayProducts(products, containerId);
    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById(containerId).innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
}

const products = [
    {
        id: 1,
        title: "Knitted Crewneck",
        price: 49.99,
        image: "images/product1.jpg",
        hoverImage: "images/product1-alt.jpg"
    },
    {
        id: 2,
        title: "Leather Jacket",
        price: 129.99,
        image: "images/leather-jacket.jpg",
        hoverImage: "images/leather-jacket-alt.jpg"
    },
    {
        id: 3,
        title: "Pants",
        price: 59.99,
        image: "images/pants.jpg",
        hoverImage: "images/pants-alt.jpg"
    }
];

function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = products
        .map(
            (product) => `
            <div class="col-md-4">
                <div class="card product-card">
                    <div class="product-image-container">
                        <img src="${product.image}" class="card-img-top product-image" alt="${product.title}">
                        <img src="${product.hoverImage}" class="card-img-top product-image hover-image" alt="${product.title} - Alternate View">
                        <i class="fas fa-heart favorite-icon" onclick="addToFavorites(${product.id})"></i>
                    </div>
                    <div class="card-body text-center">
                        <h5 class="product-title">${product.title}</h5>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <select class="form-select mb-3 size-select">
                            <option value="" disabled selected>Select Size</option>
                            <option value="S">Small (S)</option>
                            <option value="M">Medium (M)</option>
                            <option value="L">Large (L)</option>
                        </select>
                        <button class="btn btn-secondary" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `
        )
        .join("");
}

// Function to add a product to favorites
function addToFavorites(productId) {
    const favoriteIcon = document.querySelector(`.favorite-icon[onclick="addToFavorites(${productId})"]`);
    favoriteIcon.classList.toggle("active"); // Toggle the favorite state
    const product = products.find((p) => p.id === productId);
    if (favoriteIcon.classList.contains("active")) {
        console.log(`Added to favorites: ${product.title}`);
        alert(`Added to favorites: ${product.title}`);
    } else {
        console.log(`Removed from favorites: ${product.title}`);
        alert(`Removed from favorites: ${product.title}`);
    }
}

// Function to add a product to the cart
function addToCart(productId) {
    const sizeSelect = document.querySelector(`.size-select[onchange="addToCart(${productId})"]`);
    const selectedSize = sizeSelect.value;

    if (!selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
    }

    const product = products.find((p) => p.id === productId);
    console.log(`Added to cart: ${product.title} (Size: ${selectedSize})`);
    alert(`Added to cart: ${product.title} (Size: ${selectedSize})`);
}

// Fetch and display products for the current page
if (window.location.pathname.includes("index.html")) {
    displayProducts(products, "featured-products");
} else if (window.location.pathname.includes("shop.html")) {
    displayProducts(products, "all-products");
}

// Admin: Add product
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const product = {
        name: document.getElementById("product-name").value,
        price: document.getElementById("product-price").value,
        image: document.getElementById("product-image").value,
    };
    console.log("Adding product:", product);
    // Implement API call to add product
});

// Admin: Remove product
document.getElementById("remove-product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const productId = document.getElementById("product-id").value;
    console.log(`Removing product with ID: ${productId}`);
    // Implement API call to remove product
});

// Fetch products for each page
if (window.location.pathname.includes("index.html")) {
    fetchProducts("featured-products");
} else if (window.location.pathname.includes("shop.html")) {
    fetchProducts("all-products");
}// Configuration
const API_BASE_URL = 'https://your-api-endpoint.com/api';
const UPLOAD_ENDPOINT = '/upload';
const PRODUCTS_ENDPOINT = '/products';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const productForm = document.getElementById('product-form');
const imageInput = document.getElementById('product-image');
const imagePreview = document.getElementById('image-preview');
const uploadProgress = document.getElementById('upload-progress');

// State
let uploadedImageUrl = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Image upload handling
    imageInput.addEventListener('change', handleImageUpload);
    
    // Product form submission
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleProductSubmit();
    });
}

// Handle image upload from device
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate image
    if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG)');
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" class="img-thumbnail">`;
        imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Upload to API
    try {
        uploadProgress.style.display = 'block';
        uploadedImageUrl = await uploadImageToApi(file);
        console.log('Image uploaded:', uploadedImageUrl);
    } catch (error) {
        console.error('Upload failed:', error);
        alert('Image upload failed. Please try again.');
    } finally {
        uploadProgress.style.display = 'none';
    }
}

// Upload image to API
async function uploadImageToApi(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}${UPLOAD_ENDPOINT}`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.imageUrl;
}

// Handle product submission
async function handleProductSubmit() {
    if (!uploadedImageUrl) {
        alert('Please upload an image first');
        return;
    }

    const product = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        imageUrl: uploadedImageUrl,
        hoverImageUrl: uploadedImageUrl // In a real app, you'd upload a separate hover image
    };

    try {
        const response = await fetch(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(`Product creation failed: ${response.statusText}`);
        }

        const newProduct = await response.json();
        alert(`Product "${newProduct.name}" created successfully!`);
        productForm.reset();
        imagePreview.style.display = 'none';
        uploadedImageUrl = '';
        fetchProducts(); // Refresh the product list
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to create product. Please try again.');
    }
}

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        renderProducts(data.products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productGrid.innerHTML = '<div class="alert alert-danger">Failed to load products</div>';
    }
}

// Render products to the grid
function renderProducts(products) {
    productGrid.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card product-card">
                <div class="product-image-container">
                    <img src="${product.imageUrl}" 
                         class="card-img-top product-image" 
                         alt="${product.name}"
                         loading="lazy">
                    ${product.hoverImageUrl ? `
                    <img src="${product.hoverImageUrl}" 
                         class="card-img-top product-image hover-image" 
                         alt="${product.name} - Alternate View">
                    ` : ''}
                    <button class="btn btn-sm btn-danger delete-product" 
                            data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description || ''}</p>
                    <p class="price">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Add delete event listeners
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.id;
            deleteProduct(productId);
        });
    });
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`Delete failed: ${response.statusText}`);
        }

        alert('Product deleted successfully');
        fetchProducts(); // Refresh the list
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete product');
    }
}

// Account Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const accountContainer = document.getElementById('account-container');
    const loginContainer = document.getElementById('login-container');
    const loginError = document.getElementById('login-error');
    const loginButton = document.getElementById('login-button');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('login-password');
    const forgotPassword = document.getElementById('forgot-password');
    const passwordRecoveryModal = new bootstrap.Modal(document.getElementById('passwordRecoveryModal'));
    const passwordRecoveryForm = document.getElementById('password-recovery-form');
    const refreshDashboard = document.getElementById('refresh-dashboard');
    const changeAvatar = document.getElementById('change-avatar');

    // Admin credentials (in a real application, this should be handled server-side)
    const ADMIN_CREDENTIALS = {
        email: 'admin@novari.com',
        password: 'admin123'
    };

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            loginButton.disabled = true;
            loginButton.querySelector('.spinner-border').classList.remove('d-none');
            loginButton.querySelector('.button-text').textContent = 'Logging in...';
            loginError.classList.add('d-none');

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;

            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Validate email format
                if (!email || !email.includes('@')) {
                    throw new Error('Please enter a valid email address');
                }

                // Check for admin credentials
                if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
                    // Set admin role and redirect
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userRole', 'admin');
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    // Force redirect to admin page
                    window.location.replace('admin.html');
                    return;
                }

                // Regular user login (in a real app, this would validate against a backend)
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userRole', 'user');
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // Show account page
                showAccountPage();
            } catch (error) {
                loginError.textContent = error.message || 'Invalid email or password. Please try again.';
                loginError.classList.remove('d-none');
            } finally {
                // Reset button state
                loginButton.disabled = false;
                loginButton.querySelector('.spinner-border').classList.add('d-none');
                loginButton.querySelector('.button-text').textContent = 'Login';
            }
        });
    }

    // Handle forgot password
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            passwordRecoveryModal.show();
        });
    }

    // Handle password recovery form
    if (passwordRecoveryForm) {
        passwordRecoveryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('recovery-email').value;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Password reset link has been sent to your email.');
                passwordRecoveryModal.hide();
            } catch (error) {
                alert('Failed to send reset link. Please try again.');
            }
        });
    }

    // Handle dashboard refresh
    if (refreshDashboard) {
        refreshDashboard.addEventListener('click', async function() {
            this.disabled = true;
            this.querySelector('i').classList.add('fa-spin');
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                updateDashboardStats();
            } finally {
                this.disabled = false;
                this.querySelector('i').classList.remove('fa-spin');
            }
        });
    }

    // Handle avatar change
    if (changeAvatar) {
        changeAvatar.addEventListener('click', function() {
            // Create file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = async function(e) {
                const file = e.target.files[0];
                if (file) {
                    try {
                        // Simulate upload
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        alert('Avatar updated successfully!');
                    } catch (error) {
                        alert('Failed to update avatar. Please try again.');
                    }
                }
            };
            
            input.click();
        });
    }

    // Update dashboard stats
    function updateDashboardStats() {
        // Simulate fetching stats
        const stats = {
            orders: Math.floor(Math.random() * 10),
            wishlist: Math.floor(Math.random() * 20)
        };

        document.querySelectorAll('.stat-card h3').forEach((el, index) => {
            el.textContent = index === 0 ? stats.orders : stats.wishlist;
        });
    }

    // Show account page
    function showAccountPage() {
        loginContainer.classList.add('d-none');
        accountContainer.classList.remove('d-none');
        
        // Update user info
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        document.querySelectorAll('.user-email').forEach(el => el.textContent = userEmail);
        document.querySelectorAll('.username').forEach(el => el.textContent = userEmail.split('@')[0]);
        
        // Update member since date
        document.getElementById('member-since').textContent = new Date().getFullYear();
        
        // Initialize dashboard
        updateDashboardStats();
    }

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        showAccountPage();
    }
});

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Search suggestions functionality
    const searchInput = document.getElementById('desktop-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            if (searchTerm.length >= 2) {
                // Simulate search suggestions
                showSearchSuggestions(searchTerm);
            } else {
                hideSearchSuggestions();
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.search-container')) {
                hideSearchSuggestions();
            }
        });
    }

    // Quick view functionality
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            openQuickView(productId);
        });
    });

    // Wishlist functionality
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleWishlist(this);
        });
    });

    // Newsletter form validation
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('#email');
            if (validateEmail(emailInput.value)) {
                showToast('Thank you for subscribing!', 'success');
                this.reset();
            } else {
                showToast('Please enter a valid email address.', 'error');
            }
        });
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.navbar-toggler');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Function to show search suggestions
function showSearchSuggestions(searchTerm) {
    let suggestionsContainer = document.querySelector('.search-suggestions');
    
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        document.querySelector('.search-container').appendChild(suggestionsContainer);
    }
    
    // Simulate API call for suggestions
    const suggestions = [
        `${searchTerm} dresses`,
        `${searchTerm} jackets`,
        `${searchTerm} accessories`,
        `${searchTerm} vintage`
    ];
    
    suggestionsContainer.innerHTML = suggestions.map(suggestion => 
        `<div class="suggestion-item">${suggestion}</div>`
    ).join('');
    
    suggestionsContainer.style.display = 'block';
    
    // Add click event to suggestions
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            document.getElementById('desktop-search').value = this.textContent;
            hideSearchSuggestions();
        });
    });
}

// Function to hide search suggestions
function hideSearchSuggestions() {
    const suggestionsContainer = document.querySelector('.search-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Function to open quick view modal
function openQuickView(productId) {
    // In a real application, you would fetch product data from an API
    // For now, we'll just show a toast notification
    showToast('Quick view feature coming soon!', 'info');
}

// Function to toggle wishlist
function toggleWishlist(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showToast('Added to wishlist!', 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showToast('Removed from wishlist', 'info');
    }
}

// Function to validate email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Function to show toast notifications
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    // Add type-specific styling
    if (type === 'success') {
        toast.style.backgroundColor = '#28a745';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#dc3545';
    } else if (type === 'info') {
        toast.style.backgroundColor = '#17a2b8';
    }
    
    // Add to document
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

