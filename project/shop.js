// Configuration
const API_URL = "https://jsonplaceholder.typicode.com/photos"; // Mock API for products

// Product Data (for demo purposes)
const products = [
    { id: 1, title: "Knitted Crewneck", price: 49.99, image: "images/product1.jpg", hoverImage: "images/product1-alt.jpg" },
    { id: 2, title: "Leather Jacket", price: 129.99, image: "images/leather-jacket.jpg", hoverImage: "images/leather-jacket-alt.jpg" },
    { id: 3, title: "Pants", price: 59.99, image: "images/pants.jpg", hoverImage: "images/pants-alt.jpg" }
];

// Authentication Functions
function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole') || 'user';
    
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    const adminLink = document.getElementById('adminLink');

    if (isAuthenticated) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (adminLink && userRole === 'admin') adminLink.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (adminLink) adminLink.style.display = 'none';
    }

    // Protect admin page
    if (window.location.pathname.includes('admin.html') && (!isAuthenticated || userRole !== 'admin')) {
        window.location.href = 'account.html';
    }
}

function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    window.location.href = 'account.html';
}

// Product Display Functions
function displayProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = products.map(product => `
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
                    <select class="form-select mb-3 size-select" id="size-${product.id}">
                        <option value="" disabled selected>Select Size</option>
                        <option value="S">Small (S)</option>
                        <option value="M">Medium (M)</option>
                        <option value="L">Large (L)</option>
                    </select>
                    <button class="btn btn-secondary" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join("");
}

async function fetchProducts(containerId) {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch products");
        const products = await response.json();
        displayProducts(products.slice(0, 6), containerId); // Limit to 6 for demo
    } catch (error) {
        console.error("Error fetching products:", error);
        document.getElementById(containerId).innerHTML = "<p>Failed to load products. Please try again later.</p>";
    }
}

function addToFavorites(productId) {
    const favoriteIcon = document.querySelector(`.favorite-icon[onclick="addToFavorites(${productId})"]`);
    favoriteIcon.classList.toggle("active");
    const product = products.find(p => p.id === productId);
    alert(favoriteIcon.classList.contains("active") ? 
        `Added to favorites: ${product.title}` : 
        `Removed from favorites: ${product.title}`);
}

function addToCart(productId) {
    const sizeSelect = document.getElementById(`size-${productId}`);
    const selectedSize = sizeSelect.value;

    if (!selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
    }

    const product = products.find(p => p.id === productId);
    alert(`Added to cart: ${product.title} (Size: ${selectedSize})`);
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    // Handle logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Load products based on page
    if (window.location.pathname.includes("index.html")) {
        displayProducts(products.slice(0, 3), "featured-products");
    } else if (window.location.pathname.includes("shop.html")) {
        displayProducts(products, "products-grid");
    }

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'admin');
                window.location.href = 'admin.html';
            } else {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userRole', 'user');
                document.getElementById('login-container').classList.add('d-none');
                document.getElementById('account-container').classList.remove('d-none');
                document.querySelector('.username').textContent = username;
                document.querySelector('.user-email').textContent = `${username}@example.com`;
            }
        });
    }

    // Account navigation
    const accountLinks = document.querySelectorAll('.account-menu .nav-link');
    if (accountLinks) {
        accountLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                document.querySelectorAll('.account-section').forEach(s => s.classList.add('d-none'));
                document.getElementById(`${section}-section`).classList.remove('d-none');
                document.querySelector('.account-header h2').textContent = link.textContent.trim();
                accountLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // Logout from account page
    const logoutBtnAccount = document.querySelector('.btn-logout');
    if (logoutBtnAccount) {
        logoutBtnAccount.addEventListener('click', logout);
    }
});