import React, { useState } from 'react';
import { Users, Copy, Check, Share2, X, Building, Sparkles } from 'lucide-react';

interface GroupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupOrderModal: React.FC<GroupOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [officeName, setOfficeName] = useState('Uhuru Height Legal Floor 4');
  const [roomCode, setRoomCode] = useState('UHURU-FL4-LUNCH');
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://ember.eats/group/${roomCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900 font-display">
                Group Office Lunch Pool (Uber Eats Style)
              </h3>
              <p className="text-xs text-stone-500">
                Colleagues on the same floor order together in one delivery box.
              </p>
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

        {/* Perks banner */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-950">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Zero Delivery Fee & Instant Handover:</strong> When 3 or more office mates order together, the delivery surcharge is completely waived and the food arrives organized by colleague name!
          </span>
        </div>

        {/* Office Details */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Office Floor Group Name:
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Invite Code for Floor Colleagues:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={roomCode}
                className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-stone-100 border border-stone-300 rounded-xl text-orange-600"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active group participants preview */}
        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Current Floor Pool (3 Colleagues joined)
          </span>
          <div className="space-y-1.5 text-xs text-stone-700">
            <div className="flex justify-between font-medium">
              <span>👤 Johnson Daudi (Desk 12)</span>
              <span className="font-bold text-stone-900">Ugali Samaki (2 plates)</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>👤 Amina Kassim (Desk 15)</span>
              <span className="font-bold text-stone-900">Pilau ya Nyama (1 plate)</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>👤 Erick Mallya (Desk 08)</span>
              <span className="font-bold text-stone-900">Avocado Salad (1 plate)</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Close & Continue Browsing Menu
        </button>
      </div>
    </div>
  );
};
