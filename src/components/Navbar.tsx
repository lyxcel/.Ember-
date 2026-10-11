import React from 'react';
import { User } from '../types';
import {
  Flame,
  Home,
  UtensilsCrossed,
  Info,
  HelpCircle,
  Users,
  Settings,
  LogIn,
  Eye,
  LayoutDashboard,
  GraduationCap,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'restaurants' | 'about' | 'help';
  setCurrentTab: (tab: 'home' | 'restaurants' | 'about' | 'help') => void;
  currentUser: User | null;
  chefViewMode: 'admin' | 'customer_preview';
  setChefViewMode: (mode: 'admin' | 'customer_preview') => void;
  onOpenAuth: () => void;
  onOpenCustomerSettings: () => void;
  onOpenGroupOrder: () => void;
  onStartTutorial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  chefViewMode,
  setChefViewMode,
  onOpenAuth,
  onOpenCustomerSettings,
  onOpenGroupOrder,
  onStartTutorial,
}) => {
  const isChef = currentUser?.role === 'chef';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Banner if Chef is currently in "View as Customer" Mode */}
      {isChef && chefViewMode === 'customer_preview' && (
        <div className="bg-orange-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>
              Preview Mode: You are viewing .EMBER exactly as your office customers see it.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setChefViewMode('admin')}
            className="bg-white text-orange-700 hover:bg-orange-50 px-2.5 py-0.5 rounded-md font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Return to Chef Dashboard
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Home */}
          <button
            type="button"
            onClick={() => {
              setCurrentTab('home');
              if (isChef && chefViewMode === 'admin') {
                // Stay or keep mode
              }
            }}
            className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentTab === 'home' && (!isChef || chefViewMode === 'customer_preview')
                ? 'text-orange-600 bg-orange-50'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* Restaurants */}
          <button
            type="button"
            onClick={() => setCurrentTab('restaurants')}
            className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentTab === 'restaurants'
                ? 'text-orange-600 bg-orange-50'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Restaurants</span>
          </button>
        </nav>

        {/* Center: Brand Logo (.EMBER in vibrant orange) */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <span className="font-display text-2xl font-black tracking-tight text-orange-600 flex items-baseline">
            .EMBER
            <span className="text-[10px] font-bold text-stone-400 ml-1.5 uppercase tracking-widest hidden md:inline">
              Office Eats
            </span>
          </span>
        </div>

        {/* Right: About, Help, Group Order, and User Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden lg:flex items-center gap-1">
            {/* About .EMBER */}
            <button
              type="button"
              onClick={() => setCurrentTab('about')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                currentTab === 'about'
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About .EMBER</span>
            </button>

            {/* Help Center */}
            <button
              type="button"
              onClick={() => setCurrentTab('help')}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                currentTab === 'help'
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help Center</span>
            </button>
          </nav>

          {/* Uber Eats feature: Group Office Order */}
          <button
            type="button"
            onClick={onOpenGroupOrder}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-xl transition-all cursor-pointer"
            title="Start a Group Office Lunch with Floor Colleagues"
          >
            <Users className="w-3.5 h-3.5 text-amber-700" />
            <span>Group Lunch</span>
          </button>

          {/* Interactive Tutorial Trigger */}
          <button
            type="button"
            onClick={onStartTutorial}
            className="p-2 text-stone-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
            title="Interactive Walkthrough Tutorial"
          >
            <GraduationCap className="w-4 h-4" />
          </button>

          {/* Role-Specific Actions: Chef vs Customer */}
          {isChef ? (
            <div className="flex items-center gap-1.5">
              {chefViewMode === 'admin' ? (
                <button
                  type="button"
                  onClick={() => setChefViewMode('customer_preview')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="View how customers see your menu and orders"
                >
                  <Eye className="w-3.5 h-3.5 text-orange-600" />
                  <span className="hidden sm:inline">View as Customer</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setChefViewMode('admin')}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Chef Dashboard</span>
                </button>
              )}
            </div>
          ) : currentUser ? (
            // Customer is signed in
            <button
              type="button"
              onClick={onOpenCustomerSettings}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-stone-200 hover:border-orange-300 bg-white hover:bg-orange-50/50 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                {currentUser.profilePic ? (
                  <img src={currentUser.profilePic} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <span className="text-xs font-bold text-stone-800 max-w-[90px] truncate hidden sm:inline">
                {currentUser.name}
              </span>
              <Settings className="w-3.5 h-3.5 text-stone-400" />
            </button>
          ) : (
            // Guest / Not signed in
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
