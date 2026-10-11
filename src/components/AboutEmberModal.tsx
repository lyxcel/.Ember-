import React from 'react';
import { X, Flame, ShieldCheck, HeartHandshake, Zap, Clock } from 'lucide-react';

interface AboutEmberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutEmberModal: React.FC<AboutEmberModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 flex flex-col gap-5 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900 font-display">About .EMBER</h2>
              <p className="text-xs text-stone-500">The Dedicated Office Dining & Kitchen Platform</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
          <p className="text-sm font-semibold text-stone-800">
            <strong>.EMBER</strong> was built to solve the daily headache of office lunch and breakfast breaks across East Africa and busy metropolitan hubs.
          </p>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 text-xs">No Airtime & Distraction Friction</h4>
                <p className="mt-0.5">
                  Office workers do not need to buy airtime or scramble with phone calls to ask what food is ready. Chefs do not get distracted answering ringing phones while cooking during rush hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Live Plate Inventory Locking</h4>
                <p className="mt-0.5">
                  Every plate ordered digitally locks the inventory immediately. If you change or cancel, the plate restores itself automatically!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-stone-900 text-xs">Doorstep Caution & Digital Mobile Money</h4>
                <p className="mt-0.5">
                  Convenient Selcom Mobile Money and Lipa Namba till options with built-in doorstep safety: <em>"Don't pay until food is delivered."</em>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <span className="font-bold text-stone-900 block mb-1">Color Psychology Discipline</span>
            <p>
              Built following the <strong>60-30-10 color psychology model</strong>: 60% warm crisp neutral foundations for visual clarity, 30% deep slate and charcoal for typography and trust, and 10% high-conversion vivid Orange accentuating appetizing dishes and clear action.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
