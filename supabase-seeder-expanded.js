let createClient;
try {
  ({ createClient } = require('@supabase/supabase-js'));
} catch (error) {
  ({ createClient } = require('./backend/node_modules/@supabase/supabase-js'));
}

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://qbimoqxwrcqamnghiear.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiaW1vcXh3cmNxYW1uZ2hpZWFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4NzQ4ODIsImV4cCI6MjA4NjQ1MDg4Mn0.EV4ZIxOVFZwy4aL1kfUO8imV4S_tZ8Hb5p8SEHtvI1E';

// Expanded raw data with additional shops and products
const rawData = [
  // Original 10 shops (from your prompt)
  {
    "id": 1,
    "name": "The Lazy Griller",
    "category": "Restaurant",
    "address": "Mahapal Road, Lalitpur",
    "coordinates": { "lat": 27.6675, "lng": 85.3210 },
    "products": [
      { "id": 101, "name": "Chicken Burger", "price": 320 },
      { "id": 102, "name": "Pork Chop Platter", "price": 650 },
      { "id": 103, "name": "Grilled Salmon", "price": 890 },
      { "id": 104, "name": "Caesar Salad", "price": 280 },
      { "id": 105, "name": "Iced Latte", "price": 180 },
      { "id": 106, "name": "French Fries", "price": 150 },
      { "id": 107, "name": "Mushroom Soup", "price": 220 },
      { "id": 108, "name": "Brownie with Ice Cream", "price": 250 },
      { "id": 109, "name": "Lemonade", "price": 120 },
      { "id": 110, "name": "Veggie Wrap", "price": 200 }
    ]
  },
  {
    "id": 2,
    "name": "Newari Dhaba",
    "category": "Restaurant",
    "address": "Jawalakhel, Lalitpur",
    "coordinates": { "lat": 27.6950, "lng": 85.3170 },
    "products": [
      { "id": 111, "name": "Buff Choila", "price": 180 },
      { "id": 112, "name": "Buff Mo:Mo", "price": 120 },
      { "id": 113, "name": "Chatamari", "price": 100 },
      { "id": 114, "name": "Bara", "price": 60 },
      { "id": 115, "name": "Yomari", "price": 80 },
      { "id": 116, "name": "Aloo Chop", "price": 50 },
      { "id": 117, "name": "Thwon (Rice Beer)", "price": 150 },
      { "id": 118, "name": "Buff Sekuwa", "price": 200 },
      { "id": 119, "name": "Bhutan", "price": 160 },
      { "id": 120, "name": "Achar (Pickle)", "price": 40 }
    ]
  },
  {
    "id": 3,
    "name": "Delta Tech Store",
    "category": "Electronics",
    "address": "Kumaripati, Lalitpur",
    "coordinates": { "lat": 27.6680, "lng": 85.3200 },
    "products": [
      { "id": 201, "name": "Wireless Mouse", "price": 1200 },
      { "id": 202, "name": "Mechanical Keyboard", "price": 4500 },
      { "id": 203, "name": "27-inch Monitor", "price": 22000 },
      { "id": 204, "name": "USB-C Hub", "price": 1500 },
      { "id": 205, "name": "Bluetooth Speaker", "price": 3500 },
      { "id": 206, "name": "Laptop Stand", "price": 1800 },
      { "id": 207, "name": "HDMI Cable (2m)", "price": 400 },
      { "id": 208, "name": "Power Bank 10000mAh", "price": 2500 },
      { "id": 209, "name": "Webcam 1080p", "price": 3000 },
      { "id": 210, "name": "RGB Mouse Pad", "price": 900 }
    ]
  },
  {
    "id": 4,
    "name": "Smartcare Home Appliances",
    "category": "Electronics",
    "address": "Pulchowk, Lalitpur",
    "coordinates": { "lat": 27.6820, "lng": 85.3180 },
    "products": [
      { "id": 211, "name": "Air Conditioner (1.5 Ton)", "price": 55000 },
      { "id": 212, "name": "Front Load Washing Machine", "price": 45000 },
      { "id": 213, "name": "Refrigerator (300L)", "price": 38000 },
      { "id": 214, "name": "Microwave Oven", "price": 12000 },
      { "id": 215, "name": "Water Purifier", "price": 15000 },
      { "id": 216, "name": "Induction Cooktop", "price": 4000 },
      { "id": 217, "name": "Electric Kettle", "price": 1500 },
      { "id": 218, "name": "Vaccum Cleaner", "price": 8000 },
      { "id": 219, "name": "Hair Dryer", "price": 1200 },
      { "id": 220, "name": "Iron", "price": 1800 }
    ]
  },
  {
    "id": 5,
    "name": "Iron Temple Gym & Shop",
    "category": "Fitness",
    "address": "Satdobato, Lalitpur",
    "coordinates": { "lat": 27.6570, "lng": 85.3440 },
    "products": [
      { "id": 301, "name": "Monthly Membership Pass", "price": 2000 },
      { "id": 302, "name": "Whey Protein (1kg)", "price": 4500 },
      { "id": 303, "name": "Yoga Mat", "price": 1200 },
      { "id": 304, "name": "Resistance Bands Set", "price": 800 },
      { "id": 305, "name": "Dumbbells (5kg pair)", "price": 1500 },
      { "id": 306, "name": "Shaker Bottle", "price": 400 },
      { "id": 307, "name": "Lifting Gloves", "price": 700 },
      { "id": 308, "name": "Gym Bag", "price": 2500 },
      { "id": 309, "name": "Jump Rope", "price": 500 },
      { "id": 310, "name": "Pre-Workout Supplement", "price": 3500 }
    ]
  },
  {
    "id": 6,
    "name": "Zen Yoga Studio",
    "category": "Fitness",
    "address": "Jhamsikhel, Lalitpur",
    "coordinates": { "lat": 27.6710, "lng": 85.3100 },
    "products": [
      { "id": 311, "name": "Yoga Class Drop-in", "price": 500 },
      { "id": 312, "name": "Premium Yoga Mat", "price": 2500 },
      { "id": 313, "name": "Yoga Pants (Unisex)", "price": 1800 },
      { "id": 314, "name": "Meditation Cushion", "price": 900 },
      { "id": 315, "name": "Yoga Blocks (2pc)", "price": 600 },
      { "id": 316, "name": "Yoga Strap", "price": 300 },
      { "id": 317, "name": "Essential Oil Set", "price": 1200 },
      { "id": 318, "name": "Incense Sticks Pack", "price": 150 },
      { "id": 319, "name": "Breathing Exercise Device", "price": 1500 },
      { "id": 320, "name": "Tai Chi Shoes", "price": 1200 }
    ]
  },
  {
    "id": 7,
    "name": "Nepal Pharma Distributors",
    "category": "Health/Medicine",
    "address": "Lagankhel, Lalitpur",
    "coordinates": { "lat": 27.6630, "lng": 85.3220 },
    "products": [
      { "id": 401, "name": "N95 Face Mask (5pcs)", "price": 250 },
      { "id": 402, "name": "Digital Thermometer", "price": 500 },
      { "id": 403, "name": "Hand Sanitizer (500ml)", "price": 300 },
      { "id": 404, "name": "Vitamin C Tablets", "price": 150 },
      { "id": 405, "name": "Pain Relief Spray", "price": 250 },
      { "id": 406, "name": "First Aid Kit Box", "price": 800 },
      { "id": 407, "name": "Blood Pressure Monitor", "price": 2500 },
      { "id": 408, "name": "Bandage Roll", "price": 50 },
      { "id": 409, "name": "Antiseptic Liquid", "price": 120 },
      { "id": 410, "name": "Orthopedic Heating Pad", "price": 1500 }
    ]
  },
  {
    "id": 8,
    "name": "Herbal Life Store",
    "category": "Health/Medicine",
    "address": "Kupondole, Lalitpur",
    "coordinates": { "lat": 27.6880, "lng": 85.3150 },
    "products": [
      { "id": 411, "name": "Ashwagandha Powder", "price": 400 },
      { "id": 412, "name": "Aloe Vera Juice", "price": 350 },
      { "id": 413, "name": "Green Tea (Organic)", "price": 250 },
      { "id": 414, "name": "Honey (Raw)", "price": 500 },
      { "id": 415, "name": "Turmeric Capsules", "price": 600 },
      { "id": 416, "name": "Herbal Toothpaste", "price": 180 },
      { "id": 417, "name": "Neem Soap", "price": 80 },
      { "id": 418, "name": "Massage Oil", "price": 450 },
      { "id": 419, "name": "Chyawanprash", "price": 700 },
      { "id": 420, "name": "Herbal Shampoo", "price": 350 }
    ]
  },
  {
    "id": 9,
    "name": "Mahindra Auto Parts",
    "category": "Automobile",
    "address": "Ekantakuna, Lalitpur",
    "coordinates": { "lat": 27.6590, "lng": 85.3330 },
    "products": [
      { "id": 501, "name": "Engine Oil (5W30)", "price": 1500 },
      { "id": 502, "name": "Brake Pads (Front)", "price": 2500 },
      { "id": 503, "name": "Car Battery (60Ah)", "price": 8500 },
      { "id": 504, "name": "Air Filter", "price": 600 },
      { "id": 505, "name": "Tire (195/55 R16)", "price": 7500 },
      { "id": 506, "name": "Car Shampoo", "price": 450 },
      { "id": 507, "name": "Microfiber Cloth Set", "price": 300 },
      { "id": 508, "name": "Tire Inflator (Portable)", "price": 2000 },
      { "id": 509, "name": "Car Vacuum Cleaner", "price": 2500 },
      { "id": 510, "name": "Headlight Bulb (LED)", "price": 1500 }
    ]
  },
  {
    "id": 10,
    "name": "Hero Bike Zone",
    "category": "Automobile",
    "address": "Kusunti, Lalitpur",
    "coordinates": { "lat": 27.6550, "lng": 85.3280 },
    "products": [
      { "id": 511, "name": "Bike Chain Spray", "price": 350 },
      { "id": 512, "name": "Helmet (ISI Marked)", "price": 2500 },
      { "id": 513, "name": "Bike Cover (Waterproof)", "price": 600 },
      { "id": 514, "name": "Mobile Phone Holder", "price": 500 },
      { "id": 515, "name": "Rear View Mirror", "price": 350 },
      { "id": 516, "name": "Disk Brake Oil", "price": 250 },
      { "id": 517, "name": "Spark Plug", "price": 150 },
      { "id": 518, "name": "Bike Horn", "price": 200 },
      { "id": 519, "name": "Seat Cover", "price": 400 },
      { "id": 520, "name": "Foot Rest (Alloy)", "price": 800 }
    ]
  },

  // Additional shops - NEW DATA
  {
    "id": 11,
    "name": "Green Valley Organic Farm",
    "category": "Grocery",
    "address": "Bhaisepati, Lalitpur",
    "coordinates": { "lat": 27.6650, "lng": 85.3250 },
    "products": [
      { "id": 601, "name": "Organic Tomatoes (1kg)", "price": 120 },
      { "id": 602, "name": "Fresh Spinach (500g)", "price": 80 },
      { "id": 603, "name": "Free-Range Eggs (12pcs)", "price": 250 },
      { "id": 604, "name": "Organic Brown Rice (1kg)", "price": 180 },
      { "id": 605, "name": "Fresh Milk (1L)", "price": 90 },
      { "id": 606, "name": "Organic Honey (500g)", "price": 450 },
      { "id": 607, "name": "Whole Wheat Bread", "price": 60 },
      { "id": 608, "name": "Fresh Carrots (1kg)", "price": 100 },
      { "id": 609, "name": "Organic Apples (1kg)", "price": 200 },
      { "id": 610, "name": "Greek Yogurt (500g)", "price": 150 }
    ]
  },
  {
    "id": 12,
    "name": "Fresh Mart Supermarket",
    "category": "Grocery",
    "address": "Sanepa, Lalitpur",
    "coordinates": { "lat": 27.6800, "lng": 85.3120 },
    "products": [
      { "id": 611, "name": "Basmati Rice (5kg)", "price": 850 },
      { "id": 612, "name": "Sunflower Oil (1L)", "price": 180 },
      { "id": 613, "name": "Wheat Flour (5kg)", "price": 320 },
      { "id": 614, "name": "Lentils (1kg)", "price": 150 },
      { "id": 615, "name": "Sugar (1kg)", "price": 70 },
      { "id": 616, "name": "Salt (1kg)", "price": 25 },
      { "id": 617, "name": "Tea Leaves (250g)", "price": 120 },
      { "id": 618, "name": "Coffee Powder (200g)", "price": 280 },
      { "id": 619, "name": "Spices Set (6 items)", "price": 450 },
      { "id": 620, "name": "Canned Tomatoes (400g)", "price": 90 }
    ]
  },
  {
    "id": 13,
    "name": "Trendy Fashion Boutique",
    "category": "Clothing",
    "address": "Patan Durbar Square, Lalitpur",
    "coordinates": { "lat": 27.6730, "lng": 85.3250 },
    "products": [
      { "id": 701, "name": "Cotton T-Shirt", "price": 800 },
      { "id": 702, "name": "Denim Jeans", "price": 2500 },
      { "id": 703, "name": "Summer Dress", "price": 1800 },
      { "id": 704, "name": "Formal Shirt", "price": 1200 },
      { "id": 705, "name": "Casual Shoes", "price": 2200 },
      { "id": 706, "name": "Cotton Scarf", "price": 450 },
      { "id": 707, "name": "Leather Belt", "price": 650 },
      { "id": 708, "name": "Wool Sweater", "price": 1500 },
      { "id": 709, "name": "Sports Cap", "price": 350 },
      { "id": 710, "name": "Canvas Bag", "price": 600 }
    ]
  },
  {
    "id": 14,
    "name": "Ethnic Wear House",
    "category": "Clothing",
    "address": "Mangal Bazar, Lalitpur",
    "coordinates": { "lat": 27.6700, "lng": 85.3280 },
    "products": [
      { "id": 711, "name": "Kurta Set (Cotton)", "price": 1800 },
      { "id": 712, "name": "Sari (Silk)", "price": 3500 },
      { "id": 713, "name": "Dhoti Set", "price": 1200 },
      { "id": 714, "name": "Traditional Shawl", "price": 900 },
      { "id": 715, "name": "Embroidered Blouse", "price": 1500 },
      { "id": 716, "name": "Cotton Dupatta", "price": 600 },
      { "id": 717, "name": "Ethnic Sandals", "price": 800 },
      { "id": 718, "name": "Jewelry Set", "price": 2200 },
      { "id": 719, "name": "Traditional Bag", "price": 750 },
      { "id": 720, "name": "Hair Accessories Set", "price": 400 }
    ]
  },
  {
    "id": 15,
    "name": "Bookworm's Paradise",
    "category": "Books",
    "address": "Jawlakhel Chowk, Lalitpur",
    "coordinates": { "lat": 27.6930, "lng": 85.3150 },
    "products": [
      { "id": 801, "name": "Fiction Novel (Bestseller)", "price": 450 },
      { "id": 802, "name": "Academic Textbook", "price": 800 },
      { "id": 803, "name": "Children's Story Book", "price": 250 },
      { "id": 804, "name": "Cookbook Collection", "price": 1200 },
      { "id": 805, "name": "Self-Help Guide", "price": 550 },
      { "id": 806, "name": "Comic Book Series", "price": 300 },
      { "id": 807, "name": "Stationery Set", "price": 350 },
      { "id": 808, "name": "Notebook (Premium)", "price": 180 },
      { "id": 809, "name": "Art Supplies Kit", "price": 900 },
      { "id": 810, "name": "Reading Light", "price": 650 }
    ]
  },
  {
    "id": 16,
    "name": "Knowledge Hub Bookstore",
    "category": "Books",
    "address": "Kumaripati Road, Lalitpur",
    "coordinates": { "lat": 27.6690, "lng": 85.3190 },
    "products": [
      { "id": 811, "name": "Educational Encyclopedia", "price": 1500 },
      { "id": 812, "name": "Science Magazine (Monthly)", "price": 200 },
      { "id": 813, "name": "Language Learning Book", "price": 650 },
      { "id": 814, "name": "Business Management Guide", "price": 750 },
      { "id": 815, "name": "Computer Programming Book", "price": 850 },
      { "id": 816, "name": "History Reference", "price": 950 },
      { "id": 817, "name": "Travel Guide Book", "price": 550 },
      { "id": 818, "name": "Health & Wellness Book", "price": 450 },
      { "id": 819, "name": "Religious Text", "price": 350 },
      { "id": 820, "name": "Exam Preparation Book", "price": 600 }
    ]
  },
  {
    "id": 17,
    "name": "Pet Paradise Store",
    "category": "Pet Supplies",
    "address": "Ekantakuna Road, Lalitpur",
    "coordinates": { "lat": 27.6580, "lng": 85.3320 },
    "products": [
      { "id": 901, "name": "Dog Food (Premium)", "price": 1200 },
      { "id": 902, "name": "Cat Food (Adult)", "price": 800 },
      { "id": 903, "name": "Pet Shampoo", "price": 350 },
      { "id": 904, "name": "Dog Leash", "price": 450 },
      { "id": 905, "name": "Cat Litter (5kg)", "price": 280 },
      { "id": 906, "name": "Pet Bowl Set", "price": 250 },
      { "id": 907, "name": "Dog Toy Collection", "price": 300 },
      { "id": 908, "name": "Pet Bed (Medium)", "price": 1200 },
      { "id": 909, "name": "Fish Tank Accessories", "price": 650 },
      { "id": 910, "name": "Pet Treats Pack", "price": 180 }
    ]
  },
  {
    "id": 18,
    "name": "Happy Pets Supply",
    "category": "Pet Supplies",
    "address": "Sanepa Heights, Lalitpur",
    "coordinates": { "lat": 27.6750, "lng": 85.3140 },
    "products": [
      { "id": 911, "name": "Bird Cage (Large)", "price": 2500 },
      { "id": 912, "name": "Rabbit Hutch", "price": 1800 },
      { "id": 913, "name": "Pet Carrier Bag", "price": 950 },
      { "id": 914, "name": "Aquarium Filter", "price": 750 },
      { "id": 915, "name": "Pet Grooming Kit", "price": 550 },
      { "id": 916, "name": "Training Clicker", "price": 150 },
      { "id": 917, "name": "Pet Vitamins", "price": 400 },
      { "id": 918, "name": "Chew Toys Set", "price": 280 },
      { "id": 919, "name": "Pet Clothing", "price": 600 },
      { "id": 920, "name": "Veterinary First Aid Kit", "price": 450 }
    ]
  },
  {
    "id": 19,
    "name": "Green Thumb Nursery",
    "category": "Gardening",
    "address": "Bhaisepati Chowk, Lalitpur",
    "coordinates": { "lat": 27.6620, "lng": 85.3260 },
    "products": [
      { "id": 1001, "name": "Indoor Plant Pot", "price": 350 },
      { "id": 1002, "name": "Organic Fertilizer (1kg)", "price": 180 },
      { "id": 1003, "name": "Garden Tools Set", "price": 850 },
      { "id": 1004, "name": "Flower Seeds Pack", "price": 120 },
      { "id": 1005, "name": "Vegetable Seeds Set", "price": 150 },
      { "id": 1006, "name": "Watering Can (5L)", "price": 280 },
      { "id": 1007, "name": "Plant Growth Sticks", "price": 200 },
      { "id": 1008, "name": "Garden Soil (10kg)", "price": 250 },
      { "id": 1009, "name": "Pesticide Spray", "price": 320 },
      { "id": 1010, "name": "Decorative Pebbles", "price": 180 }
    ]
  },
  {
    "id": 20,
    "name": "Bloom Garden Center",
    "category": "Gardening",
    "address": "Jhamsikhel Road, Lalitpur",
    "coordinates": { "lat": 27.6695, "lng": 85.3080 },
    "products": [
      { "id": 1011, "name": "Rose Plant (Mature)", "price": 450 },
      { "id": 1012, "name": "Orchid Plant", "price": 800 },
      { "id": 1013, "name": "Bonsai Tree", "price": 1200 },
      { "id": 1014, "name": "Garden Bench", "price": 2500 },
      { "id": 1015, "name": "Solar Garden Lights", "price": 650 },
      { "id": 1016, "name": "Hanging Planters", "price": 380 },
      { "id": 1017, "name": "Compost Bin", "price": 950 },
      { "id": 1018, "name": "Garden Hose (20m)", "price": 750 },
      { "id": 1019, "name": "Pruning Shears", "price": 280 },
      { "id": 1020, "name": "Garden Gloves", "price": 150 }
    ]
  }
];

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Transform coordinates to PostGIS POINT format
 * @param {Object} coordinates - Object with lat and lng properties
 * @returns {string} - PostGIS POINT string format: POINT(lng lat)
 */
function transformToPostGISPoint(coordinates) {
    return `POINT(${coordinates.lng} ${coordinates.lat})`;
}

/**
 * Clear existing data from database
 * Deletes products first (due to foreign key constraint), then shops
 */
async function clearExistingData() {
    console.log('Clearing existing data...');
    
    try {
        // Delete products first (foreign key constraint)
        const { error: productsError } = await supabase
            .from('products')
            .delete()
            .neq('id', 0); // Delete all products
        
        if (productsError) {
            console.warn('Warning when deleting products:', productsError.message);
        } else {
            console.log('✓ All products deleted');
        }
        
        // Delete shops
        const { error: shopsError } = await supabase
            .from('shops')
            .delete()
            .neq('id', 0); // Delete all shops
        
        if (shopsError) {
            console.warn('Warning when deleting shops:', shopsError.message);
        } else {
            console.log('✓ All shops deleted');
        }
        
        console.log('✓ Existing data cleared successfully');
    } catch (error) {
        console.error('Error clearing existing data:', error);
        throw error;
    }
}

/**
 * Insert shops and return mapping of old IDs to new IDs
 * @param {Array} shopsData - Array of shop objects
 * @returns {Object} - Mapping of old shop IDs to new Supabase IDs
 */
async function insertShops(shopsData) {
    console.log(`Inserting ${shopsData.length} shops...`);
    
    const idMapping = {};
    
    for (const shop of shopsData) {
        try {
            // Prepare shop data with PostGIS location
            const shopData = {
                name: shop.name,
                category: shop.category,
                address: shop.address,
                latitude: shop.coordinates.lat,
                longitude: shop.coordinates.lng,
                location: transformToPostGISPoint(shop.coordinates)
            };
            
            const { data, error } = await supabase
                .from('shops')
                .insert(shopData)
                .select()
                .single();
            
            if (error) {
                console.error(`Error inserting shop "${shop.name}":`, error);
                throw error;
            }
            
            // Map old ID to new ID
            idMapping[shop.id] = data.id;
            console.log(`✓ Inserted shop: ${shop.name} (old ID: ${shop.id} → new ID: ${data.id})`);
            
        } catch (error) {
            console.error(`Failed to insert shop "${shop.name}":`, error);
            throw error;
        }
    }
    
    console.log(`✓ Successfully inserted ${shopsData.length} shops`);
    return idMapping;
}

/**
 * Insert products using the shop ID mapping
 * @param {Array} shopsData - Array of shop objects with products
 * @param {Object} idMapping - Mapping of old shop IDs to new Supabase IDs
 */
async function insertProducts(shopsData, idMapping) {
    console.log('Inserting products...');
    
    let totalProducts = 0;
    
    for (const shop of shopsData) {
        const newShopId = idMapping[shop.id];
        
        if (!newShopId) {
            console.warn(`Warning: No ID mapping found for shop ID ${shop.id}`);
            continue;
        }
        
        try {
            // Prepare products data for this shop
            const productsData = shop.products.map(product => ({
                name: product.name,
                price: product.price,
                shop_id: newShopId
            }));
            
            const { error } = await supabase
                .from('products')
                .insert(productsData);
            
            if (error) {
                console.error(`Error inserting products for shop "${shop.name}":`, error);
                throw error;
            }
            
            totalProducts += productsData.length;
            console.log(`✓ Inserted ${productsData.length} products for shop: ${shop.name}`);
            
        } catch (error) {
            console.error(`Failed to insert products for shop "${shop.name}":`, error);
            throw error;
        }
    }
    
    console.log(`✓ Successfully inserted ${totalProducts} products total`);
}

/**
 * Main seeding function
 */
async function seedDatabase() {
    console.log('🌱 Starting database seeding...');
    console.log('Supabase URL:', SUPABASE_URL);
    console.log(`📊 Total shops to insert: ${rawData.length}`);
    console.log(`📊 Total products to insert: ${rawData.reduce((sum, shop) => sum + shop.products.length, 0)}`);
    
    try {
        // Step 1: Clear existing data
        await clearExistingData();
        
        // Step 2: Insert shops and get ID mapping
        const idMapping = await insertShops(rawData);
        
        // Step 3: Insert products using the ID mapping
        await insertProducts(rawData, idMapping);
        
        console.log('');
        console.log('🎉 Database seeding completed successfully!');
        console.log(`📈 Summary:`);
        console.log(`   - Total shops inserted: ${rawData.length}`);
        console.log(`   - Total products inserted: ${rawData.reduce((sum, shop) => sum + shop.products.length, 0)}`);
        console.log(`   - Categories covered: ${[...new Set(rawData.map(shop => shop.category))].join(', ')}`);
        
    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
}

/**
 * Verify database connection and run seeder
 */
async function main() {
    try {
        // Test Supabase connection
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase
            .from('shops')
            .select('id')
            .limit(1);
        
        if (error) {
            console.error('❌ Failed to connect to Supabase:', error);
            console.error('Please verify your Supabase URL and anon key are correct.');
            process.exit(1);
        }
        
        console.log('✅ Supabase connection successful');
        
        // Run the seeder
        await seedDatabase();
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    } finally {
        // Exit the script
        process.exit(0);
    }
}

// Run the main function
if (require.main === module) {
    main();
}

module.exports = { seedDatabase, transformToPostGISPoint };
