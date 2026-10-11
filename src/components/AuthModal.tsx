import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { DEMO_CHEF, DEMO_CUSTOMER } from '../services/storage';
import {
  X,
  User as UserIcon,
  ChefHat,
  Lock,
  Mail,
  Phone,
  Building,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('customer');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup Customer fields
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPassword, setCustPassword] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custCountry, setCustCountry] = useState('Tanzania');
  const [custOfficeLocation, setCustOfficeLocation] = useState('');

  // Signup Chef fields
  const [chefName, setChefName] = useState('');
  const [chefRestaurantName, setChefRestaurantName] = useState('');
  const [chefEmail, setChefEmail] = useState('');
  const [chefPassword, setChefPassword] = useState('');
  const [chefPhone, setChefPhone] = useState('');
  const [chefCountry, setChefCountry] = useState('Tanzania');
  const [chefCity, setChefCity] = useState('Dar es Salaam');
  const [chefWard, setChefWard] = useState('Posta / CBD');
  const [chefLipaNamba, setChefLipaNamba] = useState('');

  // 1-Click Demo Login helpers
  const handleQuickDemoChef = () => {
    onLoginSuccess(DEMO_CHEF);
    onClose();
  };

  const handleQuickDemoCustomer = () => {
    onLoginSuccess(DEMO_CUSTOMER);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const email = loginEmail.trim().toLowerCase();

    // Check chef email or demo
    if (email === 'chef@ember.co' || email.includes('chef') || email.includes('restaurant')) {
      const chefUser: User = {
        ...DEMO_CHEF,
        email: loginEmail,
      };
      onLoginSuccess(chefUser);
      onClose();
      return;
    }

    if (email) {
      // Normal customer login
      const customerUser: User = {
        id: `user-${Date.now().toString(36)}`,
        name: email.split('@')[0],
        email: loginEmail,
        phone: '+255 712 000 111',
        role: 'customer',
        country: 'Tanzania',
        city: 'Dar es Salaam',
        ward: 'Posta / CBD',
        constantLocation: 'Samora Tower, 4th Floor',
      };
      onLoginSuccess(customerUser);
      onClose();
    } else {
      setLoginError('Please enter a valid email address.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'customer') {
      if (!custName || !custEmail) {
        setLoginError('Please complete your name and email.');
        return;
      }
      const newCustomer: User = {
        id: `user-${Date.now().toString(36)}`,
        name: custName,
        email: custEmail,
        phone: custPhone || '+255 700 000 000',
        role: 'customer',
        country: custCountry,
        constantLocation: custOfficeLocation || undefined,
      };
      onLoginSuccess(newCustomer);
      onClose();
    } else {
      // Chef Sign Up
      if (!chefName || !chefRestaurantName || !chefEmail) {
        setLoginError('Please provide your name, restaurant name, and business email.');
        return;
      }
      const newChef: User = {
        id: `chef-${Date.now().toString(36)}`,
        name: chefName,
        email: chefEmail,
        phone: chefPhone || '+255 754 000 000',
        role: 'chef',
        country: chefCountry,
        city: chefCity,
        ward: chefWard,
        restaurantId: 'rest-flagship-ember',
        constantLocation: `${chefRestaurantName}, ${chefWard}`,
      };
      onLoginSuccess(newChef);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900 font-display">
              {mode === 'login' ? 'Sign In to .EMBER' : 'Create an Account'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {mode === 'login'
                ? 'Chefs enter their restaurant dashboard; office diners get auto-filled orders.'
                : 'Select whether you are ordering meals or managing a restaurant.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch between Sign In & Sign Up */}
        <div className="flex border-b border-stone-100 p-2 bg-stone-50/50 gap-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Quick Demo Credentials Box */}
        <div className="p-3 mx-4 mt-3 bg-orange-50/60 border border-orange-200 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Instant Demo Access (No password required)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoChef}
              className="py-2 px-2.5 bg-white hover:bg-orange-100 text-orange-900 border border-orange-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChefHat className="w-3.5 h-3.5 text-orange-600" />
              <span>Chef / Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              className="py-2 px-2.5 bg-white hover:bg-stone-100 text-stone-900 border border-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-stone-600" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {loginError && (
            <div className="p-2.5 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {loginError}
            </div>
          )}

          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. chef@ember.co or daudi@lawfirm.co"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Tip: Logging in with a chef email goes directly to the Chef Admin Dashboard!
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl transition-colors shadow-md shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Signup Form with Customer vs Chef Role Selector */
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Account Type:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      role === 'customer'
                        ? 'border-orange-500 bg-orange-500/10 text-stone-900 ring-2 ring-orange-500/20'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <UserIcon className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="text-xs font-bold">Office Diner</div>
                      <div className="text-[10px] text-stone-500">Order to my desk</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('chef')}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      role === 'chef'
                        ? 'border-orange-500 bg-orange-500/10 text-stone-900 ring-2 ring-orange-500/20'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <ChefHat className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="text-xs font-bold">Restaurant / Chef</div>
                      <div className="text-[10px] text-stone-500">Admin dashboard</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Customer specific signup fields */}
              {role === 'customer' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Johnson Daudi"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Office Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="e.g. jdaudi@company.co"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="+255 712 345 678"
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Country
                      </label>
                      <select
                        value={custCountry}
                        onChange={(e) => setCustCountry(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Tanzania">Tanzania</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Rwanda">Rwanda</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Constant Office Location (Words)
                    </label>
                    <input
                      type="text"
                      value={custOfficeLocation}
                      onChange={(e) => setCustOfficeLocation(e.target.value)}
                      placeholder="e.g. UHURU HEIGHT, Floor 2, Legal Dept"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">
                      This will auto-fill your orders panel so you don't have to type it every day!
                    </p>
                  </div>
                </>
              ) : (
                /* Chef specific signup fields */
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Chef / Manager Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={chefName}
                      onChange={(e) => setChefName(e.target.value)}
                      placeholder="e.g. Chef Rashid Mkali"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Restaurant / Kitchen Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={chefRestaurantName}
                      onChange={(e) => setChefRestaurantName(e.target.value)}
                      placeholder="e.g. .EMBER Swahili Grill Posta"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={chefEmail}
                      onChange={(e) => setChefEmail(e.target.value)}
                      placeholder="e.g. chef@myrestaurant.co"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Kitchen Phone *
                      </label>
                      <input
                        type="tel"
                        value={chefPhone}
                        onChange={(e) => setChefPhone(e.target.value)}
                        placeholder="+255 754 000 000"
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        City Ward
                      </label>
                      <input
                        type="text"
                        value={chefWard}
                        onChange={(e) => setChefWard(e.target.value)}
                        placeholder="e.g. Posta / CBD"
                        className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Lipa Namba (Till Number) for Digital Payments
                    </label>
                    <input
                      type="text"
                      value={chefLipaNamba}
                      onChange={(e) => setChefLipaNamba(e.target.value)}
                      placeholder="e.g. 6892341"
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl transition-colors shadow-md shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
