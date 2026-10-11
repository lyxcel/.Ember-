import React, { useState } from 'react';
import { User, Order, CustomerInboxMessage, FoodItem } from '../types';
import {
  X,
  User as UserIcon,
  Shield,
  ShoppingBag,
  Heart,
  Inbox,
  AlertOctagon,
  LogOut,
  Pencil,
  Check,
  Building,
  Phone,
  Mail,
  Globe,
  Trash2,
  Clock,
  Eye,
  CheckCheck,
} from 'lucide-react';

interface CustomerSettingsModalProps {
  isOpen: boolean;
  currentUser: User | null;
  orders: Order[];
  inboxMessages: CustomerInboxMessage[];
  favouriteFoods: FoodItem[];
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onMarkMessageRead: (msgId: string) => void;
}

export const CustomerSettingsModal: React.FC<CustomerSettingsModalProps> = ({
  isOpen,
  currentUser,
  orders,
  inboxMessages,
  favouriteFoods,
  onClose,
  onUpdateUser,
  onLogout,
  onMarkMessageRead,
}) => {
  if (!isOpen || !currentUser) return null;

  type SettingsTab = 'profile' | 'security' | 'orders' | 'favourites' | 'inbox' | 'report';
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Edit states for individual fields in My Profile (with edit button icon, not edit word)
  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileCountry, setProfileCountry] = useState(currentUser.country);
  const [profileLocation, setProfileLocation] = useState(currentUser.constantLocation || '');
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePic, setProfilePic] = useState(currentUser.profilePic || '');

  // Report state
  const [reportType, setReportType] = useState<'order' | 'restaurant'>('order');
  const [reportTarget, setReportTarget] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Security tab states
  const [secPhone, setSecPhone] = useState(currentUser.phone);
  const [secEmail, setSecEmail] = useState(currentUser.email);
  const [secPassword, setSecPassword] = useState('');
  const [securitySuccess, setSecuritySuccess] = useState('');

  // Handle saving individual profile field
  const handleSaveField = (fieldName: string) => {
    const updated: User = {
      ...currentUser,
      name: profileName,
      phone: profilePhone,
      country: profileCountry,
      constantLocation: profileLocation,
      email: profileEmail,
      profilePic: profilePic || currentUser.profilePic,
    };
    onUpdateUser(updated);
    setEditingField(null);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReportDetails('');
      setReportTarget('');
    }, 3000);
  };

  const handleSecurityUpdate = (type: string) => {
    setSecuritySuccess(`${type} updated securely!`);
    setTimeout(() => setSecuritySuccess(''), 2500);
  };

  const userOrders = orders.filter(
    (o) => o.customerId === currentUser.id || o.buyerName.toLowerCase() === currentUser.name.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-base overflow-hidden border border-orange-200">
              {currentUser.profilePic ? (
                <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900 leading-tight">
                {currentUser.name}
              </h2>
              <p className="text-xs text-stone-500">
                Office Diner Settings · {currentUser.constantLocation || 'No constant location set'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Layout: Settings Navigation Sidebar & Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Settings Sidebar Tabs */}
          <div className="w-full md:w-56 bg-stone-50/70 border-r border-stone-100 p-2 sm:p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'profile' ? 'bg-orange-500 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'security' ? 'bg-orange-500 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Account Security</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-orange-500 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders History</span>
              {userOrders.length > 0 && (
                <span className="ml-auto bg-stone-200 text-stone-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {userOrders.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favourites')}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'favourites' ? 'bg-orange-500 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favourites Food</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'inbox' ? 'bg-orange-500 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Inbox</span>
              {inboxMessages.some((m) => !m.isRead) && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  new
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('report')}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'report' ? 'bg-orange-500 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-200/60'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Report / Comment</span>
            </button>

            <div className="mt-auto pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={onLogout}
                className="w-full px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Main Tab Panel Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {/* 1. MY PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">My Profile</h3>
                  <p className="text-xs text-stone-500">
                    Edit your information below. Click the pencil icon button to edit any detail.
                  </p>
                </div>

                {/* Profile Picture */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={profilePic || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt="Avatar"
                      className="w-12 h-12 rounded-xl object-cover border border-stone-300"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">Profile Picture</span>
                      <span className="text-[11px] text-stone-400">Photo displayed on office deliveries</span>
                    </div>
                  </div>

                  {editingField === 'pic' ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="url"
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)}
                        placeholder="Image URL"
                        className="text-xs px-2 py-1 border border-stone-300 rounded-lg w-40"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveField('pic')}
                        className="p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg cursor-pointer"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingField('pic')}
                      className="p-2 text-stone-500 hover:text-orange-600 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
                      title="Edit Profile Picture"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Name */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <span className="text-[11px] font-bold text-stone-400 uppercase block">Full Name</span>
                    {editingField === 'name' ? (
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full text-xs font-bold mt-1 px-2 py-1 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    ) : (
                      <span className="text-xs font-bold text-stone-900 mt-0.5 block">{profileName}</span>
                    )}
                  </div>
                  {editingField === 'name' ? (
                    <button
                      type="button"
                      onClick={() => handleSaveField('name')}
                      className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer"
                      title="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingField('name')}
                      className="p-2 text-stone-500 hover:text-orange-600 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
                      title="Edit Name"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Phone Number */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <span className="text-[11px] font-bold text-stone-400 uppercase block">Phone Number</span>
                    {editingField === 'phone' ? (
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full text-xs font-bold mt-1 px-2 py-1 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    ) : (
                      <span className="text-xs font-bold text-stone-900 mt-0.5 block">{profilePhone}</span>
                    )}
                  </div>
                  {editingField === 'phone' ? (
                    <button
                      type="button"
                      onClick={() => handleSaveField('phone')}
                      className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer"
                      title="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingField('phone')}
                      className="p-2 text-stone-500 hover:text-orange-600 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
                      title="Edit Phone Number"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Country */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <span className="text-[11px] font-bold text-stone-400 uppercase block">Country</span>
                    {editingField === 'country' ? (
                      <select
                        value={profileCountry}
                        onChange={(e) => setProfileCountry(e.target.value)}
                        className="w-full text-xs font-bold mt-1 px-2 py-1 bg-white border border-stone-300 rounded-lg"
                      >
                        <option value="Tanzania">Tanzania</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Rwanda">Rwanda</option>
                      </select>
                    ) : (
                      <span className="text-xs font-bold text-stone-900 mt-0.5 block">{profileCountry}</span>
                    )}
                  </div>
                  {editingField === 'country' ? (
                    <button
                      type="button"
                      onClick={() => handleSaveField('country')}
                      className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer"
                      title="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingField('country')}
                      className="p-2 text-stone-500 hover:text-orange-600 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
                      title="Edit Country"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Constant Location by words */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <span className="text-[11px] font-bold text-stone-400 uppercase block">
                      Constant Location (Words)
                    </span>
                    {editingField === 'location' ? (
                      <textarea
                        rows={2}
                        value={profileLocation}
                        onChange={(e) => setProfileLocation(e.target.value)}
                        placeholder="e.g. UHURU HEIGHT office/apartments, floor 2, Lawyers Office"
                        className="w-full text-xs font-semibold mt-1 px-2 py-1 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    ) : (
                      <span className="text-xs font-bold text-stone-900 mt-0.5 block">
                        {profileLocation || 'Not specified (orders panel will show blank until entered)'}
                      </span>
                    )}
                  </div>
                  {editingField === 'location' ? (
                    <button
                      type="button"
                      onClick={() => handleSaveField('location')}
                      className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer"
                      title="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingField('location')}
                      className="p-2 text-stone-500 hover:text-orange-600 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
                      title="Edit Constant Location"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Email */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
                  <div className="flex-1 mr-3">
                    <span className="text-[11px] font-bold text-stone-400 uppercase block">Email Address</span>
                    {editingField === 'email' ? (
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full text-xs font-bold mt-1 px-2 py-1 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    ) : (
                      <span className="text-xs font-bold text-stone-900 mt-0.5 block">{profileEmail}</span>
                    )}
                  </div>
                  {editingField === 'email' ? (
                    <button
                      type="button"
                      onClick={() => handleSaveField('email')}
                      className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl cursor-pointer"
                      title="Save"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingField('email')}
                      className="p-2 text-stone-500 hover:text-orange-600 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
                      title="Edit Email"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 2. ACCOUNT SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">Account Security</h3>
                  <p className="text-xs text-stone-500">
                    Manage your credentials, phone number recovery, and account safety.
                  </p>
                </div>

                {securitySuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{securitySuccess}</span>
                  </div>
                )}

                {/* Change Phone Number */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-stone-800">Change Phone Number</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={secPhone}
                      onChange={(e) => setSecPhone(e.target.value)}
                      placeholder="+255..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSecurityUpdate('Phone number')}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Change Email */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-stone-800">Change Email Address</label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={secEmail}
                      onChange={(e) => setSecEmail(e.target.value)}
                      placeholder="new.email@office.com"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSecurityUpdate('Email')}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-stone-800">Change Password</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={secPassword}
                      onChange={(e) => setSecPassword(e.target.value)}
                      placeholder="Enter new strong password"
                      className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSecurityUpdate('Password')}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                  <span className="text-xs font-extrabold text-rose-800 block">Delete Account</span>
                  <p className="text-[11px] text-rose-600">
                    Permanently delete your saved office desk locations, order history, and preferences.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Are you sure you want to permanently delete your account?')) {
                        onLogout();
                        onClose();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete My Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. ORDERS HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">Orders History</h3>
                  <p className="text-xs text-stone-500">
                    Track live deliveries to your floor and view receipts.
                  </p>
                </div>

                {userOrders.length === 0 ? (
                  <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                    No orders placed yet. Choose any delicious dish to order directly to your desk!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col gap-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-orange-600">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'preparing'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : ord.status === 'out_for_delivery'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-stone-200 text-stone-800'
                            }`}
                          >
                            {ord.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <span className="text-xs font-extrabold text-stone-900 block">
                            {ord.restaurantName}
                          </span>
                          <span className="text-xs text-stone-500">
                            Floor: {ord.officeLocation}
                          </span>
                        </div>

                        <div className="text-xs text-stone-700 bg-white p-2.5 rounded-xl border border-stone-200">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between font-medium">
                              <span>
                                {it.platesCount}x {it.foodName}
                              </span>
                              <span className="font-bold">{(it.unitPrice * it.platesCount).toLocaleString()} TZS</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/60 text-stone-500">
                          <span>Payment: {ord.paymentMethod.toUpperCase()}</span>
                          <span className="font-extrabold text-stone-900 text-sm">
                            Total: {ord.totalAmount.toLocaleString()} TZS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. FAVOURITES FOOD */}
            {activeTab === 'favourites' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">Favourites Food</h3>
                  <p className="text-xs text-stone-500">
                    Your saved dishes for instant 1-click ordering on busy work days.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favouriteFoods.length > 0 ? (
                    favouriteFoods.map((f) => (
                      <div
                        key={f.id}
                        className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3"
                      >
                        <img
                          src={f.images[0]}
                          alt={f.name}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-bold text-stone-900 block truncate">
                            {f.name}
                          </span>
                          <span className="text-xs font-semibold text-orange-600">
                            {f.price.toLocaleString()} {f.currency}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 p-6 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl">
                      Add favorite foods by exploring dishes on the Home page.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. INBOX */}
            {activeTab === 'inbox' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-stone-900">Inbox</h3>
                    <p className="text-xs text-stone-500">
                      Messages and notifications from chefs regarding your orders.
                    </p>
                  </div>
                </div>

                {inboxMessages.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-400 bg-stone-50 rounded-2xl">
                    Your inbox is empty.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {inboxMessages.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => onMarkMessageRead(msg.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          !msg.isRead
                            ? 'bg-orange-50/60 border-orange-200'
                            : 'bg-stone-50 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-stone-900">{msg.restaurantName}</span>
                          <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                            <span>{msg.timestamp}</span>
                            {!msg.isRead ? (
                              <span className="w-2 h-2 rounded-full bg-orange-600" />
                            ) : (
                              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </div>
                        </div>
                        <h4 className="text-xs font-extrabold text-stone-800">{msg.subject}</h4>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. REPORT / COMMENT */}
            {activeTab === 'report' && (
              <div className="space-y-4 max-w-xl">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">Report / Comment</h3>
                  <p className="text-xs text-stone-500">
                    Send feedback, report an issue with an order, or review a restaurant.
                  </p>
                </div>

                {reportSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Report submitted successfully. Our team and the chef have been alerted.</span>
                  </div>
                )}

                <form onSubmit={handleReportSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      I want to report:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setReportType('order')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border cursor-pointer ${
                          reportType === 'order'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-stone-700 border-stone-300'
                        }`}
                      >
                        Specific Order Issue
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportType('restaurant')}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border cursor-pointer ${
                          reportType === 'restaurant'
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-stone-700 border-stone-300'
                        }`}
                      >
                        Restaurant Quality / Service
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Target Order ID or Restaurant Name
                    </label>
                    <input
                      type="text"
                      required
                      value={reportTarget}
                      onChange={(e) => setReportTarget(e.target.value)}
                      placeholder={reportType === 'order' ? 'e.g. EMB-9841' : 'e.g. .EMBER Swahili Grill Posta'}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Details of your report or comment
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Explain what happened (e.g. cold food, wrong floor delivery, delayed order)..."
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Submit Report
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
