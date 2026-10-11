export type UserRole = 'customer' | 'chef';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  country: string;
  city?: string;
  ward?: string;
  constantLocation?: string; // e.g. "UHURU HEIGHT office/apartments, floor 2, Lawyers Office"
  profilePic?: string;
  restaurantId?: string; // If chef
}

export type MealPeriod = 'breakfast' | 'lunch' | 'dinner';

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number; // in TZS
  currency: string;
  images: [string, string]; // exactly 2 images for 2.3s auto scroll & manual swipe
  platesAvailable: number;
  initialPlates: number;
  mealPeriod: MealPeriod;
  mealHours: {
    start: string; // 24-hr format e.g. "11:30"
    end: string;   // 24-hr format e.g. "16:00"
  };
  autoHideOnClose: boolean;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  category: 'Swahili & Coastal' | 'Grill & Nyama Choma' | 'Breakfast & Chai' | 'Fish & Seafood' | 'Fast Bites' | 'Healthy & Salads';
}

export interface PaymentChannels {
  cashActive: boolean;
  selcomActive: boolean;
  lipaNambaActive: boolean;
  lipaNambaNumber: string;
  lipaNambaName: string;
  lipaNambaQrUrl?: string;
  selcomAgentNumber: string;
  selcomMerchantName: string;
  selcomProviders: {
    airtel: boolean;
    vodacom: boolean;
    halotel: boolean;
    mixByYas: boolean;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  chefName: string;
  country: string; // e.g. "Tanzania"
  city: string;    // e.g. "Dar es Salaam"
  ward: string;    // e.g. "Posta / CBD", "Kariakoo", "Upanga", "Sinza", "Masaki"
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string; // e.g. "15-25 min"
  minOrder: number;
  image: string;
  cuisine: string;
  isOpenToday: boolean;
  openingHours: string; // "07:00"
  closingHours: string; // "22:00"
  paymentChannels: PaymentChannels;
  subscriptionEnabled: boolean;
  subscriptionPlan?: {
    name: string;
    price: number; // e.g. 45000 TZS / month
    period: string; // "Monthly Office Pass"
    perks: string[];
  };
}

export type OrderStatus = 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash' | 'lipa_namba' | 'selcom';
export type SelcomProvider = 'airtel' | 'vodacom' | 'halotel' | 'mix_by_yas';

export interface OrderItem {
  foodId: string;
  foodName: string;
  unitPrice: number;
  platesCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string;
  customerId?: string;
  buyerName: string; // Contact caller name at the door
  buyerPhone: string;
  officeLocation: string; // Full office details (Building, Floor, Office Name)
  items: OrderItem[];
  totalPlates: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  selcomProvider?: SelcomProvider;
  isPaidDigitally: boolean;
  paidAt?: string;
  createdAt: string;
  status: OrderStatus;
  notes?: string;
  alertCount?: number; // Count of 5-min reminders sent to chef
}

export interface CustomerInboxMessage {
  id: string;
  restaurantId: string;
  restaurantName: string;
  orderId?: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  senderRole: 'chef' | 'customer';
}

export interface SeasonalFeature {
  id: string;
  type: 'christmas' | 'ramadhan' | 'party' | 'custom';
  name: string;
  isActive: boolean;
  emoji: string;
  bannerText: string;
  glowEffect: boolean;
}

export interface AccountBalances {
  cash: number;
  lipaNamba: number;
  selcom: number;
  other: number;
  total: number;
}

export interface TutorialStep {
  targetId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
