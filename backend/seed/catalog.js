// Demo catalog for `npm run seed`. Images are verified Unsplash photos.
const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

// prettier-ignore
export const shops = [
  { key: 'northwind', name: 'Northwind Electronics', email: 'northwind@shops.example.com', phoneNumber: '+1 415 555 0142', zipCode: '94105',
    address: '120 Market Street, San Francisco, CA', avatar: img('1593642632823-8f785ba67e45'),
    description: 'Laptops, phones, audio and gaming gear — tested, warrantied and shipped fast.' },
  { key: 'atelier', name: 'Atelier Thread', email: 'atelier@shops.example.com', phoneNumber: '+1 212 555 0187', zipCode: '10013',
    address: '44 Mercer Street, New York, NY', avatar: img('1551028719-00167b16eac5'),
    description: 'Everyday wardrobe staples, sneakers and accessories made to last.' },
  { key: 'glow', name: 'Glow & Grain', email: 'glow@shops.example.com', phoneNumber: '+1 310 555 0119', zipCode: '90291',
    address: '9 Abbot Kinney Blvd, Los Angeles, CA', avatar: img('1608571423902-eed4a5ad8108'),
    description: 'Clean skincare, beauty essentials and thoughtful gifts for every occasion.' },
  { key: 'paws', name: 'Happy Paws Co.', email: 'paws@shops.example.com', phoneNumber: '+1 303 555 0163', zipCode: '80302',
    address: '310 Pearl Street, Boulder, CO', avatar: img('1583337130417-3346a1be7dee'),
    description: 'Treats, toys and comfy gear for dogs and cats, plus home finds we love.' },
];

// [shop, category, name, price, salePrice, stock, rating, sold, tags, imageIds, description]
// prettier-ignore
const rows = [
  // Computers and Laptops
  ['northwind', 'Computers and Laptops', 'Aero 14 Ultrabook — 16GB RAM, 512GB SSD', 1099, 949, 18, 4.7, 132, 'laptop, ultrabook, work, student', ['1593642632823-8f785ba67e45', '1588872657578-7efd1f1555ed'],
    'A featherweight 14-inch laptop with an all-day battery, a bright 2.8K display and a backlit keyboard. Ideal for students and remote work.\n\n• 14" 2.8K 90Hz display\n• 16GB RAM / 512GB NVMe SSD\n• Up to 15 hours battery\n• Wi-Fi 6E, 2× USB-C, HDMI'],
  ['northwind', 'Computers and Laptops', 'Studio Pro 16 Laptop — 32GB RAM, 1TB SSD', 2399, 2199, 7, 4.9, 64, 'laptop, pro, creator, editing', ['1517336714731-489689fd1ca8', '1611186871348-b1ce696e52c9'],
    'Desktop-class power in a 16-inch aluminium body. Built for video editing, 3D and development with a colour-accurate display.\n\n• 16" mini-LED display\n• 32GB RAM / 1TB SSD\n• Six-speaker sound system\n• 140W fast charging'],
  ['northwind', 'Computers and Laptops', 'Everyday 13 Laptop — 8GB RAM, 256GB SSD', 649, null, 25, 4.4, 210, 'laptop, budget, everyday', ['1541807084-5c52b6b3adef', '1496181133206-80ce9b88a853'],
    'A dependable everyday laptop for browsing, streaming and homework, with a fanless silent design.\n\n• 13.3" Full HD display\n• 8GB RAM / 256GB SSD\n• Fanless and silent\n• 1.2kg'],
  ['northwind', 'Computers and Laptops', 'Slim Wireless Keyboard', 79, 59, 60, 4.5, 340, 'keyboard, wireless, bluetooth, desk', ['1587829741301-dc798b83add3'],
    'Low-profile scissor keys, multi-device Bluetooth switching and a rechargeable battery that lasts a month.'],
  ['northwind', 'Computers and Laptops', 'Ergo Wireless Mouse', 39, null, 85, 4.3, 512, 'mouse, wireless, ergonomic', ['1527864550417-7fd91fc51a46'],
    'A sculpted, quiet-click mouse with an adjustable 4000 DPI sensor and 18-month battery life.'],
  // Mobile and Tablets
  ['northwind', 'Mobile and Tablets', 'Nova X Smartphone — 256GB', 899, 829, 22, 4.8, 188, 'phone, smartphone, 5g, camera', ['1511707171634-5f897ff02aa9', '1592899677977-9c10ca588bbd'],
    'A 6.1-inch OLED phone with a triple camera system, all-day battery and 5G.\n\n• 6.1" OLED, 120Hz\n• 48MP main + ultra-wide + telephoto\n• 256GB storage\n• Fast wireless charging'],
  ['northwind', 'Mobile and Tablets', 'Orbit Ultra Phone — 512GB', 1199, null, 9, 4.6, 74, 'phone, android, flagship', ['1610945415295-d9bbf067e59c'],
    'A flagship Android phone with a 200MP camera, built-in stylus support and a huge 5000mAh battery.'],
  ['northwind', 'Mobile and Tablets', 'Canvas 11 Tablet with Stylus', 599, 529, 14, 4.7, 96, 'tablet, stylus, drawing', ['1544244015-0df4b3ffc6b0'],
    'An 11-inch tablet for sketching, notes and streaming. Includes a pressure-sensitive stylus with magnetic charging.'],
  // Music and Gaming
  ['northwind', 'Music and Gaming', 'Pulse ANC Wireless Headphones', 249, 199, 40, 4.8, 421, 'headphones, wireless, noise cancelling', ['1505740420928-5e560c06d30e'],
    'Adaptive noise cancelling, 40-hour battery and plush memory-foam cushions. Folds flat for travel.'],
  ['northwind', 'Music and Gaming', 'Aura Max Over-Ear Headphones', 549, 479, 12, 4.7, 88, 'headphones, premium, spatial audio', ['1609081219090-a6d81d3085bf'],
    'Premium over-ear headphones with spatial audio, a knit canopy and an aluminium frame.'],
  ['northwind', 'Music and Gaming', 'Blush On-Ear Wireless Headphones', 179, null, 30, 4.4, 150, 'headphones, wireless, on-ear', ['1545127398-14699f92334b'],
    'Lightweight on-ear headphones in a soft rose finish with 30 hours of playback.'],
  ['northwind', 'Music and Gaming', 'Studio Wired Headphones', 99, null, 45, 4.5, 230, 'headphones, wired, studio', ['1583394838336-acd977736f90'],
    'Neutral, detailed sound for mixing and long listening sessions. Detachable 3m cable.'],
  ['northwind', 'Music and Gaming', 'Rugged Portable Bluetooth Speaker', 129, 99, 50, 4.6, 305, 'speaker, bluetooth, waterproof', ['1608043152269-423dbba4e7e1'],
    'Waterproof (IP67) speaker with punchy bass and 20 hours of playtime. Pair two for stereo.'],
  ['northwind', 'Music and Gaming', 'Next-Gen Game Console — 1TB', 499, null, 6, 4.9, 142, 'console, gaming, 4k', ['1606813907291-d86efa9b94db'],
    'Ultra-fast loading, 4K/120fps gaming and a 1TB SSD. Includes one wireless controller.'],
  ['northwind', 'Music and Gaming', 'Neon Wireless Game Controller', 69, 54, 70, 4.5, 260, 'controller, gaming, wireless', ['1612287230202-1ff1d85d1bdf'],
    'Hall-effect sticks, remappable back paddles and a 30-hour battery. Works with PC and console.'],
  // Accessories
  ['northwind', 'Accessories', 'Fit Pro Smartwatch', 299, 249, 28, 4.6, 198, 'smartwatch, fitness, gps', ['1546868871-7041f2a55e12', '1617043786394-f977fa12eddf'],
    'Heart-rate, sleep and SpO2 tracking, built-in GPS and a 7-day battery in a slim aluminium case.'],
  ['northwind', 'Accessories', 'Retro Instant Camera', 119, null, 20, 4.4, 77, 'camera, instant, gift', ['1526170375885-4d8ecf77b99f'],
    'Point, shoot and print. A fun instant camera with a built-in flash and selfie mirror.'],
  ['atelier', 'Accessories', 'Minimal White Analog Watch', 129, 99, 35, 4.5, 164, 'watch, minimal, analog', ['1523275335684-37898b6baf30'],
    'A clean 38mm watch with a silicone strap and Japanese quartz movement. Water resistant to 50m.'],
  ['atelier', 'Accessories', 'Heritage Automatic Watch', 389, null, 8, 4.8, 41, 'watch, automatic, leather', ['1524805444758-089113d48a6d'],
    'An open-heart automatic movement, sapphire crystal and a hand-stitched leather strap.'],
  ['atelier', 'Accessories', 'Classic Polarized Sunglasses', 89, 69, 55, 4.6, 287, 'sunglasses, polarized, summer', ['1572635196237-14b3f281503f'],
    'Timeless acetate frames with polarized, UV400 lenses. Includes a hard case.'],
  ['atelier', 'Accessories', 'Commuter Everyday Backpack', 95, null, 40, 4.7, 219, 'backpack, travel, laptop bag', ['1553062407-98eeb64c6a62'],
    'Water-resistant canvas, a padded 16" laptop sleeve and a hidden passport pocket.'],
  // Cloths
  ['atelier', 'Cloths', 'Essential Organic Cotton Tee', 29, 24, 120, 4.5, 610, 'tshirt, cotton, basics', ['1521572163474-6864f9cf17ab'],
    'A heavyweight, pre-shrunk organic cotton t-shirt with a relaxed fit. Available in white.'],
  ['atelier', 'Cloths', 'Lucky Cat Graphic Tee', 34, null, 80, 4.4, 205, 'tshirt, graphic, unisex', ['1576566588028-4147f3842f27'],
    'Soft ringspun cotton with a screen-printed lucky cat graphic. Unisex fit.'],
  ['atelier', 'Cloths', 'Biker Leather Jacket', 329, 279, 10, 4.8, 58, 'jacket, leather, outerwear', ['1551028719-00167b16eac5'],
    'Full-grain lambskin leather with a quilted lining and asymmetric zip. Gets better with age.'],
  ['atelier', 'Cloths', 'Cloud Fleece Hoodie', 69, null, 65, 4.6, 330, 'hoodie, fleece, loungewear', ['1556821840-3a63f95609a7'],
    'Brushed-back fleece, a double-lined hood and a roomy kangaroo pocket.'],
  ['atelier', 'Cloths', 'Straight-Fit Selvedge Jeans', 119, 98, 45, 4.5, 176, 'jeans, denim, selvedge', ['1542272604-787c3835535d'],
    '13oz Japanese selvedge denim with a straight leg and a mid rise.'],
  ['atelier', 'Cloths', 'Washed Chambray Shirt', 59, null, 50, 4.3, 97, 'shirt, chambray, casual', ['1558171813-4c088753af8f'],
    'A lightweight chambray button-down, garment washed for a soft lived-in feel.'],
  // Shoes
  ['atelier', 'Shoes', 'Knit Running Shoes — Crimson', 129, 104, 30, 4.7, 389, 'running, sneakers, shoes', ['1542291026-7eec264c27ff'],
    'A breathable knit upper, responsive foam and a flexible outsole for everyday miles.'],
  ['atelier', 'Shoes', 'Street Runner Sneakers — Grey', 99, null, 42, 4.5, 244, 'sneakers, lifestyle, shoes', ['1460353581641-37baddab0fa2'],
    'A cushioned lifestyle sneaker with a mesh upper and a grippy rubber sole.'],
  ['atelier', 'Shoes', 'Tempo Trainers — Volt', 109, 89, 26, 4.4, 133, 'training, gym, shoes', ['1606107557195-0e29a4b5b4aa'],
    'Lightweight training shoes with a stable base for HIIT, lifting and short runs.'],
  ['atelier', 'Shoes', 'Pastel Platform Sneakers', 119, null, 18, 4.6, 92, 'sneakers, platform, pastel', ['1595950653106-6c9ebd614d3a'],
    'Layered leather panels in soft pastels on a chunky platform sole.'],
  ['atelier', 'Shoes', 'Air Cushion Classics', 139, 119, 20, 4.7, 156, 'sneakers, retro, classic', ['1600185365483-26d7a4cc7519'],
    'A retro silhouette with visible air cushioning and a suede-and-mesh upper.'],
  // Cosmetics and Body Care
  ['glow', 'Cosmetics and Body Care', 'Vitamin C Brightening Serum', 38, 32, 90, 4.7, 452, 'serum, skincare, vitamin c', ['1608571423902-eed4a5ad8108'],
    '15% vitamin C with ferulic acid and vitamin E to brighten and even skin tone. 30ml.'],
  ['glow', 'Cosmetics and Body Care', 'Everyday Makeup Essentials Kit', 64, null, 35, 4.5, 168, 'makeup, palette, kit', ['1522335789203-aabd1fc54bc9'],
    'An eyeshadow palette, pressed powder, blush and two brushes — everything for a natural look.'],
  ['glow', 'Cosmetics and Body Care', 'Gentle Foaming Cleanser', 22, null, 110, 4.6, 380, 'cleanser, skincare, sensitive', ['1620916566398-39f1143ab7be'],
    'A pH-balanced, fragrance-free cleanser that removes makeup without stripping skin. 150ml.'],
  ['glow', 'Cosmetics and Body Care', 'Glow Duo — Serum & SPF Moisturizer', 54, 45, 40, 4.4, 121, 'skincare, spf, moisturizer, set', ['1615397349754-cfa2066a298e'],
    'A hydrating serum and a lightweight SPF 30 moisturizer for a dewy morning routine.'],
  // Gifts
  ['glow', 'Gifts', 'Amber & Cedar Soy Candle', 32, null, 75, 4.8, 298, 'candle, home, gift', ['1602874801007-bd458bb1b8b6', '1603006905003-be475563bc59'],
    'Hand-poured soy wax with a cotton wick and 50 hours of warm amber and cedarwood.'],
  ['glow', 'Gifts', 'Surprise Gift Box — Self-Care Edition', 75, 65, 30, 4.7, 143, 'gift box, self care, present', ['1549465220-1a8b9238cd48', '1512909006721-3d6018887383'],
    'A curated box of four self-care favourites, beautifully wrapped with a handwritten note.'],
  ['glow', 'Gifts', 'Holiday Gift Wrap Bundle', 28, null, 60, 4.3, 86, 'gift wrap, holiday, boxes', ['1513885535751-8b9238bd345a'],
    'Three premium wrapped boxes in festive paper with ribbon — ready to fill and give.'],
  ['glow', 'Gifts', 'Red Velvet Eau de Parfum', 89, 74, 25, 4.6, 112, 'perfume, fragrance, gift', ['1608528577891-eb055944f2e7'],
    'A warm floral fragrance with notes of rose, blackcurrant and vanilla. 100ml.'],
  // Pet Care
  ['paws', 'Pet Care', 'Cozy Dog Hoodie', 26, null, 70, 4.7, 260, 'dog, hoodie, apparel', ['1583337130417-3346a1be7dee'],
    'A soft fleece hoodie for small and medium dogs, with a leash opening. Machine washable.'],
  ['paws', 'Pet Care', 'Classic Dog Tee', 18, null, 80, 4.4, 132, 'dog, t-shirt, apparel', ['1583511655857-d19b40a7a54e'],
    'A breathable cotton tee for pups who like to look sharp. Sizes XS–L.'],
  ['paws', 'Pet Care', 'Non-Slip Pet Food Bowl', 19, 15, 120, 4.6, 410, 'bowl, dog, cat, feeding', ['1589924691995-400dc9ecc119'],
    'A dishwasher-safe stainless bowl with a silicone non-slip base. 750ml.'],
  ['paws', 'Pet Care', 'Peanut Butter Dog Biscuits', 14, null, 150, 4.8, 720, 'treats, dog, biscuits', ['1568640347023-a616a30bc3bd'],
    'Oven-baked, grain-free biscuits made with real peanut butter. 500g resealable bag.'],
  ['paws', 'Pet Care', 'Tough Rubber Chew Bone', 16, null, 95, 4.5, 355, 'dog toy, chew, rubber', ['1535294435445-d7249524ef2e'],
    'A near-indestructible natural rubber chew toy for heavy chewers. Floats in water.'],
  ['paws', 'Pet Care', 'Sisal Cat Scratching Post', 35, 29, 40, 4.6, 188, 'cat, scratching post, furniture', ['1545249390-6bdfa286032f'],
    'A sturdy 60cm sisal post with a weighted base to save your sofa.'],
  // Others
  ['paws', 'Others', 'Stoneware Coffee Mug', 18, null, 100, 4.5, 240, 'mug, kitchen, coffee', ['1514228742587-6b1558fcca3d'],
    'A 350ml matte stoneware mug that keeps coffee warm longer. Microwave and dishwasher safe.'],
  ['paws', 'Others', 'Mid-Century Accent Chair', 149, 129, 12, 4.4, 63, 'chair, furniture, home', ['1517705008128-361805f42e86'],
    'A moulded seat on solid beech legs. Comfortable, stackable and easy to clean.'],
  ['paws', 'Others', 'Vintage Woven Area Rug — 5×8 ft', 189, null, 9, 4.3, 37, 'rug, home, decor', ['1600166898405-da9535204843'],
    'A softly faded traditional pattern on a low-pile, easy-care weave.'],
];

export const products = rows.map(([shop, category, name, price, discountedPrice, countInStock, ratings, totalSell, tags, images, description]) => ({
  shop, category, name, price, discountedPrice: discountedPrice ?? undefined, countInStock, ratings, totalSell, tags, description, images: images.map(img),
}));

const day = 24 * 60 * 60 * 1000;

// [shop, category, name, price, salePrice, stock, tags, imageId, startsInDays, endsInDays, description]
// prettier-ignore
const eventRows = [
  ['northwind', 'Music and Gaming', 'Winter Audio Sale — Pulse ANC Headphones', 249, 179, 25, 'sale, headphones', '1505740420928-5e560c06d30e', -1, 14,
    'Our best-selling noise cancelling headphones at their lowest price of the season.'],
  ['atelier', 'Shoes', 'Sneaker Week — Knit Runners', 129, 89, 20, 'sale, sneakers', '1542291026-7eec264c27ff', -2, 7,
    'Lightweight runners for less, this week only while stock lasts.'],
];

export const events = eventRows.map(([shop, category, name, price, discountedPrice, countInStock, tags, image, start, end, description]) => ({
  shop, category, name, price, discountedPrice, countInStock, tags, description, images: [img(image)],
  startDate: new Date(Date.now() + start * day),
  endDate: new Date(Date.now() + end * day),
}));
