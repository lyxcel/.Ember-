import React, { useState, useEffect } from 'react';
import {
  User,
  Restaurant,
  FoodItem,
  Order,
  AccountBalances,
  CustomerInboxMessage,
  SeasonalFeature,
  MealPeriod,
} from './types';
import { AppStorage, DEMO_CHEF, DEMO_CUSTOMER } from './services/storage';
import { soundFx } from './services/audio';

// Components
import { Navbar } from './components/Navbar';
import { LocationFilterBar } from './components/LocationFilterBar';
import { FoodCard } from './components/FoodCard';
import { OrderSlidePanel } from './components/OrderSlidePanel';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { CustomerSettingsModal } from './components/CustomerSettingsModal';
import { GroupOrderModal } from './components/GroupOrderModal';
import { InteractiveTutorial } from './components/InteractiveTutorial';
import { AboutEmberModal } from './components/AboutEmberModal';
import { HelpCenterModal } from './components/HelpCenterModal';

// Icons
import {
  Flame,
  Clock,
  Sparkles,
  ShoppingBag,
  Building,
  CheckCircle2,
  Bell,
  Star,
  Users,
  UtensilsCrossed,
  ShieldCheck,
  ChevronRight,
  Eye,
  AlertCircle,
} from 'lucide-react';

export default function App() {
  // Database / state initialization
  useEffect(() => {
    AppStorage.initDatabase();
  }, []);

  // Authentication & View Mode
  const [currentUser, setCurrentUser] = useState<User | null>(() => AppStorage.getCurrentUser() || DEMO_CUSTOMER);
  const [chefViewMode, setChefViewMode] = useState<'admin' | 'customer_preview'>('customer_preview');

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'home' | 'restaurants' | 'about' | 'help'>('home');

  // Core Data
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => AppStorage.getRestaurants());
  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => AppStorage.getFoodItems());
  const [orders, setOrders] = useState<Order[]>(() => AppStorage.getOrders());
  const [balances, setBalances] = useState<AccountBalances>(() => AppStorage.getBalances());
  const [inboxMessages, setInboxMessages] = useState<CustomerInboxMessage[]>(() => AppStorage.getInboxMessages());
  const [seasonalFeatures, setSeasonalFeatures] = useState<SeasonalFeature[]>(() => AppStorage.getSeasonalFeatures());

  // Location & Search Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedMealPeriod, setSelectedMealPeriod] = useState<MealPeriod | 'all'>('all');

  // Selected Restaurant Drill-down (when clicking a specific restaurant in the Restaurants tab)
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);

  // Modals
  const [isOrderPanelOpen, setIsOrderPanelOpen] = useState(false);
  const [selectedFoodForOrder, setSelectedFoodForOrder] = useState<FoodItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCustomerSettingsOpen, setIsCustomerSettingsOpen] = useState(false);
  const [isGroupOrderOpen, setIsGroupOrderOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Push notification alert banner for Chef (5-min advance digital payment reminder)
  const [chefNotificationBanner, setChefNotificationBanner] = useState<string | null>(null);

  // Customer order success toast
  const [orderSuccessToast, setOrderSuccessToast] = useState<{ orderNumber: string; plates: number } | null>(null);

  // When current user changes to chef, default view mode to admin if not already set
  useEffect(() => {
    if (currentUser?.role === 'chef') {
      setChefViewMode('admin');
    } else {
      setChefViewMode('customer_preview');
    }
  }, [currentUser?.role]);

  // Sync state changes with storage
  const handleUpdateUser = (updatedUser: User | null) => {
    setCurrentUser(updatedUser);
    AppStorage.setCurrentUser(updatedUser);
  };

  const handleUpdateFoodItem = (updated: FoodItem) => {
    AppStorage.updateFoodItem(updated);
    setFoodItems(AppStorage.getFoodItems());
  };

  const handleAdjustPlates = (foodId: string, delta: number) => {
    const updated = AppStorage.adjustPlateCount(foodId, delta);
    if (updated) {
      setFoodItems(AppStorage.getFoodItems());
    }
  };

  const handleUpdateRestaurant = (updatedRest: Restaurant) => {
    AppStorage.updateRestaurant(updatedRest);
    setRestaurants(AppStorage.getRestaurants());
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    AppStorage.updateOrderStatus(orderId, status);
    setOrders(AppStorage.getOrders());
  };

  const handleSendCustomerMessage = (msg: CustomerInboxMessage) => {
    AppStorage.addInboxMessage(msg);
    setInboxMessages(AppStorage.getInboxMessages());
  };

  const handleUpdateBalances = (newBalances: AccountBalances) => {
    AppStorage.saveBalances(newBalances);
    setBalances(newBalances);
  };

  const handleUpdateSeasonalFeatures = (features: SeasonalFeature[]) => {
    AppStorage.saveSeasonalFeatures(features);
    setSeasonalFeatures(features);
  };

  const handleMarkMessageRead = (msgId: string) => {
    AppStorage.markInboxMessageRead(msgId);
    setInboxMessages(AppStorage.getInboxMessages());
  };

  // Live Inventory decrement on order placement
  const handleOrderPlaced = (newOrder: Order) => {
    // 1. Save order to persistent DB and balances
    AppStorage.addOrder(newOrder);
    setOrders(AppStorage.getOrders());
    setBalances(AppStorage.getBalances());

    // 2. Decrement available plates in real time
    for (const item of newOrder.items) {
      handleAdjustPlates(item.foodId, -item.platesCount);
    }

    // 3. Show customer success toast
    setOrderSuccessToast({
      orderNumber: newOrder.orderNumber,
      plates: newOrder.totalPlates,
    });
    setTimeout(() => setOrderSuccessToast(null), 5000);

    // 4. If paid digitally in advance: trigger sound chime & chef kitchen alert
    if (newOrder.isPaidDigitally) {
      soundFx.playChefKitchenAlert();
      setChefNotificationBanner(
        `🚨 Kitchen Alert: ${newOrder.buyerName} (${newOrder.officeLocation}) paid digitally in advance for ${newOrder.orderNumber}. Priority dispatch needed!`
      );
      setTimeout(() => setChefNotificationBanner(null), 8000);
    }
  };

  // Open Order Slide Panel
  const handleOpenOrderPanel = (food: FoodItem) => {
    setSelectedFoodForOrder(food);
    setIsOrderPanelOpen(true);
  };

  // Helper to find restaurant of a food item
  const getRestaurantForFood = (restaurantId: string): Restaurant | undefined => {
    return restaurants.find((r) => r.id === restaurantId);
  };

  // Filtered Food Items based on search, location, and meal period
  const filteredFoodItems = foodItems.filter((food) => {
    const rest = getRestaurantForFood(food.restaurantId);
    if (!rest) return false;

    // Filter by specific restaurant if one is clicked in the Restaurants tab
    if (activeRestaurantId && food.restaurantId !== activeRestaurantId) {
      return false;
    }

    // Meal period filter
    if (selectedMealPeriod !== 'all' && food.mealPeriod !== selectedMealPeriod) {
      return false;
    }

    // Location Country filter
    if (selectedCountry !== 'ALL' && rest.country !== selectedCountry) {
      return false;
    }

    // Location City filter
    if (selectedCity !== 'ALL' && rest.city !== selectedCity) {
      return false;
    }

    // Location Ward filter
    if (selectedWard !== 'ALL' && rest.ward !== selectedWard) {
      return false;
    }

    // Search query filter (matches food name, description, restaurant name, or ward)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFood = food.name.toLowerCase().includes(q) || food.description.toLowerCase().includes(q);
      const matchRest = rest.name.toLowerCase().includes(q) || rest.ward.toLowerCase().includes(q);
      const matchCategory = food.category.toLowerCase().includes(q);
      if (!matchFood && !matchRest && !matchCategory) return false;
    }

    return true;
  });

  // Filtered Restaurants for the Restaurants Tab
  const filteredRestaurants = restaurants.filter((rest) => {
    if (selectedCountry !== 'ALL' && rest.country !== selectedCountry) return false;
    if (selectedCity !== 'ALL' && rest.city !== selectedCity) return false;
    if (selectedWard !== 'ALL' && rest.ward !== selectedWard) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rest.name.toLowerCase().includes(q) ||
        rest.ward.toLowerCase().includes(q) ||
        rest.cuisine.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const flagshipRestaurant = restaurants[0] || restaurants.find((r) => r.id === 'rest-flagship-ember');
  const activeSeasonal = seasonalFeatures.find((f) => f.isActive);

  // Check if Chef is currently viewing Chef Admin side
  const isChefAdminView = currentUser?.role === 'chef' && chefViewMode === 'admin';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Push Notification Banner for Chef Kitchen Alerts */}
      {chefNotificationBanner && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between sticky top-0 z-50 shadow-md animate-in slide-in-from-top">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <Bell className="w-4 h-4 animate-bounce shrink-0" />
            <span className="truncate">{chefNotificationBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setChefNotificationBanner(null)}
            className="text-white hover:text-stone-200 text-sm font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Order Placed Toast */}
      {orderSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-in slide-in-from-bottom">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-orange-400">Order Dispatched to Chef!</div>
            <div className="text-xs font-extrabold text-white">
              {orderSuccessToast.plates} {orderSuccessToast.plates > 1 ? 'plates' : 'plate'} locked ({orderSuccessToast.orderNumber})
            </div>
          </div>
        </div>
      )}

      {/* Primary Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'about') {
            setIsAboutModalOpen(true);
          } else if (tab === 'help') {
            setIsHelpModalOpen(true);
          } else {
            setCurrentTab(tab);
            setActiveRestaurantId(null);
          }
        }}
        currentUser={currentUser}
        chefViewMode={chefViewMode}
        setChefViewMode={setChefViewMode}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCustomerSettings={() => setIsCustomerSettingsOpen(true)}
        onOpenGroupOrder={() => setIsGroupOrderOpen(true)}
        onStartTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Main Content Router: Chef Admin Portal vs Customer Experience */}
      {isChefAdminView ? (
        /* ========================================================================= */
        /* CHEF ADMIN PORTAL                                                         */
        /* ========================================================================= */
        <AdminDashboard
          restaurant={flagshipRestaurant}
          foodItems={foodItems}
          orders={orders}
          balances={balances}
          inboxMessages={inboxMessages}
          seasonalFeatures={seasonalFeatures}
          onUpdateFoodItem={handleUpdateFoodItem}
          onAdjustPlates={handleAdjustPlates}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onSendCustomerMessage={handleSendCustomerMessage}
          onUpdateBalances={handleUpdateBalances}
          onUpdateRestaurant={handleUpdateRestaurant}
          onUpdateSeasonalFeatures={handleUpdateSeasonalFeatures}
          onSwitchToCustomerView={() => setChefViewMode('customer_preview')}
        />
      ) : (
        /* ========================================================================= */
        /* CUSTOMER FACING EXPERIENCE                                                */
        /* ========================================================================= */
        <main className="flex-1 flex flex-col">
          {/* Active Seasonal / Holiday Theme Banner */}
          {activeSeasonal && (
            <div
              className={`py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeSeasonal.type === 'ramadhan'
                  ? 'bg-amber-100/90 text-amber-950 border-b border-amber-200'
                  : activeSeasonal.type === 'christmas'
                  ? 'bg-red-100/90 text-red-950 border-b border-red-200'
                  : 'bg-orange-100/90 text-orange-950 border-b border-orange-200'
              }`}
            >
              <span>{activeSeasonal.emoji}</span>
              <span>{activeSeasonal.bannerText}</span>
              <button
                type="button"
                onClick={() => setIsGroupOrderOpen(true)}
                className={`ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase transition-all cursor-pointer ${
                  activeSeasonal.glowEffect
                    ? activeSeasonal.type === 'ramadhan'
                      ? 'bg-amber-500 text-white animate-ramadhan-glow'
                      : 'bg-red-600 text-white animate-christmas-glow'
                    : 'bg-stone-900 text-white'
                }`}
              >
                Pool Lunch
              </button>
            </div>
          )}

          {/* Location Chevron Dropdown & Search Bar */}
          <LocationFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedWard={selectedWard}
            setSelectedWard={setSelectedWard}
            selectedMealPeriod={selectedMealPeriod}
            setSelectedMealPeriod={setSelectedMealPeriod}
            totalCount={currentTab === 'home' ? filteredFoodItems.length : filteredRestaurants.length}
          />

          {/* PAGE TAB 1: HOME (FOOD MENU & OFFICE ORDERING) */}
          {currentTab === 'home' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
              {/* Back button if customer drilled down into a specific restaurant's menu */}
              {activeRestaurantId && (
                <div className="flex items-center justify-between p-3.5 bg-orange-50/70 border border-orange-200 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Filtered to dishes from:</span>
                    <span className="text-xs font-extrabold text-orange-950">
                      {getRestaurantForFood(activeRestaurantId)?.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveRestaurantId(null)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-white px-3 py-1 rounded-xl border border-orange-200 shadow-xs cursor-pointer"
                  >
                    View All Kitchens
                  </button>
                </div>
              )}

              {/* Problem Solved Hero & Quick Overview Banner (Compact & Anti-Slop) */}
              {!activeRestaurantId && (
                <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white p-6 sm:p-8 shadow-sm">
                  <div className="relative z-10 max-w-2xl space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 fill-orange-400" />
                      <span>Dedicated to Office Desks & Floor Deliveries</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
                      Hot chef meals to your desk. <br className="hidden sm:inline" />
                      <span className="text-orange-500">No calls. No airtime hassle.</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                      Live plate counters lock your lunch before it sells out. Pay with Selcom Mobile Money or Lipa Namba right at your door with free office handover.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const firstFood = filteredFoodItems[0];
                          if (firstFood) handleOpenOrderPanel(firstFood);
                        }}
                        className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Order Lunch Now</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsGroupOrderOpen(true)}
                        className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm rounded-xl border border-stone-700 transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Users className="w-4 h-4 text-orange-400" />
                        <span>Group Floor Order</span>
                      </button>
                    </div>
                  </div>

                  {/* Decorative background subtle glow */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-600/20 to-transparent pointer-events-none hidden md:block" />
                </div>
              )}

              {/* Office Lunch Subscription Pass Card (Only shown if Chef permits subscription) */}
              {flagshipRestaurant.subscriptionEnabled && !activeRestaurantId && (
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-stone-900">
                          {flagshipRestaurant.subscriptionPlan?.name || 'Office Lunch VIP Pass'}
                        </h3>
                        <span className="text-[11px] font-bold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full">
                          Chef Permitted
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {flagshipRestaurant.subscriptionPlan?.perks.join(' · ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-base font-extrabold text-stone-900">
                      {flagshipRestaurant.subscriptionPlan?.price.toLocaleString()} TZS{' '}
                      <span className="text-xs font-normal text-stone-500">/mo</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playTick();
                        alert('Subscription activated! 15% discount applied to your next orders.');
                      }}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              )}

              {/* Main Food Items Grid (Responsive template for Phone, Tablet, Laptop) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-stone-900 font-display">
                      Available Today ({filteredFoodItems.length} Dishes)
                    </h2>
                    <p className="text-xs text-stone-500">
                      Images rotate automatically every 2.3s · Live plates inventory updated in real-time
                    </p>
                  </div>
                </div>

                {filteredFoodItems.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
                    <UtensilsCrossed className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-stone-700">No dishes matched your filter</h4>
                    <p className="text-xs text-stone-400 mt-1">
                      Try selecting "🌐 All World" or clear your search term to see more kitchens.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCountry('ALL');
                        setSelectedCity('ALL');
                        setSelectedWard('ALL');
                        setSearchQuery('');
                        setSelectedMealPeriod('all');
                      }}
                      className="mt-3 px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {filteredFoodItems.map((food) => (
                      <FoodCard
                        key={food.id}
                        food={food}
                        restaurant={getRestaurantForFood(food.restaurantId)}
                        onOpenOrderPanel={handleOpenOrderPanel}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PAGE TAB 2: RESTAURANTS (UBER EATS MULTI-RESTAURANT DIRECTORY) */}
          {currentTab === 'restaurants' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
              <div>
                <h2 className="text-xl font-black text-stone-900 font-display">
                  Explore Over 100+ East African & Global Kitchens
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Filter by Country, City and Ward to discover Swahili, Nyama Choma, Tilapia and breakfast delis.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRestaurants.map((rest) => (
                  <div
                    key={rest.id}
                    onClick={() => {
                      setActiveRestaurantId(rest.id);
                      setCurrentTab('home');
                    }}
                    className="group bg-white rounded-2xl border border-stone-200/80 hover:border-orange-300 hover:shadow-md transition-all p-4 cursor-pointer flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={rest.image}
                        alt={rest.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 group-hover:scale-102 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider truncate">
                            {rest.ward}
                          </span>
                          <span className="flex items-center gap-0.5 text-stone-800 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {rest.rating}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-orange-600 transition-colors mt-0.5">
                          {rest.name}
                        </h3>

                        <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                          {rest.cuisine}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{rest.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-bold group-hover:translate-x-0.5 transition-transform">
                        <span>View Dishes</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-6 px-4 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-orange-600">.EMBER</span>
            <span>· Restaurant & Office Food Delivery Platform</span>
          </div>
          <div className="flex items-center gap-4 text-stone-600">
            <button type="button" onClick={() => setIsAboutModalOpen(true)} className="hover:text-orange-600 cursor-pointer">
              About
            </button>
            <button type="button" onClick={() => setIsHelpModalOpen(true)} className="hover:text-orange-600 cursor-pointer">
              Help Center
            </button>
            <button type="button" onClick={() => setIsTutorialOpen(true)} className="hover:text-orange-600 cursor-pointer">
              How It Works
            </button>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODALS & DRAWERS                                                          */}
      {/* ========================================================================= */}

      {/* 1. Order Slide Panel (Sliding Drawer from Bottom) */}
      <OrderSlidePanel
        isOpen={isOrderPanelOpen}
        food={selectedFoodForOrder}
        restaurant={selectedFoodForOrder ? getRestaurantForFood(selectedFoodForOrder.restaurantId) || flagshipRestaurant : null}
        currentUser={currentUser}
        onClose={() => setIsOrderPanelOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 2. Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => handleUpdateUser(u)}
      />

      {/* 3. Customer Settings Modal */}
      <CustomerSettingsModal
        isOpen={isCustomerSettingsOpen}
        currentUser={currentUser}
        orders={orders}
        inboxMessages={inboxMessages}
        favouriteFoods={foodItems.slice(0, 3)}
        onClose={() => setIsCustomerSettingsOpen(false)}
        onUpdateUser={handleUpdateUser}
        onLogout={() => handleUpdateUser(null)}
        onMarkMessageRead={handleMarkMessageRead}
      />

      {/* 4. Group Office Lunch Pooling Modal (Uber Eats Style) */}
      <GroupOrderModal
        isOpen={isGroupOrderOpen}
        onClose={() => setIsGroupOrderOpen(false)}
      />

      {/* 5. Interactive Onboarding Tutorial (YouTube Style) */}
      <InteractiveTutorial
        isOpen={isTutorialOpen}
        role={currentUser?.role === 'chef' && chefViewMode === 'admin' ? 'chef' : 'customer'}
        onClose={() => setIsTutorialOpen(false)}
      />

      {/* 6. About .EMBER Modal */}
      <AboutEmberModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* 7. Help Center Modal */}
      <HelpCenterModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
