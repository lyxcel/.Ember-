import React, { useState } from 'react';
import {
  Restaurant,
  FoodItem,
  Order,
  AccountBalances,
  CustomerInboxMessage,
  SeasonalFeature,
  MealPeriod,
} from '../types';
import {
  Plus,
  Minus,
  Eye,
  TrendingUp,
  Clock,
  Inbox,
  ShoppingBag,
  CreditCard,
  Sliders,
  Sparkles,
  Send,
  CheckCircle,
  Bell,
  CheckCheck,
  ChevronDown,
  Building,
  Phone,
  Flame,
  Check,
} from 'lucide-react';
import { soundFx } from '../services/audio';

interface AdminDashboardProps {
  restaurant: Restaurant;
  foodItems: FoodItem[];
  orders: Order[];
  balances: AccountBalances;
  inboxMessages: CustomerInboxMessage[];
  seasonalFeatures: SeasonalFeature[];
  onUpdateFoodItem: (item: FoodItem) => void;
  onAdjustPlates: (foodId: string, delta: number) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onSendCustomerMessage: (msg: CustomerInboxMessage) => void;
  onUpdateBalances: (balances: AccountBalances) => void;
  onUpdateRestaurant: (restaurant: Restaurant) => void;
  onUpdateSeasonalFeatures: (features: SeasonalFeature[]) => void;
  onSwitchToCustomerView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurant,
  foodItems,
  orders,
  balances,
  inboxMessages,
  seasonalFeatures,
  onUpdateFoodItem,
  onAdjustPlates,
  onUpdateOrderStatus,
  onSendCustomerMessage,
  onUpdateBalances,
  onUpdateRestaurant,
  onUpdateSeasonalFeatures,
  onSwitchToCustomerView,
}) => {
  // Navigation tabs for Admin Navbar
  type AdminTab = 'dashboard' | 'menu' | 'inbox' | 'features' | 'settings';
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');

  // Modals / Expanded views
  const [showAllOrdersModal, setShowAllOrdersModal] = useState(false);
  const [showAllInboxModal, setShowAllInboxModal] = useState(false);

  // New message form state
  const [msgRecipient, setMsgRecipient] = useState('');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgContent, setMsgContent] = useState('');
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  // Editable restaurant settings
  const [restName, setRestName] = useState(restaurant.name);
  const [restPhone, setRestPhone] = useState(restaurant.phone);
  const [restOpenTime, setRestOpenTime] = useState(restaurant.openingHours);
  const [restCloseTime, setRestCloseTime] = useState(restaurant.closingHours);
  const [restAddress, setRestAddress] = useState(restaurant.address);
  const [lipaNamba, setLipaNamba] = useState(restaurant.paymentChannels.lipaNambaNumber);
  const [lipaName, setLipaName] = useState(restaurant.paymentChannels.lipaNambaName);
  const [selcomAgent, setSelcomAgent] = useState(restaurant.paymentChannels.selcomAgentNumber);
  const [selcomName, setSelcomName] = useState(restaurant.paymentChannels.selcomMerchantName);
  const [lipaActive, setLipaActive] = useState(restaurant.paymentChannels.lipaNambaActive);
  const [selcomActive, setSelcomActive] = useState(restaurant.paymentChannels.selcomActive);
  const [cashActive, setCashActive] = useState(restaurant.paymentChannels.cashActive);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Subscription editor state
  const [subEnabled, setSubEnabled] = useState(restaurant.subscriptionEnabled);
  const [subPrice, setSubPrice] = useState(restaurant.subscriptionPlan?.price || 45000);
  const [subPerks, setSubPerks] = useState<string[]>(
    restaurant.subscriptionPlan?.perks || [
      '15% Off all Executive Lunch Orders',
      'Free Daily Cardamom Spiced Juice or Water',
      'Priority Reception & Floor Delivery',
    ]
  );
  const [newPerkInput, setNewPerkInput] = useState('');

  // Handle manual plate adjustment
  const handlePlatesDelta = (foodId: string, delta: number) => {
    soundFx.playTick();
    onAdjustPlates(foodId, delta);
  };

  // Handle meal period & hour change on food container
  const handleMealPeriodChange = (food: FoodItem, period: MealPeriod) => {
    const defaultHours =
      period === 'breakfast'
        ? { start: '06:30', end: '11:00' }
        : period === 'lunch'
        ? { start: '11:30', end: '16:00' }
        : { start: '16:30', end: '22:00' };

    const updated: FoodItem = {
      ...food,
      mealPeriod: period,
      mealHours: defaultHours,
    };
    onUpdateFoodItem(updated);
  };

  // Send message to customer
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSubject || !msgContent) return;

    const newMsg: CustomerInboxMessage = {
      id: `msg-${Date.now().toString(36)}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      subject: msgSubject,
      content: msgContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      senderRole: 'chef',
    };

    onSendCustomerMessage(newMsg);
    setMsgSentSuccess(true);
    setTimeout(() => {
      setMsgSentSuccess(false);
      setMsgSubject('');
      setMsgContent('');
      setMsgRecipient('');
    }, 2000);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Restaurant = {
      ...restaurant,
      name: restName,
      phone: restPhone,
      openingHours: restOpenTime,
      closingHours: restCloseTime,
      address: restAddress,
      paymentChannels: {
        ...restaurant.paymentChannels,
        lipaNambaNumber: lipaNamba,
        lipaNambaName: lipaName.toUpperCase(),
        selcomAgentNumber: selcomAgent,
        selcomMerchantName: selcomName.toUpperCase(),
        lipaNambaActive: lipaActive,
        selcomActive: selcomActive,
        cashActive: cashActive,
      },
      subscriptionEnabled: subEnabled,
      subscriptionPlan: {
        name: 'Office Lunch VIP Pass',
        price: subPrice,
        period: 'Monthly Office Pass',
        perks: subPerks,
      },
    };
    onUpdateRestaurant(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Seasonal feature toggle
  const handleToggleSeasonal = (featureId: string) => {
    const updated = seasonalFeatures.map((f) =>
      f.id === featureId ? { ...f, isActive: !f.isActive } : f
    );
    onUpdateSeasonalFeatures(updated);
  };

  return (
    <div className="min-w-full bg-[#faf8f5] min-h-[calc(100vh-64px)] pb-16">
      {/* Admin Side Top Sub-Navbar */}
      <div className="bg-stone-900 text-white border-b border-stone-800 sticky top-16 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-orange-400" /> Chef Admin Side
            </span>
            <span className="text-stone-500 hidden sm:inline">|</span>
            <span className="text-xs font-semibold text-stone-300 truncate max-w-[200px] hidden sm:inline">
              {restaurant.name}
            </span>
          </div>

          {/* Admin Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveAdminTab('dashboard')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeAdminTab === 'dashboard'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('menu')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeAdminTab === 'menu'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Menu Plates
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('inbox')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                activeAdminTab === 'inbox'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>Inbox</span>
              {inboxMessages.some((m) => !m.isRead) && (
                <span className="w-2 h-2 rounded-full bg-orange-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('features')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeAdminTab === 'features'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Features & Perks
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('settings')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeAdminTab === 'settings'
                  ? 'bg-orange-600 text-white'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Settings
            </button>

            {/* "View as Customer" switcher required by brief */}
            <button
              type="button"
              onClick={onSwitchToCustomerView}
              className="ml-2 px-3 py-1.5 bg-stone-800 hover:bg-orange-600 text-stone-200 hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Inspect how office customers see your menu and prices"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">View as Customer</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ========================================================= */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Stat Row: Account Balances in Every Account */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Lipa Namba Balance */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Lipa Namba (Till)</span>
                  <CreditCard className="w-4 h-4 text-orange-500" />
                </div>
                <div className="mt-2">
                  <div className="text-xl sm:text-2xl font-black text-stone-900">
                    {balances.lipaNamba.toLocaleString()} <span className="text-xs font-bold text-orange-600">TZS</span>
                  </div>
                  <span className="text-[11px] text-stone-400">Agent: {restaurant.paymentChannels.lipaNambaNumber}</span>
                </div>
              </div>

              {/* Selcom Mobile Money Balance */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Selcom Pay</span>
                  <CreditCard className="w-4 h-4 text-blue-500" />
                </div>
                <div className="mt-2">
                  <div className="text-xl sm:text-2xl font-black text-stone-900">
                    {balances.selcom.toLocaleString()} <span className="text-xs font-bold text-blue-600">TZS</span>
                  </div>
                  <span className="text-[11px] text-stone-400">Code: {restaurant.paymentChannels.selcomAgentNumber}</span>
                </div>
              </div>

              {/* Cash Desk Balance */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Cash Collected</span>
                  <ShoppingBag className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mt-2">
                  <div className="text-xl sm:text-2xl font-black text-stone-900">
                    {balances.cash.toLocaleString()} <span className="text-xs font-bold text-emerald-600">TZS</span>
                  </div>
                  <span className="text-[11px] text-stone-400">Paid at office door</span>
                </div>
              </div>

              {/* Total Revenue Balance */}
              <div className="p-4 bg-stone-900 text-white rounded-2xl shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
                <div className="mt-2">
                  <div className="text-xl sm:text-2xl font-black text-orange-400">
                    {balances.total.toLocaleString()} <span className="text-xs font-bold text-white">TZS</span>
                  </div>
                  <span className="text-[11px] text-stone-400">All channels combined</span>
                </div>
              </div>
            </div>

            {/* Graphs & Analytics Row: Reviews Graph & Monthly Data */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Monthly Orders & Revenue Visual Bar Chart (7 cols) */}
              <div className="lg:col-span-7 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-stone-900">Monthly Revenue & Orders</h3>
                    <p className="text-xs text-stone-500">Office lunch orders surge between 11:30 and 14:00</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    +18.4% vs last month
                  </span>
                </div>

                {/* SVG Revenue Bar Chart */}
                <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2 px-2 border-b border-stone-100">
                  {[
                    { month: 'May', height: '42%', val: '640k', orders: 48 },
                    { month: 'Jun', height: '56%', val: '820k', orders: 62 },
                    { month: 'Jul', height: '68%', val: '980k', orders: 74 },
                    { month: 'Aug', height: '74%', val: '1.1M', orders: 85 },
                    { month: 'Sep', height: '88%', val: '1.3M', orders: 104 },
                    { month: 'Oct', height: '94%', val: '1.4M', orders: 121 },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-bold text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.val}
                      </span>
                      <div
                        style={{ height: bar.height }}
                        className="w-full bg-orange-500 group-hover:bg-orange-600 rounded-t-lg transition-all"
                      />
                      <span className="text-[11px] font-semibold text-stone-600">{bar.month}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-stone-400 pt-3">
                  <span>Peak days: Tuesday & Thursday (Corporate meetings)</span>
                  <span>Average ticket: 14,200 TZS</span>
                </div>
              </div>

              {/* Reviews Breakdown Graph (5 cols) */}
              <div className="lg:col-span-5 p-5 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-stone-900">Customer Reviews</h3>
                    <p className="text-xs text-stone-500">Based on 384 verified office orders</p>
                  </div>
                  <div className="flex items-center gap-1 text-base font-black text-stone-900">
                    <span className="text-amber-500">★</span> 4.9
                  </div>
                </div>

                {/* Rating Distribution Bars */}
                <div className="space-y-2.5">
                  {[
                    { stars: '5 Stars', pct: '88%', count: 338 },
                    { stars: '4 Stars', pct: '9%', count: 35 },
                    { stars: '3 Stars', pct: '2%', count: 8 },
                    { stars: '2 Stars', pct: '1%', count: 2 },
                    { stars: '1 Star', pct: '0%', count: 1 },
                  ].map((r, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="w-14 text-stone-500 font-medium">{r.stars}</span>
                      <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: r.pct }}
                          className="h-full bg-amber-400 rounded-full"
                        />
                      </div>
                      <span className="w-10 text-right text-stone-400 font-semibold">{r.count}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Top praised: Fast floor delivery & Tilapia crispness</span>
                </div>
              </div>
            </div>

            {/* Orders History Container (with "See All" at top right and scrollable table) */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900">Live Orders & Handover History</h3>
                  <p className="text-xs text-stone-500">
                    Click status to advance order from Preparing to Out for Delivery or Delivered
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllOrdersModal(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  See All Orders ({orders.length})
                </button>
              </div>

              {/* Scrollable table container */}
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
                      <th className="py-2.5 px-3">Date / Time</th>
                      <th className="py-2.5 px-3">Customer Name & Floor</th>
                      <th className="py-2.5 px-3">Order Items</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {orders.slice(0, 8).map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-3 whitespace-nowrap text-stone-500 font-mono">
                          {ord.createdAt}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-stone-900">{ord.buyerName}</div>
                          <div className="text-[11px] text-stone-500 truncate max-w-[220px]">
                            {ord.officeLocation}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {ord.items.map((it, i) => (
                            <div key={i} className="whitespace-nowrap">
                              {it.platesCount}x {it.foodName}
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="font-semibold text-stone-800">
                            {ord.paymentMethod === 'lipa_namba'
                              ? 'Lipa Namba'
                              : ord.paymentMethod === 'selcom'
                              ? `Selcom (${ord.selcomProvider?.toUpperCase() || 'Agent'})`
                              : 'Cash'}
                          </span>
                          {ord.isPaidDigitally && (
                            <span className="block text-[10px] text-emerald-600 font-bold">
                              ✓ Paid in advance
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-extrabold text-stone-900">
                          {ord.totalAmount.toLocaleString()} TZS
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              onUpdateOrderStatus(ord.id, e.target.value as Order['status'])
                            }
                            className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : ord.status === 'preparing'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : ord.status === 'out_for_delivery'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MENU PLATES & MEAL PERIODS MANAGEMENT */}
        {/* ========================================================= */}
        {activeAdminTab === 'menu' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900">
                  Live Plates Inventory & Meal Schedule
                </h3>
                <p className="text-xs text-stone-500">
                  Click minus (-) when an off-line customer buys in person. Changes reflect immediately on the customer screen!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodItems
                .filter((f) => f.restaurantId === restaurant.id)
                .map((food) => (
                  <div
                    key={food.id}
                    className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={food.images[0]}
                        alt={food.name}
                        className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                          {food.category}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 truncate">{food.name}</h4>
                        <span className="text-xs font-extrabold text-orange-600 block mt-0.5">
                          {food.price.toLocaleString()} {food.currency}
                        </span>
                      </div>
                    </div>

                    {/* Meal Period Option Selector (Chevron) & 24h Hours */}
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-700">Meal Period:</span>
                        <select
                          value={food.mealPeriod}
                          onChange={(e) =>
                            handleMealPeriodChange(food, e.target.value as MealPeriod)
                          }
                          className="text-xs font-semibold px-2 py-0.5 bg-white border border-stone-300 rounded-lg focus:outline-none"
                        >
                          <option value="breakfast">Breakfast (06:30 - 11:00)</option>
                          <option value="lunch">Lunch (11:30 - 16:00)</option>
                          <option value="dinner">Dinner (16:30 - 22:00)</option>
                        </select>
                      </div>

                      {/* 24-hr Start / End time */}
                      <div className="flex items-center justify-between text-xs text-stone-600">
                        <span className="text-[11px] font-medium">Serving Window (24h):</span>
                        <div className="flex items-center gap-1 font-mono font-semibold">
                          <input
                            type="text"
                            value={food.mealHours.start}
                            onChange={(e) => {
                              onUpdateFoodItem({
                                ...food,
                                mealHours: { ...food.mealHours, start: e.target.value },
                              });
                            }}
                            className="w-12 text-center py-0.5 bg-white border border-stone-300 rounded-md text-xs"
                          />
                          <span>-</span>
                          <input
                            type="text"
                            value={food.mealHours.end}
                            onChange={(e) => {
                              onUpdateFoodItem({
                                ...food,
                                mealHours: { ...food.mealHours, end: e.target.value },
                              });
                            }}
                            className="w-12 text-center py-0.5 bg-white border border-stone-300 rounded-md text-xs"
                          />
                        </div>
                      </div>

                      {/* Auto disappear on close hours toggle */}
                      <label className="flex items-center justify-between text-[11px] text-stone-600 cursor-pointer pt-1 border-t border-stone-200/60">
                        <span>Auto-hide outside open hours:</span>
                        <input
                          type="checkbox"
                          checked={food.autoHideOnClose}
                          onChange={(e) => {
                            onUpdateFoodItem({
                              ...food,
                              autoHideOnClose: e.target.checked,
                            });
                          }}
                          className="w-4 h-4 text-orange-600 rounded-sm"
                        />
                      </label>
                    </div>

                    {/* Plates Adjuster Section */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">Available Plates</span>
                        <span className="text-[11px] text-stone-400">
                          Initial: {food.initialPlates}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlatesDelta(food.id, -1)}
                          className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center justify-center font-bold text-sm cursor-pointer"
                          title="Walk-in sale (-1 plate)"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-8 text-center font-black text-sm text-stone-900">
                          {food.platesAvailable}
                        </span>

                        <button
                          type="button"
                          onClick={() => handlePlatesDelta(food.id, 1)}
                          className="w-8 h-8 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                          title="Restock (+1 plate)"
                        >
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: INBOX & MESSAGING TO CUSTOMERS */}
        {/* ========================================================= */}
        {activeAdminTab === 'inbox' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-stone-900">Customer Communication Center</h3>
                <p className="text-xs text-stone-500">
                  Notify diners about their delivery progress or announce special lunch cuts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllInboxModal(true)}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                See All Messages ({inboxMessages.length})
              </button>
            </div>

            {/* Compose Message Box */}
            <form
              onSubmit={handleSendMessage}
              className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3"
            >
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-orange-600" /> Send Broadcast / Order Update
              </h4>

              {msgSentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Message delivered to customer inbox!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={msgSubject}
                    onChange={(e) => setMsgSubject(e.target.value)}
                    placeholder="e.g. Your fresh Tilapia is en route to Floor 4"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Recipient / Office Desk Note
                  </label>
                  <input
                    type="text"
                    value={msgRecipient}
                    onChange={(e) => setMsgRecipient(e.target.value)}
                    placeholder="e.g. Johnson Daudi (All active office diners)"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Message Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={msgContent}
                  onChange={(e) => setMsgContent(e.target.value)}
                  placeholder="Dear diners, our runner is currently stepping into the elevator at Uhuru Height..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Customer Inbox</span>
              </button>
            </form>

            {/* Recent Messages Feed */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Sent Messages Log
              </h4>
              {inboxMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 bg-white rounded-xl border border-stone-200 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-stone-900 block">{msg.subject}</span>
                    <p className="text-stone-600 mt-0.5">{msg.content}</p>
                  </div>
                  <span className="text-[11px] text-stone-400 whitespace-nowrap">{msg.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ADDING FEATURES PAGE (SUBSCRIPTIONS & SEASONAL THEMES) */}
        {/* ========================================================= */}
        {activeAdminTab === 'features' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900">
                Adding Features: Subscriptions & Holiday Themes
              </h3>
              <p className="text-xs text-stone-500">
                Control customer-facing subscription passes, festive glowing buttons, and holiday banners.
              </p>
            </div>

            {/* 1. Subscription Pass Configuration Container */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-600" /> Office Diner Subscription Pass
                  </h4>
                  <p className="text-xs text-stone-500">
                    When enabled by you, this option will appear on the customer page.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subEnabled}
                    onChange={(e) => setSubEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  <span className="ml-2 text-xs font-bold text-stone-700">
                    {subEnabled ? 'Enabled for Customers' : 'Disabled'}
                  </span>
                </label>
              </div>

              {subEnabled && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Subscription Price (Monthly in TZS)
                      </label>
                      <input
                        type="number"
                        value={subPrice}
                        onChange={(e) => setSubPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Customer Subscriber Conditions & Benefits:
                    </label>
                    <div className="space-y-2">
                      {subPerks.map((perk, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-800"
                        >
                          <span>• {perk}</span>
                          <button
                            type="button"
                            onClick={() => setSubPerks(subPerks.filter((_, i) => i !== idx))}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add new perk input */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newPerkInput}
                        onChange={(e) => setNewPerkInput(e.target.value)}
                        placeholder="Add benefit (e.g. Free delivery during rain rush)..."
                        className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newPerkInput.trim()) {
                            setSubPerks([...subPerks, newPerkInput.trim()]);
                            setNewPerkInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Add Perk
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Seasonal Holidays & Animated Glowing Buttons Container */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div>
                <h4 className="text-sm font-extrabold text-stone-900">
                  Seasonal Events & World Celebrations
                </h4>
                <p className="text-xs text-stone-500">
                  Activates glowing animations, festive emojis (Christmas, Ramadhan, Party emojis) on customer banners.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {seasonalFeatures.map((feat) => (
                  <div
                    key={feat.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      feat.isActive
                        ? feat.type === 'ramadhan'
                          ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20'
                          : feat.type === 'christmas'
                          ? 'bg-red-50/70 border-red-300 ring-2 ring-red-400/20'
                          : 'bg-orange-50/70 border-orange-300 ring-2 ring-orange-400/20'
                        : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{feat.emoji}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleSeasonal(feat.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg cursor-pointer ${
                          feat.isActive
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {feat.isActive ? 'Active' : 'Turn On'}
                      </button>
                    </div>
                    <div className="text-xs font-extrabold text-stone-900">{feat.name}</div>
                    <p className="text-[11px] text-stone-600 mt-1">{feat.bannerText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ADMIN SETTINGS & PAYMENT CHANNELS */}
        {/* ========================================================= */}
        {activeAdminTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in max-w-3xl">
            <div>
              <h3 className="text-lg font-extrabold text-stone-900">Restaurant & Payment Settings</h3>
              <p className="text-xs text-stone-500">
                Configure your operating hours (24h format), Selcom numbers, and Lipa Namba merchant details.
              </p>
            </div>

            {settingsSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Settings and payment accounts updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* Profile Details */}
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Kitchen Profile & Operating Hours
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      value={restName}
                      onChange={(e) => setRestName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Kitchen Phone
                    </label>
                    <input
                      type="text"
                      value={restPhone}
                      onChange={(e) => setRestPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>

                {/* 24-hr opening and closing times */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Opening Hour (24h Format)
                    </label>
                    <input
                      type="text"
                      value={restOpenTime}
                      onChange={(e) => setRestOpenTime(e.target.value)}
                      placeholder="06:30"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Closing Hour (24h Format)
                    </label>
                    <input
                      type="text"
                      value={restCloseTime}
                      onChange={(e) => setRestCloseTime(e.target.value)}
                      placeholder="21:30"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Street & Ward Location
                  </label>
                  <input
                    type="text"
                    value={restAddress}
                    onChange={(e) => setRestAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Payment Methods Configuration */}
              <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Payment Channels (Lipa Namba & Selcom)
                </h4>

                {/* Lipa Namba Configuration */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Lipa Namba (Till / Agent Number)
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lipaActive}
                        onChange={(e) => setLipaActive(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded-sm"
                      />
                      <span>Active Today</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Lipa Namba Number
                      </label>
                      <input
                        type="text"
                        value={lipaNamba}
                        onChange={(e) => setLipaNamba(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Name of Lipa Namba (Capital Letters)
                      </label>
                      <input
                        type="text"
                        value={lipaName}
                        onChange={(e) => setLipaName(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl uppercase font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Selcom Configuration */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900">
                      Selcom Pay (Airtel, Vodacom, Halotel, Yas)
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selcomActive}
                        onChange={(e) => setSelcomActive(e.target.checked)}
                        className="w-4 h-4 text-orange-600 rounded-sm"
                      />
                      <span>Active Today</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Selcom Agent Code / Normal Number
                      </label>
                      <input
                        type="text"
                        value={selcomAgent}
                        onChange={(e) => setSelcomAgent(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Selcom Merchant Name
                      </label>
                      <input
                        type="text"
                        value={selcomName}
                        onChange={(e) => setSelcomName(e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl uppercase font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Cash Desk Toggle */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">Cash on Desk Delivery</span>
                  <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cashActive}
                      onChange={(e) => setCashActive(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded-sm"
                    />
                    <span>Active Today</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                Save All Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* "See All" Orders Modal */}
      {showAllOrdersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl bg-white rounded-3xl p-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-extrabold text-stone-900">
                Complete Orders History Archive ({orders.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowAllOrdersModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mt-3">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b text-stone-400 font-bold uppercase text-[10px]">
                    <th className="p-2">Order #</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Recipient & Floor</th>
                    <th className="p-2">Items</th>
                    <th className="p-2">Payment</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="p-2 font-mono font-bold text-orange-600">{ord.orderNumber}</td>
                      <td className="p-2 text-stone-500">{ord.createdAt}</td>
                      <td className="p-2">
                        <div className="font-bold text-stone-900">{ord.buyerName}</div>
                        <div className="text-[10px] text-stone-500">{ord.officeLocation}</div>
                      </td>
                      <td className="p-2">
                        {ord.items.map((it, i) => (
                          <div key={i}>
                            {it.platesCount}x {it.foodName}
                          </div>
                        ))}
                      </td>
                      <td className="p-2 uppercase font-semibold">{ord.paymentMethod}</td>
                      <td className="p-2 font-extrabold">{ord.totalAmount.toLocaleString()} TZS</td>
                      <td className="p-2">
                        <span className="font-bold text-[10px] uppercase">{ord.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* "See All" Inbox Modal */}
      {showAllInboxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-extrabold text-stone-900">
                All Communications ({inboxMessages.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowAllInboxModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mt-3 space-y-2">
              {inboxMessages.map((m) => (
                <div key={m.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>{m.subject}</span>
                    <span className="text-stone-400 font-normal">{m.timestamp}</span>
                  </div>
                  <p className="text-stone-600 mt-1">{m.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
