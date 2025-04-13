// Product detail page JavaScript with API integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the product page
    initProductPage();
    
    // Setup image gallery
    setupImageGallery();
    
    // Setup quantity selector
    setupQuantitySelector();
    
    // Setup size selector
    setupSizeSelector();
    
    // Setup color selector
    setupColorSelector();
    
    // Setup add to cart button
    setupAddToCartButton();
    
    // Setup add to wishlist button
    setupAddToWishlistButton();
    
    // Setup product tabs
    setupProductTabs();
    
    // Setup related products
    loadRelatedProducts();
    
    // Setup recently viewed products
    updateRecentlyViewed();
    loadRecentlyViewedProducts();
});

// Initialize the product page
async function initProductPage() {
    // Get product ID from URL
    const params = getUrlParams();
    const productId = params.id;
    
    if (!productId) {
        // Redirect to shop page if no product ID
        window.location.href = 'shop.html';
        return;
    }
    
    // Get product data
    const product = await getProductById(parseInt(productId));
    
    if (!product) {
        // Show error message if product not found
        document.querySelector('.product-main').innerHTML = `
            <div class="text-center py-5">
                <div class="mb-4">
                    <i class="fas fa-exclamation-circle fa-3x text-muted"></i>
                </div>
                <h3>Product Not Found</h3>
                <p class="text-muted">The product you're looking for doesn't exist or has been removed.</p>
                <a href="shop.html" class="btn btn-primary mt-3">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    // Update product details
    updateProductDetails(product);
    
    // Update breadcrumb
    updateBreadcrumb(product);
    
    // Update page title
    document.title = `${product.name} | Novari`;
}

// Update product details
function updateProductDetails(product) {
    // Update product name
    const productName = document.querySelector('.product-title');
    if (productName) {
        productName.textContent = product.name;
    }
    
    // Update product price
    const productPrice = document.querySelector('.product-price');
    if (productPrice) {
        if (product.salePrice) {
            productPrice.innerHTML = `
                <span class="sale-price">$${product.salePrice.toFixed(2)}</span>
                <span class="original-price">$${product.price.toFixed(2)}</span>
            `;
        } else {
            productPrice.innerHTML = `$${product.price.toFixed(2)}`;
        }
    }
    
    // Update product rating
    const productRating = document.querySelector('.product-rating');
    if (productRating) {
        productRating.innerHTML = `
            ${generateStarRating(product.rating)}
            <span class="rating-count">(${product.reviewCount} reviews)</span>
        `;
    }
    
    // Update product description
    const productDescription = document.querySelector('.product-description');
    if (productDescription) {
        productDescription.textContent = product.description;
    }
    
    // Update product features
    const productFeatures = document.querySelector('.product-features');
    if (productFeatures) {
        let featuresHTML = '<ul class="features-list">';
        product.features.forEach(feature => {
            featuresHTML += `<li><i class="fas fa-check text-primary me-2"></i>${feature}</li>`;
        });
        featuresHTML += '</ul>';
        productFeatures.innerHTML = featuresHTML;
    }
    
    // Update product condition
    const productCondition = document.querySelector('.product-condition');
    if (productCondition) {
        productCondition.textContent = product.condition;
    }
    
    // Update product material
    const productMaterial = document.querySelector('.product-material');
    if (productMaterial) {
        productMaterial.textContent = product.material;
    }
    
    // Update product era
    const productEra = document.querySelector('.product-era');
    if (productEra) {
        productEra.textContent = product.era;
    }
    
    // Update available sizes
    const sizeOptions = document.querySelector('.size-options');
    if (sizeOptions) {
        let sizesHTML = '';
        product.sizes.forEach(size => {
            const isAvailable = product.availableSizes.includes(size);
            sizesHTML += `
                <div class="size-option ${isAvailable ? '' : 'disabled'}" data-size="${size}">
                    <span>${size}</span>
                </div>
            `;
        });
        sizeOptions.innerHTML = sizesHTML;
    }
    
    // Update available colors
    const colorOptions = document.querySelector('.color-options');
    if (colorOptions) {
        let colorsHTML = '';
        product.colors.forEach(color => {
            colorsHTML += `
                <div class="color-option" data-color="${color.name}" title="${color.name}">
                    <span class="color-swatch" style="background: ${color.code};"></span>
                </div>
            `;
        });
        colorOptions.innerHTML = colorsHTML;
    }
    
    // Update product images
    const mainImage = document.querySelector('.main-image img');
    if (mainImage) {
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
    }
    
    // Update image thumbnails
    const thumbnailContainer = document.querySelector('.thumbnails');
    if (thumbnailContainer) {
        let thumbnailsHTML = '';
        product.thumbnails.forEach((thumbnail, index) => {
            thumbnailsHTML += `
                <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <img src="${thumbnail}" alt="${product.name} - Thumbnail ${index + 1}">
                </div>
            `;
        });
        thumbnailContainer.innerHTML = thumbnailsHTML;
    }
    
    // Update product tabs content
    const descriptionTab = document.querySelector('#description-tab-pane');
    if (descriptionTab) {
        descriptionTab.innerHTML = `
            <h4>Product Description</h4>
            <p>${product.description}</p>
            <h5>Features</h5>
            <ul class="features-list">
                ${product.features.map(feature => `<li><i class="fas fa-check text-primary me-2"></i>${feature}</li>`).join('')}
            </ul>
        `;
    }
    
    const specificationsTab = document.querySelector('#specifications-tab-pane');
    if (specificationsTab) {
        specificationsTab.innerHTML = `
            <h4>Product Specifications</h4>
            <table class="table specifications-table">
                <tbody>
                    <tr>
                        <th>Condition</th>
                        <td>${product.condition}</td>
                    </tr>
                    <tr>
                        <th>Material</th>
                        <td>${product.material}</td>
                    </tr>
                    <tr>
                        <th>Era</th>
                        <td>${product.era}</td>
                    </tr>
                    <tr>
                        <th>Available Sizes</th>
                        <td>${product.availableSizes.join(', ')}</td>
                    </tr>
                    <tr>
                        <th>Available Colors</th>
                        <td>${product.colors.map(color => color.name).join(', ')}</td>
                    </tr>
                </tbody>
            </table>
        `;
    }
    
    // Update reviews tab with dummy reviews
    const reviewsTab = document.querySelector('#reviews-tab-pane');
    if (reviewsTab) {
        const reviewsHTML = generateDummyReviews(product.reviewCount, product.rating);
        reviewsTab.innerHTML = reviewsHTML;
    }
    
    // Update shipping tab with dummy shipping info
    const shippingTab = document.querySelector('#shipping-tab-pane');
    if (shippingTab) {
        shippingTab.innerHTML = `
            <h4>Shipping Information</h4>
            <p>We offer worldwide shipping on all our vintage items. Please note that as these are unique vintage pieces, processing time may vary.</p>
            
            <h5>Shipping Options</h5>
            <table class="table shipping-table">
                <thead>
                    <tr>
                        <th>Shipping Method</th>
                        <th>Estimated Delivery</th>
                        <th>Cost</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Standard Shipping</td>
                        <td>7-10 business days</td>
                        <td>$5.99</td>
                    </tr>
                    <tr>
                        <td>Express Shipping</td>
                        <td>3-5 business days</td>
                        <td>$12.99</td>
                    </tr>
                    <tr>
                        <td>Next Day Delivery</td>
                        <td>1 business day</td>
                        <td>$19.99</td>
                    </tr>
                </tbody>
            </table>
            
            <h5>Returns & Exchanges</h5>
            <p>We accept returns within 14 days of delivery. Please note that items must be returned in their original condition with tags attached. For more information, please visit our <a href="#">Returns Policy</a> page.</p>
        `;
    }
}

// Update breadcrumb
function updateBreadcrumb(product) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    breadcrumb.innerHTML = `
        <li class="breadcrumb-item"><a href="index.html">Home</a></li>
        <li class="breadcrumb-item"><a href="shop.html">Shop</a></li>
        <li class="breadcrumb-item"><a href="shop.html?category=${product.category}">${capitalizeFirstLetter(product.category)}</a></li>
        <li class="breadcrumb-item active" aria-current="page">${product.name}</li>
    `;
}

// Setup image gallery
function setupImageGallery() {
    const mainImage = document.querySelector('.main-image img');
    const thumbnailContainer = document.querySelector('.thumbnails');
    
    if (!mainImage || !thumbnailContainer) return;
    
    // Add click event to thumbnails
    thumbnailContainer.addEventListener('click', function(e) {
        const thumbnail = e.target.closest('.thumbnail');
        if (!thumbnail) return;
        
        // Get product ID and image index
        const productId = getUrlParams().id;
        const imageIndex = parseInt(thumbnail.getAttribute('data-index'));
        
        // Get product data
        getProductById(parseInt(productId)).then(product => {
            if (!product) return;
            
            // Update main image
            mainImage.src = product.images[imageIndex];
            
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
        });
    });
    
    // Add zoom effect to main image
    if (mainImage.parentElement) {
        mainImage.parentElement.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;
            
            mainImage.style.transformOrigin = `${x}% ${y}%`;
        });
        
        mainImage.parentElement.addEventListener('mouseenter', function() {
            mainImage.style.transform = 'scale(1.5)';
        });
        
        mainImage.parentElement.addEventListener('mouseleave', function() {
            mainImage.style.transform = 'scale(1)';
        });
    }
}

// Setup quantity selector
function setupQuantitySelector() {
    const quantityInput = document.querySelector('.quantity-input');
    const decreaseBtn = document.querySelector('.quantity-decrease');
    const increaseBtn = document.querySelector('.quantity-increase');
    
    if (!quantityInput || !decreaseBtn || !increaseBtn) return;
    
    decreaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    increaseBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
        }
    });
}

// Setup size selector
function setupSizeSelector() {
    const sizeOptions = document.querySelector('.size-options');
    if (!sizeOptions) return;
    
    sizeOptions.addEventListener('click', function(e) {
        const sizeOption = e.target.closest('.size-option');
        if (!sizeOption || sizeOption.classList.contains('disabled')) return;
        
        // Remove active class from all size options
        document.querySelectorAll('.size-option').forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to clicked size option
        sizeOption.classList.add('active');
        
        // Update hidden size input
        const sizeInput = document.querySelector('input[name="size"]');
        if (sizeInput) {
            sizeInput.value = sizeOption.getAttribute('data-size');
        }
    });
}

// Setup color selector
function setupColorSelector() {
    const colorOptions = document.querySelector('.color-options');
    if (!colorOptions) return;
    
    colorOptions.addEventListener('click', function(e) {
        const colorOption = e.target.closest('.color-option');
        if (!colorOption) return;
        
        // Remove active class from all color options
        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('active');
        });
        
        // Add active class to clicked color option
        colorOption.classList.add('active');
        
        // Update hidden color input
        const colorInput = document.querySelector('input[name="color"]');
        if (colorInput) {
            colorInput.value = colorOption.getAttribute('data-color');
        }
    });
}

// Setup add to cart button
function setupAddToCartButton() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener('click', function() {
        // Get product ID
        const productId = getUrlParams().id;
        
        // Get selected size
        const selectedSize = document.querySelector('.size-option.active');
        if (!selectedSize) {
            showToast('Please select a size', 'error');
            return;
        }
        
        // Get selected color
        const selectedColor = document.querySelector('.color-option.active');
        if (!selectedColor) {
            showToast('Please select a color', 'error');
            return;
        }
        
        // Get quantity
        const quantity = document.querySelector('.quantity-input').value;
        
        // Get product data
        getProductById(parseInt(productId)).then(product => {
            if (!product) return;
            
            // Add to cart (in a real implementation, this would add to cart)
            showToast(`${product.name} added to cart`, 'success');
            
            // Update cart count
            updateCartCount();
        });
    });
}

// Setup add to wishlist button
function setupAddToWishlistButton() {
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (!wishlistBtn) return;
    
    wishlistBtn.addEventListener('click', function() {
        // Get product ID
        const productId = getUrlParams().id;
        
        // Toggle active class
        this.classList.toggle('active');
        
        // Get product data
        getProductById(parseInt(productId)).then(product => {
            if (!product) return;
            
            const heartIcon = this.querySelector('i');
            if (heartIcon) {
                if (heartIcon.classList.contains('far')) {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                    showToast(`${product.name} added to favorites`, 'success');
                } else {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                    showToast(`${product.name} removed from favorites`, 'info');
                }
            }
            
            // Update favorites count
            updateFavoritesCount();
        });
    });
}

// Setup product tabs
function setupProductTabs() {
    const tabButtons = document.querySelectorAll('.product-tabs .nav-link');
    const tabPanes = document.querySelectorAll('.product-tabs .tab-pane');
    
    if (!tabButtons.length || !tabPanes.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tab buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked tab button
            this.classList.add('active');
            
            // Hide all tab panes
            tabPanes.forEach(pane => {
                pane.classList.remove('show', 'active');
            });
            
            // Show corresponding tab pane
            const target = this.getAttribute('data-bs-target');
            const targetPane = document.querySelector(target);
            if (targetPane) {
                targetPane.classList.add('show', 'active');
            }
        });
    });
}

// Load related products
async function loadRelatedProducts() {
    const relatedProductsContainer = document.querySelector('.related-products .row');
    if (!relatedProductsContainer) return;
    
    // Show loading state
    relatedProductsContainer.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Get product ID
    const productId = getUrlParams().id;
    
    // Get related products
    const relatedProducts = await getRelatedProducts(parseInt(productId), 4);
    
    if (!relatedProducts.length) {
        relatedProductsContainer.innerHTML = `
            <div class="col-12 text-center py-4">
                <p class="text-muted">No related products found.</p>
            </div>
        `;
        return;
    }
    
    // Generate HTML for related products
    let relatedProductsHTML = '';
    relatedProducts.forEach(product => {
        relatedProductsHTML += `
            <div class="col-md-3 col-sm-6 mb-4">
                ${generateProductCardHTML(product)}
            </div>
        `;
    });
    
    // Update related products container
    relatedProductsContainer.innerHTML = relatedProductsHTML;
    
    // Setup product interactions
    setupProductInteractions();
}

// Update recently viewed products
function updateRecentlyViewed() {
    // Get product ID
    const productId = getUrlParams().id;
    if (!productId) return;
    
    // Get recently viewed products from localStorage
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove current product if already in list
    recentlyViewed = recentlyViewed.filter(id => id !== parseInt(productId));
    
    // Add current product to beginning of list
    recentlyViewed.unshift(parseInt(productId));
    
    // Limit to 4 products
    recentlyViewed = recentlyViewed.slice(0, 4);
    
    // Save to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Load recently viewed products
async function loadRecentlyViewedProducts() {
    const recentlyViewedContainer = document.querySelector('.recently-viewed .row');
    if (!recentlyViewedContainer) return;
    
    // Get recently viewed products from localStorage
    const recentlyViewedIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    
    // Remove current product ID
    const currentProductId = parseInt(getUrlParams().id);
    const filteredIds = recentlyViewedIds.filter(id => id !== currentProductId);
    
    if (!filteredIds.length) {
        // Hide recently viewed section if no products
        const recentlyViewedSection = document.querySelector('.recently-viewed');
        if (recentlyViewedSection) {
            recentlyViewedSection.style.display = 'none';
        }
        return;
    }
    
    // Show loading state
    recentlyViewedContainer.innerHTML = `
        <div class="col-12 text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    // Get products data
    const products = await loadProducts();
    const recentlyViewedProducts = filteredIds
        .map(id => products.find(product => product.id === id))
        .filter(product => product !== undefined);
    
    if (!recentlyViewedProducts.length) {
        // Hide recently viewed section if no products
        const recentlyViewedSection = document.querySelector('.recently-viewed');
        if (recentlyViewedSection) {
            recentlyViewedSection.style.display = 'none';
        }
        return;
    }
    
    // Generate HTML for recently viewed products
    let recentlyViewedHTML = '';
    recentlyViewedProducts.forEach(product => {
        recentlyViewedHTML += `
            <div class="col-md-3 col-sm-6 mb-4">
                ${generateProductCardHTML(product)}
            </div>
        `;
    });
    
    // Update recently viewed container
    recentlyViewedContainer.innerHTML = recentlyViewedHTML;
    
    // Setup product interactions
    setupProductInteractions();
}

// Generate dummy reviews
function generateDummyReviews(count, averageRating) {
    const names = [
        'John Smith', 'Emma Johnson', 'Michael Brown', 'Olivia Davis', 
        'William Wilson', 'Sophia Martinez', 'James Anderson', 'Isabella Taylor',
        'Robert Thomas', 'Mia Hernandez', 'David Moore', 'Charlotte Martin'
    ];
    
    const comments = [
        'Love this vintage piece! The quality is amazing and it fits perfectly.',
        'Exactly as described. The condition is excellent for a vintage item.',
        'Shipping was fast and the item was well packaged. Very happy with my purchase!',
        'Beautiful piece with so much character. Definitely worth the price.',
        'The photos don\'t do it justice. Even better in person!',
        'Great addition to my vintage collection. Highly recommend this shop.',
        'The sizing was spot on and the item is in great condition.',
        'Unique piece that gets lots of compliments. Very satisfied customer.',
        'Excellent customer service and a wonderful product. Will buy again!',
        'The quality of this vintage item exceeded my expectations.',
        'Arrived quickly and in perfect condition. Love the authentic vintage feel.',
        'Such a special find! The craftsmanship is incredible.'
    ];
    
    let reviewsHTML = `
        <h4>Customer Reviews</h4>
        <div class="reviews-summary mb-4">
            <div class="overall-rating">
                <span class="rating-value">${averageRating.toFixed(1)}</span>
                <div class="stars">
                    ${generateStarRating(averageRating)}
                </div>
                <span class="review-count">Based on ${count} reviews</span>
            </div>
            <div class="rating-bars">
                <div class="rating-bar">
                    <span class="rating-label">5 stars</span>
                    <div class="progress">
                        <div class="progress-bar bg-primary" style="width: ${Math.round(60 + Math.random() * 40)}%"></div>
                    </div>
                </div>
                <div class="rating-bar">
                    <span class="rating-label">4 stars</span>
                    <div class="progress">
                        <div class="progress-bar bg-primary" style="width: ${Math.round(20 + Math.random() * 30)}%"></div>
                    </div>
                </div>
                <div class="rating-bar">
                    <span class="rating-label">3 stars</span>
                    <div class="progress">
                        <div class="progress-bar bg-primary" style="width: ${Math.round(5 + Math.random() * 15)}%"></div>
                    </div>
                </div>
                <div class="rating-bar">
                    <span class="rating-label">2 stars</span>
                    <div class="progress">
                        <div class="progress-bar bg-primary" style="width: ${Math.round(Math.random() * 10)}%"></div>
                    </div>
                </div>
                <div class="rating-bar">
                    <span class="rating-label">1 star</span>
                    <div class="progress">
                        <div class="progress-bar bg-primary" style="width: ${Math.round(Math.random() * 5)}%"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="reviews-list">
    `;
    
    // Generate random reviews
    const actualCount = Math.min(count, 6); // Limit to 6 reviews for display
    for (let i = 0; i < actualCount; i++) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomComment = comments[Math.floor(Math.random() * comments.length)];
        const randomRating = Math.max(3, Math.min(5, Math.round(averageRating + (Math.random() * 2 - 1))));
        const randomDate = new Date();
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 60));
        
        reviewsHTML += `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            ${randomName.charAt(0)}
                        </div>
                        <div class="reviewer-details">
                            <h5 class="reviewer-name">${randomName}</h5>
                            <div class="review-date">${randomDate.toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${generateStarRating(randomRating)}
                    </div>
                </div>
                <div class="review-content">
                    <p>${randomComment}</p>
                </div>
            </div>
        `;
    }
    
    reviewsHTML += `
        </div>
        
        <div class="write-review mt-4">
            <h5>Write a Review</h5>
            <form class="review-form">
                <div class="mb-3">
                    <label for="reviewRating" class="form-label">Your Rating</label>
                    <div class="rating-select" id="reviewRating">
                        <i class="far fa-star" data-rating="1"></i>
                        <i class="far fa-star" data-rating="2"></i>
                        <i class="far fa-star" data-rating="3"></i>
                        <i class="far fa-star" data-rating="4"></i>
                        <i class="far fa-star" data-rating="5"></i>
                    </div>
                </div>
                <div class="mb-3">
                    <label for="reviewTitle" class="form-label">Review Title</label>
                    <input type="text" class="form-control" id="reviewTitle" placeholder="Summarize your experience">
                </div>
                <div class="mb-3">
                    <label for="reviewComment" class="form-label">Your Review</label>
                    <textarea class="form-control" id="reviewComment" rows="4" placeholder="Tell others about your experience with this product"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Submit Review</button>
            </form>
        </div>
    `;
    
    return reviewsHTML;
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Update cart count
function updateCartCount() {
    // Get cart count from localStorage
    let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
    
    // Increment cart count
    cartCount++;
    
    // Save to localStorage
    localStorage.setItem('cartCount', cartCount.toString());
    
    // Update cart count in header
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount.toString();
        cartCountElement.style.display = 'block';
    }
}

// Update favorites count
function updateFavoritesCount() {
    // Get favorites count from localStorage
    let favoritesCount = parseInt(localStorage.getItem('favoritesCount') || '0');
    
    // Increment favorites count
    favoritesCount++;
    
    // Save to localStorage
    localStorage.setItem('favoritesCount', favoritesCount.toString());
    
    // Update favorites count in header
    const favoritesCountElement = document.querySelector('.favorites-count');
    if (favoritesCountElement) {
        favoritesCountElement.textContent = favoritesCount.toString();
        favoritesCountElement.style.display = 'block';
    }
}
