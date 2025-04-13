// API integration for Novari Vintage website

// Function to load products from the products.js file
async function loadProducts() {
  try {
    // In a real implementation, this would be an API call to a backend server
    // For this demo, we're using the local products.js file
    return products;
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

// Function to get a single product by ID
async function getProductById(productId) {
  try {
    const products = await loadProducts();
    return products.find(product => product.id === parseInt(productId));
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

// Function to filter products based on criteria
async function filterProducts(filters = {}) {
  try {
    let filteredProducts = await loadProducts();
    
    // Filter by category
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }
    
    // Filter by subcategory
    if (filters.subcategory) {
      filteredProducts = filteredProducts.filter(product => product.subcategory === filters.subcategory);
    }
    
    // Filter by era
    if (filters.era) {
      filteredProducts = filteredProducts.filter(product => product.era === filters.era);
    }
    
    // Filter by price range
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filteredProducts = filteredProducts.filter(product => {
        const price = product.salePrice || product.price;
        return price >= minPrice;
      });
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filteredProducts = filteredProducts.filter(product => {
        const price = product.salePrice || product.price;
        return price <= maxPrice;
      });
    }
    
    // Filter by size
    if (filters.size) {
      filteredProducts = filteredProducts.filter(product => 
        product.availableSizes.includes(filters.size)
      );
    }
    
    // Filter by color (simplified - in a real app, this would be more sophisticated)
    if (filters.color) {
      filteredProducts = filteredProducts.filter(product => 
        product.colors.some(color => color.name.toLowerCase() === filters.color.toLowerCase())
      );
    }
    
    // Filter by sale items
    if (filters.onSale) {
      filteredProducts = filteredProducts.filter(product => product.salePrice !== null);
    }
    
    // Filter by new arrivals
    if (filters.newArrivals) {
      filteredProducts = filteredProducts.filter(product => product.isNew);
    }
    
    return filteredProducts;
  } catch (error) {
    console.error('Error filtering products:', error);
    return [];
  }
}

// Function to sort products
function sortProducts(products, sortBy = 'featured') {
  const productsCopy = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return productsCopy.sort((a, b) => {
        const priceA = a.salePrice !== null ? a.salePrice : a.price;
        const priceB = b.salePrice !== null ? b.salePrice : b.price;
        return priceA - priceB;
      });
    
    case 'price-high':
      return productsCopy.sort((a, b) => {
        const priceA = a.salePrice !== null ? a.salePrice : a.price;
        const priceB = b.salePrice !== null ? b.salePrice : b.price;
        return priceB - priceA;
      });
    
    case 'newest':
      return productsCopy.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });
    
    case 'name-asc':
      return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
    
    case 'name-desc':
      return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
    
    case 'rating':
      return productsCopy.sort((a, b) => b.rating - a.rating);
    
    case 'featured':
    default:
      return productsCopy.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return 0;
      });
  }
}

// Function to get related products
async function getRelatedProducts(productId, limit = 4) {
  try {
    const products = await loadProducts();
    const currentProduct = products.find(product => product.id === parseInt(productId));
    
    if (!currentProduct) return [];
    
    // Find products in the same category or subcategory
    let relatedProducts = products.filter(product => 
      product.id !== parseInt(productId) && 
      (product.category === currentProduct.category || 
       product.subcategory === currentProduct.subcategory ||
       product.era === currentProduct.era)
    );
    
    // Sort by relevance (same category is more relevant than same era)
    relatedProducts.sort((a, b) => {
      const scoreA = calculateRelevanceScore(a, currentProduct);
      const scoreB = calculateRelevanceScore(b, currentProduct);
      return scoreB - scoreA;
    });
    
    // Return limited number of related products
    return relatedProducts.slice(0, limit);
  } catch (error) {
    console.error('Error getting related products:', error);
    return [];
  }
}

// Helper function to calculate relevance score for related products
function calculateRelevanceScore(product, currentProduct) {
  let score = 0;
  
  if (product.category === currentProduct.category) score += 3;
  if (product.subcategory === currentProduct.subcategory) score += 5;
  if (product.era === currentProduct.era) score += 2;
  
  return score;
}

// Function to get popular products
async function getPopularProducts(limit = 4) {
  try {
    const products = await loadProducts();
    
    // Sort by popularity and rating
    const popularProducts = products
      .filter(product => product.isPopular)
      .sort((a, b) => b.rating - a.rating);
    
    return popularProducts.slice(0, limit);
  } catch (error) {
    console.error('Error getting popular products:', error);
    return [];
  }
}

// Function to get sale products
async function getSaleProducts(limit = 4) {
  try {
    const products = await loadProducts();
    
    // Get products on sale
    const saleProducts = products
      .filter(product => product.salePrice !== null)
      .sort((a, b) => {
        // Calculate discount percentage
        const discountA = (a.price - a.salePrice) / a.price;
        const discountB = (b.price - b.salePrice) / b.price;
        return discountB - discountA; // Sort by highest discount first
      });
    
    return saleProducts.slice(0, limit);
  } catch (error) {
    console.error('Error getting sale products:', error);
    return [];
  }
}

// Function to get new arrivals
async function getNewArrivals(limit = 4) {
  try {
    const products = await loadProducts();
    
    // Get new arrival products
    const newProducts = products
      .filter(product => product.isNew)
      .sort((a, b) => b.rating - a.rating);
    
    return newProducts.slice(0, limit);
  } catch (error) {
    console.error('Error getting new arrivals:', error);
    return [];
  }
}

// Function to search products
async function searchProducts(query) {
  if (!query) return [];
  
  try {
    const products = await loadProducts();
    const searchTerms = query.toLowerCase().split(' ');
    
    return products.filter(product => {
      // Search in product name
      const nameMatch = searchTerms.some(term => 
        product.name.toLowerCase().includes(term)
      );
      
      // Search in product description
      const descriptionMatch = searchTerms.some(term => 
        product.description.toLowerCase().includes(term)
      );
      
      // Search in product category, subcategory, era
      const categoryMatch = searchTerms.some(term => 
        product.category.toLowerCase().includes(term) || 
        product.subcategory.toLowerCase().includes(term) || 
        product.era.toLowerCase().includes(term)
      );
      
      return nameMatch || descriptionMatch || categoryMatch;
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// Function to generate product HTML for shop page
function generateProductCardHTML(product) {
  const price = product.salePrice 
    ? `<span class="sale-price">$${product.salePrice.toFixed(2)}</span>
       <span class="original-price">$${product.price.toFixed(2)}</span>`
    : `$${product.price.toFixed(2)}`;
  
  const badge = product.isNew 
    ? '<span class="product-badge">New</span>' 
    : (product.salePrice ? '<span class="product-badge">Sale</span>' : '');
  
  const stars = generateStarRating(product.rating);
  
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image-container">
        <img src="${product.images[0]}" alt="${product.name}" class="product-image primary-image">
        <img src="${product.images[1] || product.images[0]}" alt="${product.name} - Alternate View" class="product-image secondary-image">
        ${badge}
        <button class="btn-wishlist" aria-label="Add to wishlist">
          <i class="far fa-heart"></i>
        </button>
        <button class="btn-quick-view" aria-label="Quick view">
          <i class="fas fa-eye"></i>
        </button>
      </div>
      <div class="card-body">
        <h3 class="card-title"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="price">
          ${price}
        </div>
        <div class="rating">
          ${stars}
          <span>(${product.reviewCount})</span>
        </div>
        <p class="product-description">${product.description}</p>
        <button class="btn btn-primary btn-add-to-cart">Add to Cart</button>
      </div>
    </div>
  `;
}

// Helper function to generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
  let starsHTML = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // Add half star if needed
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Add empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

// Function to update URL parameters
function updateUrlParams(params) {
  const url = new URL(window.location);
  
  // Clear existing parameters if replacing all
  if (params.replaceAll) {
    for (const key of url.searchParams.keys()) {
      url.searchParams.delete(key);
    }
    delete params.replaceAll;
  }
  
  // Add or update parameters
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  }
  
  // Update URL without reloading the page
  window.history.pushState({}, '', url);
}

// Function to get URL parameters
function getUrlParams() {
  const params = {};
  const url = new URL(window.location);
  
  for (const [key, value] of url.searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadProducts,
    getProductById,
    filterProducts,
    sortProducts,
    getRelatedProducts,
    getPopularProducts,
    getSaleProducts,
    getNewArrivals,
    searchProducts,
    generateProductCardHTML,
    updateUrlParams,
    getUrlParams
  };
}
