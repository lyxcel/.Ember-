import React, { useState } from 'react';
import { Sparkles, ArrowRight, X, Check } from 'lucide-react';

export interface TutorialStep {
  title: string;
  description: string;
  targetHint: string;
}

interface InteractiveTutorialProps {
  isOpen: boolean;
  role: 'customer' | 'chef';
  onClose: () => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  isOpen,
  role,
  onClose,
}) => {
  if (!isOpen) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const customerSteps: TutorialStep[] = [
    {
      title: '🌐 Multi-Restaurant Discovery',
      description:
        'Use the top location bar to choose All World, Tanzania, Kenya, Uganda or specific city wards like Posta, Kariakoo, or Sinza to find kitchens close to your office.',
      targetHint: 'Explore 100+ East African and global kitchens at your fingertips.',
    },
    {
      title: '⏱️ 2.3s Auto-Rotating Real Food Photos',
      description:
        'Every dish card automatically scrolls through 2 authentic real food photos every 2.3 seconds. You can also swipe or tap arrows to view them manually.',
      targetHint: 'Live plate numbers show exactly how many servings are left today.',
    },
    {
      title: '🧡 Orange Plus (+) Button',
      description:
        'Click the orange plus button on any food card to slide up the Order Panel. It locks your plate count immediately before payment.',
      targetHint: 'Office diners with an account get their floor and desk pre-filled.',
    },
    {
      title: '💳 Lipa Namba & Selcom Mobile Money',
      description:
        'Choose Cash or pay via Selcom (Airtel, Vodacom, Halotel, Yas) or Lipa Namba with QR code. Caution: Always wait until food reaches your door before paying!',
      targetHint: 'Group Lunch button lets your whole team order into one delivery box.',
    },
  ];

  const chefSteps: TutorialStep[] = [
    {
      title: '👀 "View as Customer" Mode Switcher',
      description:
        'As a Chef, use the top switcher to inspect exactly how your menu, prices, and available plates look to office diners, then return here anytime.',
      targetHint: 'Customers can never see your private admin portal.',
    },
    {
      title: '🍳 Instant Live Plates Adjuster (+ / -)',
      description:
        'When a walk-in or phone customer orders offline, tap the minus (-) button on that dish. The plates counter drops immediately on all customers screens.',
      targetHint: 'Keep your digital diners updated without answering distracting calls.',
    },
    {
      title: '⏰ 24-Hour Serving Windows',
      description:
        'Set Breakfast, Lunch, or Dinner serving hours using standard 24h format. Choose whether dishes appear all day or automatically disappear outside hours.',
      targetHint: 'Customizable according to your kitchen schedule.',
    },
    {
      title: '💰 Balances & Payment Channel Control',
      description:
        'Track Lipa Namba till balances, Selcom transfers, and cash collected. Easily toggle channels off if they are inactive for the day.',
      targetHint: 'Enable monthly subscription passes or festive Ramadhan & Christmas glows in "Features".',
    },
  ];

  const steps = role === 'chef' ? chefSteps : customerSteps;
  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* YouTube-style Tutorial Floating Card */}
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 flex flex-col gap-4 relative animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Top Header with Step indicator and Skip button */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-600" />
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-stone-400 hover:text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Skip Tour</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tutorial Content */}
        <div className="space-y-2 py-1">
          <h3 className="text-base font-extrabold text-stone-900 font-display">
            {currentStep.title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-2xl text-[11px] text-stone-500 italic mt-2">
            {currentStep.targetHint}
          </div>
        </div>

        {/* Step dots & Next / Finish button */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStepIndex
                    ? 'w-6 bg-orange-500'
                    : 'w-1.5 bg-stone-200'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Got it!' : 'Next'}</span>
            {currentStepIndex === steps.length - 1 ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
