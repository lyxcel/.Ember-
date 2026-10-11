import {
  User,
  Restaurant,
  FoodItem,
  Order,
  CustomerInboxMessage,
  SeasonalFeature,
  AccountBalances,
} from '../types';
import {
  generateOver100EastAfricanRestaurants,
  INITIAL_ORDERS,
  INITIAL_INBOX_MESSAGES,
  INITIAL_SEASONAL_FEATURES,
  INITIAL_BALANCES,
  FLAGSHIP_CHEF_RESTAURANT,
} from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'ember_user',
  RESTAURANTS: 'ember_restaurants',
  FOOD_ITEMS: 'ember_food_items',
  ORDERS: 'ember_orders',
  INBOX: 'ember_inbox',
  SEASONAL: 'ember_seasonal',
  BALANCES: 'ember_balances',
  TUTORIAL_COMPLETED: 'ember_tutorial_completed',
  ACTIVE_VIEW_MODE: 'ember_active_view_mode', // for chefs: 'admin' | 'customer_preview'
};

export const DEMO_CHEF: User = {
  id: 'user-chef-flagship',
  name: 'Chef Rashid Mkali',
  email: 'chef@ember.co',
  phone: '+255 754 889 900',
  role: 'chef',
  country: 'Tanzania',
  city: 'Dar es Salaam',
  ward: 'Posta / CBD',
  constantLocation: 'Samora Avenue & Ohio Street Junction, City Center',
  restaurantId: FLAGSHIP_CHEF_RESTAURANT.id,
  profilePic: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80',
};

export const DEMO_CUSTOMER: User = {
  id: 'cust-demo-1',
  name: 'Johnson Daudi',
  email: 'daudi@lawfirm.co',
  phone: '+255 712 345 678',
  role: 'customer',
  country: 'Tanzania',
  city: 'Dar es Salaam',
  ward: 'Posta / CBD',
  constantLocation: 'UHURU HEIGHT Tower, Floor 4, CRDB Legal & Compliance Office, Desk 12',
  profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
};

export class AppStorage {
  // Load or initialize restaurants and foods
  static initDatabase() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) {
      const { restaurants, foodItems } = generateOver100EastAfricanRestaurants();
      localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(foodItems));
    }

    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    }

    if (!localStorage.getItem(STORAGE_KEYS.INBOX)) {
      localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(INITIAL_INBOX_MESSAGES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.SEASONAL)) {
      localStorage.setItem(STORAGE_KEYS.SEASONAL, JSON.stringify(INITIAL_SEASONAL_FEATURES));
    }

    if (!localStorage.getItem(STORAGE_KEYS.BALANCES)) {
      localStorage.setItem(STORAGE_KEYS.BALANCES, JSON.stringify(INITIAL_BALANCES));
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  static setCurrentUser(user: User | null) {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  static getRestaurants(): Restaurant[] {
    if (typeof window === 'undefined') return [FLAGSHIP_CHEF_RESTAURANT];
    this.initDatabase();
    const data = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    return data ? JSON.parse(data) : [];
  }

  static saveRestaurants(restaurants: Restaurant[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
  }

  static updateRestaurant(restaurant: Restaurant) {
    const list = this.getRestaurants();
    const idx = list.findIndex(r => r.id === restaurant.id);
    if (idx >= 0) {
      list[idx] = restaurant;
    } else {
      list.unshift(restaurant);
    }
    this.saveRestaurants(list);
  }

  static getFoodItems(): FoodItem[] {
    if (typeof window === 'undefined') return [];
    this.initDatabase();
    const data = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    return data ? JSON.parse(data) : [];
  }

  static saveFoodItems(foodItems: FoodItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(foodItems));
  }

  static adjustPlateCount(foodId: string, delta: number): FoodItem | null {
    const foods = this.getFoodItems();
    const item = foods.find(f => f.id === foodId);
    if (item) {
      item.platesAvailable = Math.max(0, item.platesAvailable + delta);
      this.saveFoodItems(foods);
      return item;
    }
    return null;
  }

  static updateFoodItem(updated: FoodItem) {
    const foods = this.getFoodItems();
    const idx = foods.findIndex(f => f.id === updated.id);
    if (idx >= 0) {
      foods[idx] = updated;
    } else {
      foods.unshift(updated);
    }
    this.saveFoodItems(foods);
  }

  static getOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    this.initDatabase();
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : [];
  }

  static saveOrders(orders: Order[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  static addOrder(newOrder: Order) {
    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Update financial balance
    const balances = this.getBalances();
    if (newOrder.paymentMethod === 'cash') {
      balances.cash += newOrder.totalAmount;
    } else if (newOrder.paymentMethod === 'lipa_namba') {
      balances.lipaNamba += newOrder.totalAmount;
    } else if (newOrder.paymentMethod === 'selcom') {
      balances.selcom += newOrder.totalAmount;
    }
    balances.total += newOrder.totalAmount;
    this.saveBalances(balances);
  }

  static updateOrderStatus(orderId: string, status: Order['status']) {
    const orders = this.getOrders();
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      ord.status = status;
      this.saveOrders(orders);
    }
  }

  static getBalances(): AccountBalances {
    if (typeof window === 'undefined') return INITIAL_BALANCES;
    this.initDatabase();
    const data = localStorage.getItem(STORAGE_KEYS.BALANCES);
    return data ? JSON.parse(data) : INITIAL_BALANCES;
  }

  static saveBalances(balances: AccountBalances) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.BALANCES, JSON.stringify(balances));
  }

  static getInboxMessages(): CustomerInboxMessage[] {
    if (typeof window === 'undefined') return [];
    this.initDatabase();
    const data = localStorage.getItem(STORAGE_KEYS.INBOX);
    return data ? JSON.parse(data) : [];
  }

  static saveInboxMessages(msgs: CustomerInboxMessage[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(msgs));
  }

  static addInboxMessage(msg: CustomerInboxMessage) {
    const msgs = this.getInboxMessages();
    msgs.unshift(msg);
    this.saveInboxMessages(msgs);
  }

  static markInboxMessageRead(msgId: string) {
    const msgs = this.getInboxMessages();
    const target = msgs.find(m => m.id === msgId);
    if (target) {
      target.isRead = true;
      this.saveInboxMessages(msgs);
    }
  }

  static getSeasonalFeatures(): SeasonalFeature[] {
    if (typeof window === 'undefined') return [];
    this.initDatabase();
    const data = localStorage.getItem(STORAGE_KEYS.SEASONAL);
    return data ? JSON.parse(data) : [];
  }

  static saveSeasonalFeatures(features: SeasonalFeature[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SEASONAL, JSON.stringify(features));
  }

  static isTutorialCompleted(role: 'customer' | 'chef'): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`${STORAGE_KEYS.TUTORIAL_COMPLETED}_${role}`) === 'true';
  }

  static setTutorialCompleted(role: 'customer' | 'chef', completed: boolean) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${STORAGE_KEYS.TUTORIAL_COMPLETED}_${role}`, completed ? 'true' : 'false');
  }
}
