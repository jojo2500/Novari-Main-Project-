// Shop page JavaScript with API integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the shop page
    initShopPage();

    // Filter toggle for mobile
    const filterToggle = document.getElementById('filterToggle');
    const filterSidebar = document.getElementById('filterSidebar');
    
    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', function() {
            filterSidebar.classList.toggle('show');
            
            if (filterSidebar.classList.contains('show')) {
                filterToggle.innerHTML = '<i class="fas fa-times"></i> Hide Filters';
            } else {
                filterToggle.innerHTML = '<i class="fas fa-filter"></i> Show Filters';
            }
        });
    }
    
    // Grid/List view toggle
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const productGrid = document.getElementById('productGrid');
    
    if (gridViewBtn && listViewBtn && productGrid) {
        gridViewBtn.addEventListener('click', function() {
            productGrid.classList.remove('list-view');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            
            // Save preference in localStorage
            localStorage.setItem('shopViewPreference', 'grid');
        });
        
        listViewBtn.addEventListener('click', function() {
            productGrid.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            
            // Save preference in localStorage
            localStorage.setItem('shopViewPreference', 'list');
        });
        
        // Load saved preference
        const savedViewPreference = localStorage.getItem('shopViewPreference');
        if (savedViewPreference === 'list') {
            productGrid.classList.add('list-view');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        }
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // Update URL parameters
            updateUrlParams({ sort: sortSelect.value });
            
            // Reload products with new sort
            loadProductsWithCurrentFilters();
            
            // Save preference in localStorage
            localStorage.setItem('shopSortPreference', sortSelect.value);
        });
        
        // Load saved preference
        const savedSortPreference = localStorage.getItem('shopSortPreference');
        if (savedSortPreference) {
            sortSelect.value = savedSortPreference;
        }
    }
    
    // Filter functionality
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    if (filterCheckboxes.length) {
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Apply filters
                applyFilters();
            });
        });
    }
    
    // Price range filter
    const applyPriceFilterBtn = document.getElementById('applyPriceFilter');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    if (applyPriceFilterBtn && minPriceInput && maxPriceInput) {
        applyPriceFilterBtn.addEventListener('click', function() {
            // Apply price filter
            applyFilters();
        });
    }
    
    // Clear all filters
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Clear all checkboxes
            filterCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Clear price range inputs
            if (minPriceInput && maxPriceInput) {
                minPriceInput.value = '';
                maxPriceInput.value = '';
            }
            
            // Clear URL parameters and reload products
            updateUrlParams({ 
                replaceAll: true,
                category: getUrlParams().category || null 
            });
            loadProductsWithCurrentFilters();
            
            // Show notification
            showToast('All filters cleared');
        });
    }
    
    // Pagination functionality
    setupPagination();
});

// Initialize the shop page
async function initShopPage() {
    // Get URL parameters
    const params = getUrlParams();
    
    // Set initial filter states based on URL parameters
    setInitialFilterStates(params);
    
    // Load products with current filters
    await loadProductsWithCurrentFilters();
    
    // Update breadcrumb based on category
    updateBreadcrumb(params.category);
    
    // Update page title based on category
    updatePageTitle(params.category);
}

// Set initial filter states based on URL parameters
function setInitialFilterStates(params) {
    // Set category checkboxes
    if (params.category) {
        const categoryCheckbox = document.querySelector(`.filter-checkbox input[name="category"][value="${params.category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
    
    // Set subcategory checkboxes
    if (params.subcategory) {
        const subcategoryCheckbox = document.querySelector(`.filter-checkbox input[name="subcategory"][value="${params.subcategory}"]`);
        if (subcategoryCheckbox) {
            subcategoryCheckbox.checked = true;
        }
    }
    
    // Set era checkboxes
    if (params.era) {
        const eraCheckbox = document.querySelector(`.filter-checkbox input[name="decade"][value="${params.era}"]`);
        if (eraCheckbox) {
            eraCheckbox.checked = true;
        }
    }
    
    // Set size checkboxes
    if (params.size) {
        const sizeCheckbox = document.querySelector(`.filter-checkbox input[name="size"][value="${params.size}"]`);
        if (sizeCheckbox) {
            sizeCheckbox.checked = true;
        }
    }
    
    // Set color checkboxes
    if (params.color) {
        const colorCheckbox = document.querySelector(`.filter-checkbox input[name="color"][value="${params.color}"]`);
        if (colorCheckbox) {
            colorCheckbox.checked = true;
        }
    }
    
    // Set price range inputs
    if (params.minPrice) {
        document.getElementById('minPrice').value = params.minPrice;
    }
    
    if (params.maxPrice) {
        document.getElementById('maxPrice').value = params.maxPrice;
    }
    
    // Set sort select
    if (params.sort) {
        document.getElementById('sortSelect').value = params.sort;
    }
}

// Load products with current filters
async function loadProductsWithCurrentFilters() {
    // Show loading state
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        productGrid.innerHTML = '<div class="text-center w-100 py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    }
    
    // Get current filters from URL
    const params = getUrlParams();
    
    // Create filters object
    const filters = {
        category: params.category || null,
        subcategory: params.subcategory || null,
        era: params.era || null,
        size: params.size || null,
        color: params.color || null,
        minPrice: params.minPrice || null,
        maxPrice: params.maxPrice || null,
        onSale: params.onSale === 'true' || null,
        newArrivals: params.newArrivals === 'true' || null
    };
    
    // Get filtered products
    let products = await filterProducts(filters);
    
    // Sort products
    const sortBy = params.sort || 'featured';
    products = sortProducts(products, sortBy);
    
    // Update product grid
    updateProductGrid(products);
    
    // Update result count
    updateResultCount(products.length);
    
    // Setup product interactions
    setupProductInteractions();
}

// Update product grid with products
function updateProductGrid(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div class="text-center w-100 py-5">
                <div class="mb-4">
                    <i class="fas fa-search fa-3x text-muted"></i>
                </div>
                <h3>No products found</h3>
                <p class="text-muted">Try adjusting your filters or search criteria.</p>
                <button class="btn btn-outline-primary" id="clearAllFilters">Clear All Filters</button>
            </div>
        `;
        
        const clearAllFiltersBtn = document.getElementById('clearAllFilters');
        if (clearAllFiltersBtn) {
            clearAllFiltersBtn.addEventListener('click', function() {
                document.getElementById('clearFilters').click();
            });
        }
        
        return;
    }
    
    // Generate HTML for each product
    let productsHTML = '';
    products.forEach(product => {
        productsHTML += generateProductCardHTML(product);
    });
    
    // Update product grid
    productGrid.innerHTML = productsHTML;
}

// Update result count
function updateResultCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    const totalResults = document.getElementById('totalResults');
    
    if (resultsCount) {
        resultsCount.textContent = count;
    }
    
    if (totalResults) {
        // In a real implementation, this would be the total number of products
        // For this demo, we'll use the count from our products array
        loadProducts().then(products => {
            totalResults.textContent = products.length;
        });
    }
}

// Apply filters from form inputs
function applyFilters() {
    // Get all checked category checkboxes
    const categoryCheckboxes = document.querySelectorAll('.filter-checkbox input[name="category"]:checked');
    const category = categoryCheckboxes.length > 0 ? categoryCheckboxes[0].value : null;
    
    // Get all checked subcategory checkboxes
    const subcategoryCheckboxes = document.querySelectorAll('.filter-checkbox input[name="subcategory"]:checked');
    const subcategory = subcategoryCheckboxes.length > 0 ? subcategoryCheckboxes[0].value : null;
    
    // Get all checked era checkboxes
    const eraCheckboxes = document.querySelectorAll('.filter-checkbox input[name="decade"]:checked');
    const era = eraCheckboxes.length > 0 ? eraCheckboxes[0].value : null;
    
    // Get all checked size checkboxes
    const sizeCheckboxes = document.querySelectorAll('.filter-checkbox input[name="size"]:checked');
    const size = sizeCheckboxes.length > 0 ? sizeCheckboxes[0].value : null;
    
    // Get all checked color checkboxes
    const colorCheckboxes = document.querySelectorAll('.filter-checkbox input[name="color"]:checked');
    const color = colorCheckboxes.length > 0 ? colorCheckboxes[0].value : null;
    
    // Get price range
    const minPrice = document.getElementById('minPrice').value || null;
    const maxPrice = document.getElementById('maxPrice').value || null;
    
    // Update URL parameters
    updateUrlParams({
        category,
        subcategory,
        era,
        size,
        color,
        minPrice,
        maxPrice
    });
    
    // Reload products with new filters
    loadProductsWithCurrentFilters();
}

// Update breadcrumb based on category
function updateBreadcrumb(category) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    // Get category name
    let categoryName = 'All Products';
    if (category) {
        categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Update breadcrumb
    breadcrumb.innerHTML = `
        <li class="breadcrumb-item"><a href="index.html" style="color: var(--light-color);">Home</a></li>
        <li class="breadcrumb-item active" aria-current="page" style="color: var(--light-color);">${categoryName}</li>
    `;
}

// Update page title based on category
function updatePageTitle(category) {
    const pageTitle = document.querySelector('.shop-header h1');
    if (!pageTitle) return;
    
    // Get category name
    let categoryName = 'Our Collection';
    if (category) {
        categoryName = category.charAt(0).toUpperCase() + category.slice(1) + ' Collection';
    }
    
    // Update page title
    pageTitle.textContent = categoryName;
}

// Setup pagination
function setupPagination() {
    const paginationLinks = document.querySelectorAll('.pagination .page-item:not(.disabled) a');
    if (paginationLinks.length) {
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all pagination items
                document.querySelectorAll('.pagination .page-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked pagination item
                this.parentElement.classList.add('active');
                
                // In a real implementation, this would load the next page of products
                // For this demo, we'll just show a toast notification
                const pageNumber = this.textContent.trim();
                showToast(`Navigated to page ${pageNumber}`);
                
                // Scroll to top of product grid
                const productGrid = document.getElementById('productGrid');
                if (productGrid) {
                    productGrid.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

// Setup product interactions
function setupProductInteractions() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    if (addToCartButtons.length) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.getAttribute('data-product-id');
                const productName = productCard.querySelector('.card-title').textContent;
                
                // Add to cart (in a real implementation, this would add to cart)
                showToast(`${productName} added to cart`);
                
                // Update cart count
                updateCartCount();
            });
        });
    }
    
    // Wishlist buttons
    const wishlistButtons = document.querySelectorAll('.btn-wishlist');
    if (wishlistButtons.length) {
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.getAttribute('data-product-id');
                const productName = productCard.querySelector('.card-title').textContent;
                
                this.classList.toggle('active');
                
                const heartIcon = this.querySelector('i');
                if (heartIcon) {
                    if (heartIcon.classList.contains('far')) {
                        heartIcon.classList.remove('far');
                        heartIcon.classList.add('fas');
                        showToast(`${productName} added to favorites`);
                    } else {
                        heartIcon.classList.remove('fas');
                        heartIcon.classList.add('far');
                        showToast(`${productName} removed from favorites`);
                    }
                }
                
                // Update favorites count
                updateFavoritesCount();
            });
        });
    }
    
    // Quick view buttons
    const quickViewButtons = document.querySelectorAll('.btn-quick-view');
    if (quickViewButtons.length) {
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productId = productCard.getAttribute('data-product-id');
                const productName = productCard.querySelector('.card-title').textContent;
                
                // In a real implementation, this would open a quick view modal
                // For this demo, we'll just navigate to the product page
                window.location.href = `product.html?id=${productId}`;
            });
        });
    }
}
