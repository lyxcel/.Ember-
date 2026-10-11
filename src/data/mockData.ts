import { FoodItem, Restaurant, Order, CustomerInboxMessage, SeasonalFeature, AccountBalances } from '../types';

// High-definition curated photography for real East African dishes (2 distinct images per dish)
export const REAL_FOOD_IMAGES: Record<string, [string, string]> = {
  ugali_samaki: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', // Crispy whole fish & savory sides
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', // Steamed maize fufu & fish stew
  ],
  nyama_choma: [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', // Charcoal flame grilled ribs & beef
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80', // Sliced roast meat on wooden board
  ],
  mishkaki: [
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80', // Spiced skewers on grill
    'https://images.unsplash.com/photo-1508615070457-7baeba4003ab?auto=format&fit=crop&w=800&q=80', // Charred beef kebabs
  ],
  pilau: [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', // Fragrant spiced meat rice
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', // Savory spiced rice bowl with garnish
  ],
  biryani: [
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80', // Royal saffron biryani platter
    'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80', // Spicy chicken biryani rice
  ],
  chapati_beans: [
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', // Layered golden flatbread
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', // Spiced bean curry & warm bread
  ],
  chips_mayai: [
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80', // Golden potato frittata
    'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?auto=format&fit=crop&w=800&q=80', // French fry omelette with chili sauce
  ],
  mandazi_chai: [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', // Fluffy morning donuts
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80', // Spiced ginger milk tea
  ],
  supu_samaki: [
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', // Rich coastal fish broth
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80', // Seafood soup bowl with fresh herbs
  ],
  urojo_mix: [
    'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80', // Tangy coastal soup with crunchy toppings
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', // Street food soup bowl
  ],
  healthy_salad: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', // Office avocado green salad
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', // Fresh crisp bowl with citrus dressing
  ],
  grill_chicken: [
    'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80', // Peri peri grilled kuku
    'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=80', // Crispy roast chicken with roast potatoes
  ],
};

// East African geographic master hierarchy
export const COUNTRIES = ['Tanzania', 'Kenya', 'Uganda', 'Rwanda'] as const;

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  Tanzania: ['Dar es Salaam', 'Arusha', 'Dodoma', 'Mwanza', 'Zanzibar Stone Town'],
  Kenya: ['Nairobi', 'Mombasa', 'Kisumu'],
  Uganda: ['Kampala', 'Entebbe'],
  Rwanda: ['Kigali'],
};

export const WARDS_BY_CITY: Record<string, string[]> = {
  'Dar es Salaam': ['Posta / CBD', 'Kariakoo', 'Upanga', 'Sinza', 'Masaki', 'Mikocheni', 'Kijitonyama', 'Kinondoni', 'Ilala'],
  Arusha: ['Clock Tower / CBD', 'Sekei', 'Njiro', 'Kaloleni'],
  Dodoma: ['Area C', 'Area D', 'Kikuyu', 'Makole / CBD'],
  Mwanza: ['Nyamagana / CBD', 'Capri Point', 'Isamilo'],
  'Zanzibar Stone Town': ['Shangani / Forodhani', 'Malindi', 'Mkunazini'],
  Nairobi: ['CBD', 'Westlands', 'Upper Hill', 'Kilimani', 'Parklands'],
  Mombasa: ['Old Town / CBD', 'Nyali', 'Kizingo'],
  Kisumu: ['Milimani / CBD', 'Tom Mboya'],
  Kampala: ['Nakasero / CBD', 'Kololo', 'Bugolobi', 'Kamwokya'],
  Entebbe: ['Central / CBD', 'Kitoro'],
  Kigali: ['Nyarugenge / CBD', 'Kacyiru', 'Kimihurura', 'Gacuriro'],
};

// Seed 1 primary flagship Chef restaurant that is connected directly to the demo Chef credentials
export const FLAGSHIP_CHEF_RESTAURANT: Restaurant = {
  id: 'rest-flagship-ember',
  name: '.EMBER Swahili Grill & Executive Office Lunch',
  tagline: 'Fresh Tilapia Ugali & Nyama Choma delivered hot to office desks in Posta & Upanga',
  chefName: 'Chef Rashid Mkali',
  country: 'Tanzania',
  city: 'Dar es Salaam',
  ward: 'Posta / CBD',
  address: 'Samora Avenue & Ohio Street Junction, City Center',
  phone: '+255 754 889 900',
  email: 'chef@ember.co',
  rating: 4.9,
  reviewCount: 384,
  deliveryTime: '15-25 min',
  minOrder: 5000,
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  cuisine: 'Swahili, Grilled Tilapia & Nyama Choma',
  isOpenToday: true,
  openingHours: '06:30',
  closingHours: '21:30',
  subscriptionEnabled: true,
  subscriptionPlan: {
    name: 'Office Lunch VIP Pass',
    price: 45000,
    period: 'Monthly Office Pass',
    perks: [
      '15% Off all Executive Lunch Orders',
      'Free Daily Cardamom Spiced Juice or Water',
      'Priority Reception & Floor Delivery (Guaranteed < 20 mins)',
      'Zero Delivery Surcharge on Rain or Peak Lunch Rush',
    ],
  },
  paymentChannels: {
    cashActive: true,
    selcomActive: true,
    lipaNambaActive: true,
    lipaNambaNumber: '6892341',
    lipaNambaName: 'EMBER RESTAURANT POSTA',
    lipaNambaQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TILL:6892341:EMBER_RESTAURANT_POSTA',
    selcomAgentNumber: 'SEL-882194',
    selcomMerchantName: 'EMBER CATERING LTD',
    selcomProviders: {
      airtel: true,
      vodacom: true,
      halotel: true,
      mixByYas: true,
    },
  },
};

// Flagship dishes for the Chef's restaurant
export const FLAGSHIP_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-ugali-samaki-1',
    restaurantId: 'rest-flagship-ember',
    name: 'Ugali Samaki wa Kupaka & Kachumbari',
    description: 'Fresh Lake Victoria Tilapia fried to golden crispness, served with steaming white ugali, coconut mchuzi, and spicy lime kachumbari.',
    price: 12000,
    currency: 'TZS',
    images: REAL_FOOD_IMAGES.ugali_samaki,
    platesAvailable: 18,
    initialPlates: 30,
    mealPeriod: 'lunch',
    mealHours: { start: '11:00', end: '16:00' },
    autoHideOnClose: false,
    rating: 4.95,
    reviewCount: 198,
    isPopular: true,
    category: 'Fish & Seafood',
  },
  {
    id: 'food-nyama-choma-1',
    restaurantId: 'rest-flagship-ember',
    name: 'Nyama Choma Mbuzi (Half Kilo) & Roast Ndizi',
    description: 'Tender local goat meat charcoal-roasted with rosemary and sea salt, served with grilled sweet plantains, pili pili mbuzi, and lime kachumbari.',
    price: 16000,
    currency: 'TZS',
    images: REAL_FOOD_IMAGES.nyama_choma,
    platesAvailable: 14,
    initialPlates: 25,
    mealPeriod: 'lunch',
    mealHours: { start: '11:30', end: '21:00' },
    autoHideOnClose: false,
    rating: 4.9,
    reviewCount: 220,
    isPopular: true,
    category: 'Grill & Nyama Choma',
  },
  {
    id: 'food-pilau-nyama-1',
    restaurantId: 'rest-flagship-ember',
    name: 'Pilau Ya Nyama ya Ng\'ombe & Ndizi Tamu',
    description: 'Cardamom, cumin, and cinnamon spiced aromatic rice cooked in beef broth with tender meat cuts and caramelized red onions.',
    price: 10000,
    currency: 'TZS',
    images: REAL_FOOD_IMAGES.pilau,
    platesAvailable: 22,
    initialPlates: 40,
    mealPeriod: 'lunch',
    mealHours: { start: '11:00', end: '16:30' },
    autoHideOnClose: false,
    rating: 4.85,
    reviewCount: 165,
    isPopular: true,
    category: 'Swahili & Coastal',
  },
  {
    id: 'food-mishkaki-skewers-1',
    restaurantId: 'rest-flagship-ember',
    name: 'Executive Beef Mishkaki Skewers (5 pcs) & Fries',
    description: 'Marinated beef fillet cubes glazed in tamarind, garlic, ginger, and papaya tenderizer with crispy french fries and chili garlic dip.',
    price: 9000,
    currency: 'TZS',
    images: REAL_FOOD_IMAGES.mishkaki,
    platesAvailable: 28,
    initialPlates: 45,
    mealPeriod: 'dinner',
    mealHours: { start: '15:30', end: '21:30' },
    autoHideOnClose: false,
    rating: 4.8,
    reviewCount: 142,
    isPopular: true,
    category: 'Grill & Nyama Choma',
  },
  {
    id: 'food-breakfast-chapati-1',
    restaurantId: 'rest-flagship-ember',
    name: 'Morning Power Breakfast: Chapati Mayai & Masala Chai',
    description: 'Two hot flaky layered chapatis with two fried eggs, spiced yellow beans (maharage ya nazi), and hot ginger milk tea.',
    price: 6000,
    currency: 'TZS',
    images: REAL_FOOD_IMAGES.mandazi_chai,
    platesAvailable: 35,
    initialPlates: 50,
    mealPeriod: 'breakfast',
    mealHours: { start: '06:30', end: '11:00' },
    autoHideOnClose: false,
    rating: 4.9,
    reviewCount: 180,
    isPopular: true,
    category: 'Breakfast & Chai',
  },
  {
    id: 'food-biryani-kuku-1',
    restaurantId: 'rest-flagship-ember',
    name: 'Zanzibari Chicken Biryani & Spicy Gravy',
    description: 'Fragrant basmati rice layered with slow-cooked marinated chicken thigh in rich saffron, coriander, and tomato yogurt gravy.',
    price: 13000,
    currency: 'TZS',
    images: REAL_FOOD_IMAGES.biryani,
    platesAvailable: 12,
    initialPlates: 25,
    mealPeriod: 'lunch',
    mealHours: { start: '11:30', end: '16:00' },
    autoHideOnClose: false,
    rating: 4.92,
    reviewCount: 154,
    category: 'Swahili & Coastal',
  },
  {
    id: 'food-healthy-salad-1',
    restaurantId: 'rest-flagship-ember',
    name: 'Office Wellness Avocado & Grilled Chicken Salad',
    description: 'Crisp garden greens, ripe butter avocado, char-grilled chicken strips, cherry tomatoes, cucumbers, toasted sesame, and honey lime vinaigrette.',
    price: 11000,
    currency: 'TZS',
    images: REAL_FOOD_IMAGES.healthy_salad,
    platesAvailable: 20,
    initialPlates: 30,
    mealPeriod: 'lunch',
    mealHours: { start: '10:30', end: '16:30' },
    autoHideOnClose: false,
    rating: 4.78,
    reviewCount: 95,
    category: 'Healthy & Salads',
  },
  {
    id: 'food-chips-mayai-1',
    restaurantId: 'rest-flagship-ember',
    name: 'Classic Zege / Chips Mayai with Mishkaki & Kachumbari',
    description: 'Iconic Tanzanian french fry omelette with chopped onions and bell peppers, topped with two tender beef mishkaki and hot tomato chilli.',
    price: 7500,
    currency: 'TZS',
    images: REAL_FOOD_IMAGES.chips_mayai,
    platesAvailable: 30,
    initialPlates: 40,
    mealPeriod: 'lunch',
    mealHours: { start: '11:00', end: '21:00' },
    autoHideOnClose: false,
    rating: 4.88,
    reviewCount: 210,
    category: 'Fast Bites',
  },
];

// Helper to seed 105 realistic East African restaurants across all countries, cities, and wards
export function generateOver100EastAfricanRestaurants(): { restaurants: Restaurant[]; foodItems: FoodItem[] } {
  const allRestaurants: Restaurant[] = [FLAGSHIP_CHEF_RESTAURANT];
  const allFood: FoodItem[] = [...FLAGSHIP_FOOD_ITEMS];

  const brandNames = [
    'Samaki Samaki Waterfront', 'Mamboz Size Nyama Choma', 'Chef Issa Coastal Kitchen',
    'Chai & Chapati Corner', 'Kibo Swahili Delicacies', 'Kilimanjaro Crown Grill',
    'Akemi Sky Lounge Bites', 'Zanzibar Spice & Seafood', 'Al-Nuaim Arabic & Swahili Foods',
    'Mama Ntilie Executive Plates', 'Posta Tower Lunch Express', 'Karibu Cafe & Bakery',
    'Nyama Choma Base', 'Safari Point Grill', 'Old Boma Traditional Flavours',
    'Serengeti Kitchen & BBQ', 'Upanga Green Leaf Healthy Bar', 'Sinza Corner Zege Hub',
    'Masaki Fishermans Wharf', 'Nairobi Java Swahili Roast', 'Carnivore BBQ Nairobi',
    'Mama Oliech Fresh Fish Tilapia', 'Kosewe Ranalo Swahili Foods', 'Fogo Gaucho Meat Lounge',
    'Habesha & Swahili Fusion', 'CJ’s Executive Business Cafe', 'Nakasero Hill Swahili Pot',
    'Fang Fang African & Asian Lunch', 'Kigali Viewpoint Charcoal Kitchen', 'Meze Fresh Fast Plates',
    'Heaven Restaurant & Organic Grill', 'Bourbon Coffee & Sandwiches', 'Repub Lounge & Brochettes',
    'Arusha Blue Heron Cafe', 'George’s Greek & Swahili Grill', 'Dodoma Bunge Canteen Deluxe',
    'Mwanza Tilapia Beach Lodge Foods', 'Forodhani Night Market Express', 'Lukmaan Swahili Heritage Foods',
  ];

  const chefNames = [
    'Chef Omari Juma', 'Chef Amina Bakari', 'Chef John Kamau', 'Chef Grace Mutua',
    'Chef Patrick Ssebagala', 'Chef David Mugabe', 'Chef Jean-Paul Habimana', 'Chef Fatma Salim',
    'Chef Baraka Mwamba', 'Chef Neema Kibona', 'Chef Josephat Kimario', 'Chef Amani Swai',
    'Chef Brian Ochieng', 'Chef Sarah Wanjiru', 'Chef Michael Byaruhanga', 'Chef Claudine Uwase',
  ];

  let idCounter = 1;

  for (const country of COUNTRIES) {
    const cities = CITIES_BY_COUNTRY[country] || ['Main City'];
    for (const city of cities) {
      const wards = WARDS_BY_CITY[city] || ['CBD', 'Downtown'];
      for (const ward of wards) {
        // Generate 2-3 restaurants per ward to easily exceed 100+ total restaurants
        const countInWard = ward.includes('CBD') || ward.includes('Posta') || ward.includes('Westlands') ? 3 : 2;
        for (let k = 0; k < countInWard; k++) {
          const nameIndex = (idCounter * 7) % brandNames.length;
          const chefIndex = (idCounter * 3) % chefNames.length;
          const restId = `rest-${country.toLowerCase().slice(0, 2)}-${city.toLowerCase().replace(/[^a-z]/g, '')}-${idCounter}`;
          const restaurantName = `${brandNames[nameIndex]} (${ward})`;

          const isFlagship = restId === FLAGSHIP_CHEF_RESTAURANT.id;
          if (isFlagship) continue;

          const rest: Restaurant = {
            id: restId,
            name: restaurantName,
            tagline: `Fresh chef-prepared meals delivered in ${15 + (idCounter % 15)} mins to office floors in ${ward}`,
            chefName: chefNames[chefIndex],
            country,
            city,
            ward,
            address: `${ward} High Street, Block ${10 + (idCounter % 40)}`,
            phone: `+255 7${50 + (idCounter % 40)} ${100 + idCounter} ${200 + idCounter}`,
            email: `contact.${idCounter}@ember-restaurants.com`,
            rating: Number((4.3 + ((idCounter * 17) % 7) / 10).toFixed(1)),
            reviewCount: 45 + (idCounter * 11) % 350,
            deliveryTime: `${15 + (idCounter % 15)}-${25 + (idCounter % 20)} min`,
            minOrder: 4000 + (idCounter % 3) * 1000,
            image: idCounter % 3 === 0
              ? 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
              : idCounter % 3 === 1
              ? 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
              : 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
            cuisine: idCounter % 2 === 0 ? 'Nyama Choma, BBQ & Swahili' : 'Fresh Tilapia Fish & Swahili Coastal',
            isOpenToday: true,
            openingHours: '07:00',
            closingHours: '22:00',
            subscriptionEnabled: idCounter % 3 === 0,
            subscriptionPlan: idCounter % 3 === 0 ? {
              name: 'Corporate Monthly Lunch Plan',
              price: 50000,
              period: 'Monthly Plan',
              perks: ['10% Off Orders', 'Free Hot Chai Every Morning', 'Priority Doorstep Handover'],
            } : undefined,
            paymentChannels: {
              cashActive: true,
              selcomActive: true,
              lipaNambaActive: true,
              lipaNambaNumber: `${6800000 + idCounter}`,
              lipaNambaName: restaurantName.toUpperCase().slice(0, 24),
              lipaNambaQrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TILL:${6800000 + idCounter}`,
              selcomAgentNumber: `SEL-${770000 + idCounter}`,
              selcomMerchantName: restaurantName.toUpperCase().slice(0, 20),
              selcomProviders: {
                airtel: true,
                vodacom: true,
                halotel: true,
                mixByYas: true,
              },
            },
          };

          allRestaurants.push(rest);

          // Seed 2-3 dishes per restaurant
          const dish1: FoodItem = {
            id: `food-${restId}-1`,
            restaurantId: restId,
            name: idCounter % 2 === 0 ? 'Ugali Samaki wa Kukaanga & Sukuma Wiki' : 'Nyama Choma Mbuzi Choma na Kachumbari',
            description: 'Authentic chef recipe cooked fresh each morning, served piping hot with traditional sides.',
            price: 11000 + (idCounter % 5) * 1000,
            currency: country === 'Kenya' ? 'KSh' : country === 'Uganda' ? 'UGX' : country === 'Rwanda' ? 'RWF' : 'TZS',
            images: idCounter % 2 === 0 ? REAL_FOOD_IMAGES.ugali_samaki : REAL_FOOD_IMAGES.nyama_choma,
            platesAvailable: 10 + (idCounter % 25),
            initialPlates: 30,
            mealPeriod: 'lunch',
            mealHours: { start: '11:00', end: '16:00' },
            autoHideOnClose: false,
            rating: 4.8,
            reviewCount: 88,
            category: idCounter % 2 === 0 ? 'Fish & Seafood' : 'Grill & Nyama Choma',
          };

          const dish2: FoodItem = {
            id: `food-${restId}-2`,
            restaurantId: restId,
            name: idCounter % 3 === 0 ? 'Pilau Ya Kuku na Salad ya Parachichi' : 'Mishkaki ya Ng\'ombe (4 pcs) & Zege',
            description: 'Aromatic fragrant lunch prepared specifically for office breaks without long wait times.',
            price: 9000 + (idCounter % 4) * 1000,
            currency: dish1.currency,
            images: idCounter % 3 === 0 ? REAL_FOOD_IMAGES.pilau : REAL_FOOD_IMAGES.mishkaki,
            platesAvailable: 8 + (idCounter % 20),
            initialPlates: 25,
            mealPeriod: 'lunch',
            mealHours: { start: '11:30', end: '16:30' },
            autoHideOnClose: false,
            rating: 4.7,
            reviewCount: 64,
            category: idCounter % 3 === 0 ? 'Swahili & Coastal' : 'Grill & Nyama Choma',
          };

          allFood.push(dish1, dish2);
          idCounter++;
        }
      }
    }
  }

  return { restaurants: allRestaurants, foodItems: allFood };
}

// Initial demo orders for the flagship restaurant (so Chef sees realistic active and historical orders)
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'EMB-9841',
    restaurantId: 'rest-flagship-ember',
    restaurantName: '.EMBER Swahili Grill & Executive Office Lunch',
    customerId: 'cust-demo-1',
    buyerName: 'Johnson Daudi',
    buyerPhone: '+255 712 345 678',
    officeLocation: 'UHURU HEIGHT Tower, Floor 4, CRDB Legal & Compliance Office, Desk 12',
    items: [
      { foodId: 'food-ugali-samaki-1', foodName: 'Ugali Samaki wa Kupaka & Kachumbari', unitPrice: 12000, platesCount: 2 },
    ],
    totalPlates: 2,
    totalAmount: 24000,
    paymentMethod: 'lipa_namba',
    isPaidDigitally: true,
    paidAt: '2026-10-11 12:15',
    createdAt: '2026-10-11 12:12',
    status: 'preparing',
    notes: 'Please bring extra lime kachumbari.',
    alertCount: 0,
  },
  {
    id: 'ord-102',
    orderNumber: 'EMB-9842',
    restaurantId: 'rest-flagship-ember',
    restaurantName: '.EMBER Swahili Grill & Executive Office Lunch',
    customerId: 'cust-demo-2',
    buyerName: 'Amina Kassim',
    buyerPhone: '+255 784 990 112',
    officeLocation: 'Samora Tower, 7th Floor, PwC Consulting Suite 702',
    items: [
      { foodId: 'food-nyama-choma-1', foodName: 'Nyama Choma Mbuzi (Half Kilo) & Roast Ndizi', unitPrice: 16000, platesCount: 1 },
      { foodId: 'food-pilau-nyama-1', foodName: 'Pilau Ya Nyama ya Ng\'ombe & Ndizi Tamu', unitPrice: 10000, platesCount: 1 },
    ],
    totalPlates: 2,
    totalAmount: 26000,
    paymentMethod: 'selcom',
    selcomProvider: 'vodacom',
    isPaidDigitally: false,
    createdAt: '2026-10-11 12:30',
    status: 'pending',
    notes: 'Deliver to 7th floor reception desk.',
  },
  {
    id: 'ord-103',
    orderNumber: 'EMB-9840',
    restaurantId: 'rest-flagship-ember',
    restaurantName: '.EMBER Swahili Grill & Executive Office Lunch',
    customerId: 'cust-demo-3',
    buyerName: 'Erick Mallya',
    buyerPhone: '+255 755 412 890',
    officeLocation: 'NIC Life House, 3rd Floor, Stanbic Treasury Desk',
    items: [
      { foodId: 'food-healthy-salad-1', foodName: 'Office Wellness Avocado & Grilled Chicken Salad', unitPrice: 11000, platesCount: 1 },
    ],
    totalPlates: 1,
    totalAmount: 11000,
    paymentMethod: 'cash',
    isPaidDigitally: false,
    createdAt: '2026-10-11 11:45',
    status: 'delivered',
    notes: 'Handover complete.',
  },
];

export const INITIAL_INBOX_MESSAGES: CustomerInboxMessage[] = [
  {
    id: 'msg-1',
    restaurantId: 'rest-flagship-ember',
    restaurantName: '.EMBER Swahili Grill',
    orderId: 'ord-101',
    subject: 'Your Ugali Samaki is simmering in coconut broth',
    content: 'Hello Johnson! Chef Rashid is currently preparing your 2 plates of fresh Tilapia. Our office runner will arrive at Uhuru Height Floor 4 in about 12 minutes.',
    timestamp: '12:18 PM',
    isRead: false,
    senderRole: 'chef',
  },
  {
    id: 'msg-2',
    restaurantId: 'rest-flagship-ember',
    restaurantName: '.EMBER Swahili Grill',
    subject: 'Welcome to .EMBER Office Delivery Pass',
    content: 'Thank you for joining our workplace dining network. You can pre-order group office lunches to share delivery fees with your floor colleagues.',
    timestamp: 'Yesterday',
    isRead: true,
    senderRole: 'chef',
  },
];

export const INITIAL_SEASONAL_FEATURES: SeasonalFeature[] = [
  {
    id: 'feat-christmas',
    type: 'christmas',
    name: 'Christmas & New Year Festive Special 🎄',
    isActive: false,
    emoji: '🎄 🎅 🎁',
    bannerText: 'Merry Office Holidays! Enjoy Free Holiday Custard & Treats on group lunch orders!',
    glowEffect: true,
  },
  {
    id: 'feat-ramadhan',
    type: 'ramadhan',
    name: 'Ramadhan Iftar & Office Futari Special 🌙',
    isActive: true,
    emoji: '🌙 ✨ 🧆',
    bannerText: 'Mwezi Mtukufu wa Ramadhan! Pre-order hot Futari & Fresh coastal dates delivered by 5:30 PM!',
    glowEffect: true,
  },
  {
    id: 'feat-party',
    type: 'party',
    name: 'End of Month Salary Celebration 🎉',
    isActive: true,
    emoji: '🎉 🥩 🥳',
    bannerText: 'Furaha ya Mwezi! Extra kachumbari and Mishkaki skewer with every Nyama Choma plate!',
    glowEffect: false,
  },
];

export const INITIAL_BALANCES: AccountBalances = {
  cash: 184000,
  lipaNamba: 432000,
  selcom: 298000,
  other: 55000,
  total: 969000,
};
