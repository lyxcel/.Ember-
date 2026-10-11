import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import {
  COUNTRIES,
  CITIES_BY_COUNTRY,
  WARDS_BY_CITY,
} from '../data/mockData';
import { MealPeriod } from '../types';

interface LocationFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCountry: string; // 'ALL' or country name
  setSelectedCountry: (c: string) => void;
  selectedCity: string; // 'ALL' or city name
  setSelectedCity: (c: string) => void;
  selectedWard: string; // 'ALL' or ward name
  setSelectedWard: (w: string) => void;
  selectedMealPeriod: MealPeriod | 'all';
  setSelectedMealPeriod: (m: MealPeriod | 'all') => void;
  totalCount: number;
}

export const LocationFilterBar: React.FC<LocationFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
  selectedWard,
  setSelectedWard,
  selectedMealPeriod,
  setSelectedMealPeriod,
  totalCount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Available cities given current country selection
  const availableCities =
    selectedCountry === 'ALL'
      ? Object.values(CITIES_BY_COUNTRY).flat()
      : CITIES_BY_COUNTRY[selectedCountry] || [];

  // Available wards given current city selection
  const availableWards =
    selectedCity === 'ALL'
      ? Object.values(WARDS_BY_CITY).flat()
      : WARDS_BY_CITY[selectedCity] || [];

  // Computed summary text for the chevron picker
  const getLocationLabel = () => {
    if (selectedCountry === 'ALL' && selectedCity === 'ALL' && selectedWard === 'ALL') {
      return '🌐 All World';
    }
    const parts = [];
    if (selectedWard !== 'ALL') parts.push(selectedWard);
    if (selectedCity !== 'ALL') parts.push(selectedCity);
    if (selectedCountry !== 'ALL') parts.push(selectedCountry);
    return parts.join(', ');
  };

  return (
    <div className="w-full bg-white border-b border-stone-200/80 shadow-xs py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Location Chevron Selector + Search Bar */}
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Location Dropdown Trigger (Chevron button) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full sm:w-auto h-11 px-3.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between gap-2 border border-stone-300 transition-colors cursor-pointer shrink-0"
              title="Filter by Country, City and Ward"
            >
              <span className="truncate max-w-[200px] text-left">
                {getLocationLabel()}
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Combined Chevron Option Popover */}
            {isDropdownOpen && (
              <div className="absolute top-12 left-0 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-200 p-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900">
                    <SlidersHorizontal className="w-4 h-4 text-orange-600" />
                    <span>Select Delivery Region</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-stone-400 hover:text-stone-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {/* All World Option Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCountry('ALL');
                      setSelectedCity('ALL');
                      setSelectedWard('ALL');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-xs font-bold rounded-xl text-left flex items-center justify-between transition-colors ${
                      selectedCountry === 'ALL'
                        ? 'bg-orange-500 text-white'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <span>🌐 All World (All Regions)</span>
                    {selectedCountry === 'ALL' && <span>✓</span>}
                  </button>

                  {/* Country Select */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                      Country:
                    </label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        setSelectedCountry(e.target.value);
                        setSelectedCity('ALL');
                        setSelectedWard('ALL');
                      }}
                      className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="ALL">🌐 All Countries</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c === 'Tanzania' ? '🇹🇿 Tanzania' : c === 'Kenya' ? '🇰🇪 Kenya' : c === 'Uganda' ? '🇺🇬 Uganda' : '🇷🇼 Rwanda'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Select */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                      City:
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        setSelectedWard('ALL');
                      }}
                      className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="ALL">All Cities in region</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Ward Select */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-500 uppercase mb-1">
                      City Ward / District:
                    </label>
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="ALL">All Wards / Districts</option>
                      {availableWards.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Input for Restaurant Name or Dish */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant name, Nyama Choma, Ugali, Samaki, Posta..."
              className="w-full h-11 pl-10 pr-9 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-stone-900 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Meal Period Filter Buttons & Results Count */}
        <div className="flex items-center justify-between md:justify-end gap-2">
          {/* Functional Segmented Controls (allowed per guidelines) */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedMealPeriod('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMealPeriod === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              All Day
            </button>
            <button
              type="button"
              onClick={() => setSelectedMealPeriod('breakfast')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMealPeriod === 'breakfast'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Breakfast
            </button>
            <button
              type="button"
              onClick={() => setSelectedMealPeriod('lunch')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMealPeriod === 'lunch'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Lunch
            </button>
            <button
              type="button"
              onClick={() => setSelectedMealPeriod('dinner')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMealPeriod === 'dinner'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Dinner
            </button>
          </div>

          <span className="text-xs text-stone-400 hidden sm:inline whitespace-nowrap">
            {totalCount} active items
          </span>
        </div>
      </div>
    </div>
  );
};
