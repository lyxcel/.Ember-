import React, { useState } from 'react';
import { X, HelpCircle, Phone, MessageSquare, ChevronDown, Check } from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does live plate inventory work?',
      a: 'Whenever you click "Send Order", our platform locks the available plate count immediately. Even if your order is still being prepared or awaiting cash handover, other users will see the reduced inventory count.',
    },
    {
      q: 'Can I order without creating an account?',
      a: 'Yes! Guest ordering is completely open. Just provide your contact name and specific office building, floor, and room so the chef\'s delivery runner reaches your desk without confusion.',
    },
    {
      q: 'Why does .EMBER caution me not to pay before delivery?',
      a: 'To protect you from delays! We advise diners to keep their Selcom or Lipa Namba ready, inspect their warm meal upon arrival at the office door, and then perform the 1-click mobile money transfer.',
    },
    {
      q: 'How does Selcom and Lipa Namba payment work?',
      a: 'If you choose Lipa Namba, scan the QR code or copy the Merchant Till number and confirm the Chef\'s registered name in CAPITAL LETTERS. If you choose Selcom, select your network (Vodacom, Airtel, Halotel, Yas) and transfer to the Chef\'s agent code.',
    },
    {
      q: 'What is the Group Office Lunch Pool?',
      a: 'Inspired by Uber Eats group ordering, you can share a group link with your floor colleagues so everyone adds their meal to a single runner delivery. This waives individual delivery charges.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 flex flex-col gap-4 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-900 font-display">Help Center & Support</h2>
              <p className="text-xs text-stone-500">Frequently Asked Questions & Immediate Assistance</p>
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

        {/* FAQs */}
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-3.5 text-left font-bold text-stone-800 bg-stone-50/50 hover:bg-stone-50 flex items-center justify-between gap-2 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    expandedFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFaq === idx && (
                <div className="p-3.5 pt-1 text-stone-600 bg-white border-t border-stone-100 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Direct Contact Options */}
        <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-orange-600" />
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">Emergency Delivery Dispatch:</span>
              <span className="text-stone-600">+255 754 889 900 (Dar es Salaam / East Africa)</span>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Active Now
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Close Help Center
        </button>
      </div>
    </div>
  );
};
