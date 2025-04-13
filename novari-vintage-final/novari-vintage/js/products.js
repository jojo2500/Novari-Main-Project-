// Product data structure for Novari Vintage website
const products = [
  {
    id: 1,
    name: "1980s Vintage Denim Jacket",
    category: "men",
    subcategory: "jackets",
    era: "1980s",
    price: 59.99,
    salePrice: null,
    rating: 4.5,
    reviewCount: 18,
    sizes: ["XS", "S", "M", "L", "XL"],
    availableSizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Medium Wash", code: "#6c757d" },
      { name: "Dark Wash", code: "#343a40" },
      { name: "Light Wash", code: "#adb5bd" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?denim,jacket,vintage",
      "https://source.unsplash.com/random/800x1000/?denim,jacket,blue",
      "https://source.unsplash.com/random/800x1000/?denim,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?jacket,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?denim,jacket,vintage",
      "https://source.unsplash.com/random/150x200/?denim,jacket,blue",
      "https://source.unsplash.com/random/150x200/?denim,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?jacket,vintage,style"
    ],
    description: "This authentic 1980s denim jacket features classic styling with brass buttons and comfortable fit. The subtle distressing adds character and vintage appeal, while the durable construction ensures it will be a staple in your wardrobe for years to come.",
    features: [
      "Authentic 1980s vintage piece",
      "Medium-weight denim fabric",
      "Classic button front closure",
      "Two chest pockets with button flaps",
      "Two side pockets",
      "Adjustable button cuffs",
      "Subtle distressing for vintage character"
    ],
    condition: "Excellent",
    material: "100% Cotton Denim",
    isNew: true,
    isSale: false,
    isPopular: true
  },
  {
    id: 2,
    name: "1970s Silk Blouse",
    category: "women",
    subcategory: "tops",
    era: "1970s",
    price: 54.99,
    salePrice: 42.99,
    rating: 4.0,
    reviewCount: 12,
    sizes: ["XS", "S", "M", "L", "XL"],
    availableSizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Cream", code: "#f8f9fa" },
      { name: "Blush", code: "#e6bbad" },
      { name: "Sage", code: "#a3b18a" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?silk,blouse,vintage",
      "https://source.unsplash.com/random/800x1000/?silk,blouse,cream",
      "https://source.unsplash.com/random/800x1000/?blouse,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?silk,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?silk,blouse,vintage",
      "https://source.unsplash.com/random/150x200/?silk,blouse,cream",
      "https://source.unsplash.com/random/150x200/?blouse,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?silk,vintage,style"
    ],
    description: "Elegant 1970s silk blouse with a relaxed fit and pointed collar. Features delicate button details and a timeless silhouette that pairs well with modern pieces.",
    features: [
      "Authentic 1970s vintage piece",
      "100% silk fabric",
      "Pointed collar",
      "Button-front closure",
      "Long sleeves with button cuffs",
      "Relaxed fit",
      "Versatile styling options"
    ],
    condition: "Very Good",
    material: "100% Silk",
    isNew: false,
    isSale: true,
    isPopular: true
  },
  {
    id: 3,
    name: "1970s Floral Maxi Dress",
    category: "women",
    subcategory: "dresses",
    era: "1970s",
    price: 99.99,
    salePrice: 79.99,
    rating: 5.0,
    reviewCount: 24,
    sizes: ["XS", "S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L"],
    colors: [
      { name: "Multicolor", code: "linear-gradient(45deg, #e6bbad, #a3b18a, #adb5bd)" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?floral,dress,vintage",
      "https://source.unsplash.com/random/800x1000/?maxi,dress,floral",
      "https://source.unsplash.com/random/800x1000/?dress,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?floral,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?floral,dress,vintage",
      "https://source.unsplash.com/random/150x200/?maxi,dress,floral",
      "https://source.unsplash.com/random/150x200/?dress,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?floral,vintage,style"
    ],
    description: "Stunning 1970s floral maxi dress with flowing silhouette and vibrant pattern. Features a flattering empire waist and delicate tie details at the sleeves.",
    features: [
      "Authentic 1970s vintage piece",
      "Vibrant floral pattern",
      "Empire waist design",
      "Flowing maxi length",
      "Tie details at sleeves",
      "V-neckline",
      "Lightweight fabric perfect for layering"
    ],
    condition: "Excellent",
    material: "Polyester Blend",
    isNew: false,
    isSale: true,
    isPopular: true
  },
  {
    id: 4,
    name: "1990s Wool Blazer",
    category: "men",
    subcategory: "jackets",
    era: "1990s",
    price: 89.99,
    salePrice: null,
    rating: 3.5,
    reviewCount: 9,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy", code: "#212529" },
      { name: "Charcoal", code: "#495057" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?blazer,wool,vintage",
      "https://source.unsplash.com/random/800x1000/?blazer,suit,navy",
      "https://source.unsplash.com/random/800x1000/?blazer,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?wool,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?blazer,wool,vintage",
      "https://source.unsplash.com/random/150x200/?blazer,suit,navy",
      "https://source.unsplash.com/random/150x200/?blazer,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?wool,vintage,style"
    ],
    description: "Classic 1990s wool blazer with structured shoulders and double-breasted design. Features quality tailoring and a timeless silhouette that works for both casual and formal occasions.",
    features: [
      "Authentic 1990s vintage piece",
      "Premium wool blend fabric",
      "Double-breasted design",
      "Structured shoulders",
      "Two front flap pockets",
      "Inner pocket",
      "Full lining"
    ],
    condition: "Very Good",
    material: "Wool Blend",
    isNew: false,
    isSale: false,
    isPopular: false
  },
  {
    id: 5,
    name: "1960s Leather Handbag",
    category: "accessories",
    subcategory: "bags",
    era: "1960s",
    price: 45.99,
    salePrice: null,
    rating: 4.5,
    reviewCount: 15,
    sizes: ["One Size"],
    availableSizes: ["One Size"],
    colors: [
      { name: "Brown", code: "#5e503f" },
      { name: "Black", code: "#212529" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?leather,handbag,vintage",
      "https://source.unsplash.com/random/800x1000/?handbag,purse,brown",
      "https://source.unsplash.com/random/800x1000/?bag,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?leather,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?leather,handbag,vintage",
      "https://source.unsplash.com/random/150x200/?handbag,purse,brown",
      "https://source.unsplash.com/random/150x200/?bag,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?leather,vintage,style"
    ],
    description: "Authentic 1960s leather handbag with structured design and brass hardware. Features a spacious interior with original lining and a comfortable handle.",
    features: [
      "Authentic 1960s vintage piece",
      "Genuine leather construction",
      "Brass hardware details",
      "Structured design",
      "Original interior lining",
      "Comfortable handle",
      "Secure clasp closure"
    ],
    condition: "Good",
    material: "Genuine Leather",
    isNew: false,
    isSale: false,
    isPopular: true
  },
  {
    id: 6,
    name: "1950s Fedora Hat",
    category: "accessories",
    subcategory: "hats",
    era: "1950s",
    price: 34.99,
    salePrice: null,
    rating: 3.5,
    reviewCount: 7,
    sizes: ["S", "M", "L"],
    availableSizes: ["S", "M", "L"],
    colors: [
      { name: "Black", code: "#212529" },
      { name: "Brown", code: "#5e503f" },
      { name: "Gray", code: "#adb5bd" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?fedora,hat,vintage",
      "https://source.unsplash.com/random/800x1000/?hat,fedora,black",
      "https://source.unsplash.com/random/800x1000/?hat,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?fedora,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?fedora,hat,vintage",
      "https://source.unsplash.com/random/150x200/?hat,fedora,black",
      "https://source.unsplash.com/random/150x200/?hat,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?fedora,vintage,style"
    ],
    description: "Classic 1950s fedora hat with ribbon band detail and structured brim. Features quality wool construction and original maker's mark inside.",
    features: [
      "Authentic 1950s vintage piece",
      "Premium wool construction",
      "Ribbon band detail",
      "Structured brim",
      "Original maker's mark",
      "Satin lining",
      "Classic silhouette"
    ],
    condition: "Very Good",
    material: "Wool",
    isNew: true,
    isSale: false,
    isPopular: false
  },
  {
    id: 7,
    name: "1960s Pleated Skirt",
    category: "women",
    subcategory: "bottoms",
    era: "1960s",
    price: 48.99,
    salePrice: 38.99,
    rating: 4.0,
    reviewCount: 11,
    sizes: ["XS", "S", "M", "L", "XL"],
    availableSizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Navy", code: "#212529" },
      { name: "Plaid", code: "repeating-linear-gradient(45deg, #212529, #212529 10px, #495057 10px, #495057 20px)" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?pleated,skirt,vintage",
      "https://source.unsplash.com/random/800x1000/?skirt,pleated,navy",
      "https://source.unsplash.com/random/800x1000/?skirt,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?pleated,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?pleated,skirt,vintage",
      "https://source.unsplash.com/random/150x200/?skirt,pleated,navy",
      "https://source.unsplash.com/random/150x200/?skirt,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?pleated,vintage,style"
    ],
    description: "Elegant 1960s pleated skirt with A-line silhouette and high waist. Features quality wool blend fabric and original side zipper closure.",
    features: [
      "Authentic 1960s vintage piece",
      "A-line silhouette",
      "All-around pleats",
      "High waist design",
      "Side zipper closure",
      "Fully lined",
      "Knee-length"
    ],
    condition: "Excellent",
    material: "Wool Blend",
    isNew: false,
    isSale: true,
    isPopular: false
  },
  {
    id: 8,
    name: "1970s Silk Scarf",
    category: "accessories",
    subcategory: "scarves",
    era: "1970s",
    price: 29.99,
    salePrice: null,
    rating: 4.0,
    reviewCount: 8,
    sizes: ["One Size"],
    availableSizes: ["One Size"],
    colors: [
      { name: "Multicolor", code: "linear-gradient(45deg, #e6bbad, #a3b18a, #adb5bd)" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?silk,scarf,vintage",
      "https://source.unsplash.com/random/800x1000/?scarf,silk,pattern",
      "https://source.unsplash.com/random/800x1000/?scarf,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?silk,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?silk,scarf,vintage",
      "https://source.unsplash.com/random/150x200/?scarf,silk,pattern",
      "https://source.unsplash.com/random/150x200/?scarf,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?silk,vintage,style"
    ],
    description: "Luxurious 1970s silk scarf with vibrant geometric pattern. Features hand-rolled edges and premium silk quality with a soft drape.",
    features: [
      "Authentic 1970s vintage piece",
      "100% silk construction",
      "Vibrant geometric pattern",
      "Hand-rolled edges",
      "Generous square size",
      "Soft, luxurious drape",
      "Versatile styling options"
    ],
    condition: "Excellent",
    material: "100% Silk",
    isNew: false,
    isSale: false,
    isPopular: false
  },
  {
    id: 9,
    name: "1980s Leather Biker Jacket",
    category: "men",
    subcategory: "jackets",
    era: "1980s",
    price: 159.99,
    salePrice: 129.99,
    rating: 5.0,
    reviewCount: 21,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L"],
    colors: [
      { name: "Black", code: "#212529" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?leather,jacket,biker",
      "https://source.unsplash.com/random/800x1000/?biker,jacket,black",
      "https://source.unsplash.com/random/800x1000/?leather,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?biker,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?leather,jacket,biker",
      "https://source.unsplash.com/random/150x200/?biker,jacket,black",
      "https://source.unsplash.com/random/150x200/?leather,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?biker,vintage,style"
    ],
    description: "Authentic 1980s leather biker jacket with asymmetrical zipper and studded details. Features a comfortable fit with quilted lining and multiple pockets.",
    features: [
      "Authentic 1980s vintage piece",
      "Genuine leather construction",
      "Asymmetrical zipper closure",
      "Studded details",
      "Multiple pockets",
      "Quilted lining",
      "Adjustable waist belt"
    ],
    condition: "Excellent",
    material: "Genuine Leather",
    isNew: false,
    isSale: true,
    isPopular: true
  },
  {
    id: 10,
    name: "1970s Corduroy Jacket",
    category: "men",
    subcategory: "jackets",
    era: "1970s",
    price: 69.99,
    salePrice: null,
    rating: 4.0,
    reviewCount: 14,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Brown", code: "#5e503f" },
      { name: "Tan", code: "#d6ccc2" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?corduroy,jacket,vintage",
      "https://source.unsplash.com/random/800x1000/?jacket,corduroy,brown",
      "https://source.unsplash.com/random/800x1000/?corduroy,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?jacket,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?corduroy,jacket,vintage",
      "https://source.unsplash.com/random/150x200/?jacket,corduroy,brown",
      "https://source.unsplash.com/random/150x200/?corduroy,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?jacket,vintage,style"
    ],
    description: "Classic 1970s corduroy jacket with button front and patch pockets. Features a comfortable fit with warm lining perfect for layering.",
    features: [
      "Authentic 1970s vintage piece",
      "Fine wale corduroy fabric",
      "Button front closure",
      "Patch pockets",
      "Warm lining",
      "Pointed collar",
      "Classic 70s silhouette"
    ],
    condition: "Very Good",
    material: "Cotton Corduroy",
    isNew: false,
    isSale: false,
    isPopular: false
  },
  {
    id: 11,
    name: "1990s Denim Shirt",
    category: "men",
    subcategory: "tops",
    era: "1990s",
    price: 49.99,
    salePrice: null,
    rating: 4.5,
    reviewCount: 16,
    sizes: ["S", "M", "L", "XL"],
    availableSizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Medium Wash", code: "#6c757d" },
      { name: "Light Wash", code: "#adb5bd" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?denim,shirt,vintage",
      "https://source.unsplash.com/random/800x1000/?shirt,denim,blue",
      "https://source.unsplash.com/random/800x1000/?denim,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?shirt,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?denim,shirt,vintage",
      "https://source.unsplash.com/random/150x200/?shirt,denim,blue",
      "https://source.unsplash.com/random/150x200/?denim,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?shirt,vintage,style"
    ],
    description: "Classic 1990s denim shirt with pearl snap buttons and western styling. Features a comfortable fit with subtle fading for vintage character.",
    features: [
      "Authentic 1990s vintage piece",
      "Pearl snap button closure",
      "Western-style yoke",
      "Two chest pockets with snap flaps",
      "Subtle fading for vintage character",
      "Adjustable snap cuffs",
      "Versatile styling options"
    ],
    condition: "Excellent",
    material: "100% Cotton Denim",
    isNew: true,
    isSale: false,
    isPopular: true
  },
  {
    id: 12,
    name: "1960s Mod Mini Dress",
    category: "women",
    subcategory: "dresses",
    era: "1960s",
    price: 79.99,
    salePrice: null,
    rating: 4.5,
    reviewCount: 19,
    sizes: ["XS", "S", "M", "L"],
    availableSizes: ["XS", "S", "M"],
    colors: [
      { name: "Orange", code: "#fd7e14" },
      { name: "Blue", code: "#0d6efd" }
    ],
    images: [
      "https://source.unsplash.com/random/800x1000/?mod,dress,vintage",
      "https://source.unsplash.com/random/800x1000/?dress,mini,orange",
      "https://source.unsplash.com/random/800x1000/?mod,vintage,fashion",
      "https://source.unsplash.com/random/800x1000/?dress,vintage,style"
    ],
    thumbnails: [
      "https://source.unsplash.com/random/150x200/?mod,dress,vintage",
      "https://source.unsplash.com/random/150x200/?dress,mini,orange",
      "https://source.unsplash.com/random/150x200/?mod,vintage,fashion",
      "https://source.unsplash.com/random/150x200/?dress,vintage,style"
    ],
    description: "Iconic 1960s mod mini dress with geometric pattern and A-line silhouette. Features a high neckline and short sleeves for a classic mod look.",
    features: [
      "Authentic 1960s vintage piece",
      "Bold geometric pattern",
      "A-line silhouette",
      "Mini length",
      "High neckline",
      "Short sleeves",
      "Back zipper closure"
    ],
    condition: "Excellent",
    material: "Polyester Blend",
    isNew: false,
    isSale: false,
    isPopular: true
  }
];

// Export the products array
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { products };
}
