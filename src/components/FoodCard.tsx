import React, { useState, useEffect } from 'react';
import { FoodItem, Restaurant } from '../types';
import { Star, ChevronLeft, ChevronRight, Plus, Clock, Flame } from 'lucide-react';
import { soundFx } from '../services/audio';

interface FoodCardProps {
  food: FoodItem;
  restaurant?: Restaurant;
  onOpenOrderPanel: (food: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  restaurant,
  onOpenOrderPanel,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Requirement: Automatic scroll every 2.3 seconds, user can scroll back manually
  useEffect(() => {
    if (isHovered) return; // pause auto-rotation when user is interacting

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 2300); // exactly 2.3 seconds as specified

    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const isSoldOut = food.platesAvailable <= 0;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 hover:border-orange-200 transition-all duration-200 hover:shadow-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 2-Image Carousel with 2.3s Auto-Scroll & Manual Arrows */}
      <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden">
        <img
          src={food.images[currentImageIndex]}
          alt={food.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          loading="lazy"
        />

        {/* Manual navigation arrows */}
        <button
          type="button"
          onClick={handlePrevImage}
          aria-label="Previous image"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNextImage}
          aria-label="Next image"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 2-dot indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-y-0 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              currentImageIndex === 0 ? 'bg-orange-500 w-3.5' : 'bg-white/70'
            }`}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              currentImageIndex === 1 ? 'bg-orange-500 w-3.5' : 'bg-white/70'
            }`}
          />
        </div>

        {/* Meal Tag & Popularity */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md uppercase tracking-wider">
            {food.mealPeriod}
          </span>
          {food.isPopular && (
            <span className="bg-orange-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
              <Flame className="w-3 h-3 fill-white" /> Office Favorite
            </span>
          )}
        </div>

        {/* Live Plate Count Badge */}
        <div className="absolute top-2 right-2">
          {isSoldOut ? (
            <span className="bg-rose-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md shadow-xs">
              Sold Out
            </span>
          ) : (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md shadow-xs ${
                food.platesAvailable <= 5
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {food.platesAvailable} plates left
            </span>
          )}
        </div>
      </div>

      {/* Content details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Restaurant & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="truncate max-w-[170px] font-medium text-stone-600">
              {restaurant?.name || 'Local Kitchen'}
            </span>
            <span className="flex items-center gap-1 text-stone-700 font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {food.rating.toFixed(1)}
              <span className="text-stone-400 text-[10px]">({food.reviewCount})</span>
            </span>
          </div>

          {/* Dish Name */}
          <h3 className="text-sm font-bold text-stone-900 line-clamp-1 leading-snug group-hover:text-orange-600 transition-colors">
            {food.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {food.description}
          </p>
        </div>

        {/* Prep Time & Bottom Action Row */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-stone-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{restaurant?.deliveryTime || '15-20 min'}</span>
            </div>
            <div className="text-sm font-extrabold text-stone-900 mt-0.5">
              {food.price.toLocaleString()} <span className="text-xs font-semibold text-orange-600">{food.currency}</span>
            </div>
          </div>

          {/* Orange Plus Button opens Order Panel */}
          <button
            type="button"
            disabled={isSoldOut}
            onClick={() => {
              soundFx.playTick();
              onOpenOrderPanel(food);
            }}
            title={isSoldOut ? 'Sold out for today' : 'Add to order'}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
              isSoldOut
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white hover:shadow-orange-200 hover:shadow-md cursor-pointer'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
