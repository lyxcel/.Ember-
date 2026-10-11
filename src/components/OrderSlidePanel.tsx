import React, { useState, useEffect } from 'react';
import { FoodItem, Restaurant, User, PaymentMethod, SelcomProvider, Order } from '../types';
import {
  X,
  Plus,
  Minus,
  CheckCircle2,
  Copy,
  AlertTriangle,
  Building,
  Phone,
  User as UserIcon,
  QrCode,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../services/audio';

interface OrderSlidePanelProps {
  isOpen: boolean;
  food: FoodItem | null;
  restaurant: Restaurant | null;
  currentUser: User | null;
  onClose: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const OrderSlidePanel: React.FC<OrderSlidePanelProps> = ({
  isOpen,
  food,
  restaurant,
  currentUser,
  onClose,
  onOrderPlaced,
}) => {
  if (!isOpen || !food || !restaurant) return null;

  // Order state
  const [platesCount, setPlatesCount] = useState<number>(1);
  const [buyerName, setBuyerName] = useState<string>('');
  const [officeLocation, setOfficeLocation] = useState<string>('');
  const [buyerPhone, setBuyerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [selcomProvider, setSelcomProvider] = useState<SelcomProvider>('vodacom');
  const [isDigitalPaid, setIsDigitalPaid] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{ name?: string; location?: string; phone?: string }>({});

  // Populate prefilled defaults for logged in user or reset
  useEffect(() => {
    if (currentUser) {
      setBuyerName(currentUser.name || '');
      setBuyerPhone(currentUser.phone || '');
      setOfficeLocation(currentUser.constantLocation || '');
    } else {
      setBuyerName('');
      setBuyerPhone('');
      setOfficeLocation('');
    }
    setPlatesCount(1);
    setPaymentMethod('cash');
    setIsDigitalPaid(false);
    setErrors({});
  }, [currentUser, food]);

  const unitPrice = food.price;
  const totalPrice = unitPrice * platesCount;

  // Quantity handlers
  const handleIncreasePlates = () => {
    if (platesCount < food.platesAvailable) {
      soundFx.playTick();
      setPlatesCount((prev) => prev + 1);
    }
  };

  const handleDecreasePlates = () => {
    if (platesCount > 1) {
      soundFx.playTick();
      setPlatesCount((prev) => prev - 1);
    }
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const validateForm = () => {
    const newErrors: { name?: string; location?: string; phone?: string } = {};
    if (!buyerName.trim()) {
      newErrors.name = 'Please provide contact person name (for office runner).';
    }
    if (!officeLocation.trim()) {
      newErrors.location = 'Specify office tower, floor & office room name.';
    }
    if (!buyerPhone.trim()) {
      newErrors.phone = 'Phone number is required for floor arrival call.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOrder = () => {
    if (!validateForm()) return;

    const orderId = `ord-${Date.now().toString(36)}`;
    const orderNumber = `EMB-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      customerId: currentUser?.id,
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      officeLocation: officeLocation.trim(),
      items: [
        {
          foodId: food.id,
          foodName: food.name,
          unitPrice: food.price,
          platesCount,
        },
      ],
      totalPlates: platesCount,
      totalAmount: totalPrice,
      paymentMethod,
      selcomProvider: paymentMethod === 'selcom' ? selcomProvider : undefined,
      isPaidDigitally: paymentMethod !== 'cash' && isDigitalPaid,
      paidAt: isDigitalPaid ? new Date().toISOString() : undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      notes: notes.trim(),
      alertCount: 0,
    };

    soundFx.playOrderPlaced();
    onOrderPlaced(newOrder);
    onClose();
  };

  const paymentChannels = restaurant.paymentChannels;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Sliding Drawer Container with Responsive Breakpoints */}
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-orange-200 animate-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <img
              src={food.images[0]}
              alt={food.name}
              className="w-14 h-14 rounded-xl object-cover border border-stone-200"
            />
            <div>
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                {restaurant.name}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900 leading-tight">
                {food.name}
              </h2>
              <p className="text-xs text-stone-500">
                {food.price.toLocaleString()} {food.currency} / plate ·{' '}
                <span className="text-emerald-700 font-semibold">{food.platesAvailable} available</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close order panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body with 2-Column Responsive Grid on Tablet / Laptop */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Column: Office Delivery Details (6 cols on tablet/laptop) */}
            <div className="md:col-span-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-orange-600" /> Office Handover Details
                </h3>
                {currentUser && (
                  <span className="text-[11px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                    Auto-filled from profile
                  </span>
                )}
              </div>

              {/* Notice for Guest Users */}
              {!currentUser && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Ordering as a Guest. Please write your office floor & desk so the chef's runner finds you immediately.
                  </span>
                </div>
              )}

              {/* Buyer Contact Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Name of Calling / Recipient at the Door *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Johnson Daudi (Legal Dept)"
                    className={`w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.name ? 'border-rose-400 ring-rose-200' : 'border-stone-300'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
              </div>

              {/* Office Location & Floor */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Office Tower, Floor & Room *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    placeholder="e.g. UHURU HEIGHT Apartments/Offices, Floor 4, Lawyers Office Room 402"
                    className={`w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.location ? 'border-rose-400 ring-rose-200' : 'border-stone-300'
                    }`}
                  />
                </div>
                {errors.location && <p className="text-xs text-rose-600 mt-1">{errors.location}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number for Arrival Call *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="e.g. +255 712 345 678"
                    className={`w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.phone ? 'border-rose-400 ring-rose-200' : 'border-stone-300'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Special Notes for Chef (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra pilipili mbuzi, separate gravy"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Right Column: Quantity & Payment Methods (6 cols on tablet/laptop) */}
            <div className="md:col-span-6 flex flex-col gap-4">
              {/* Quantity Plates Stepper & Price Calculation */}
              <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-700 block">Number of Plates</span>
                  <span className="text-xs text-stone-500">Live inventory locked on order</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDecreasePlates}
                    disabled={platesCount <= 1}
                    className="w-8 h-8 rounded-lg bg-white border border-orange-300 text-stone-800 flex items-center justify-center disabled:opacity-40 hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="text-base font-extrabold text-stone-900 w-8 text-center">
                    {platesCount}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncreasePlates}
                    disabled={platesCount >= food.platesAvailable}
                    className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-900 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Cash Option */}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      setPaymentMethod('cash');
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-orange-500 bg-orange-500/10 text-stone-900 ring-2 ring-orange-500/20'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xs font-bold">💵 Cash</span>
                    <span className="text-[11px] text-stone-500 mt-1">Pay at Desk</span>
                  </button>

                  {/* Lipa Namba Option */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!paymentChannels.lipaNambaActive) return;
                      soundFx.playTick();
                      setPaymentMethod('lipa_namba');
                    }}
                    disabled={!paymentChannels.lipaNambaActive}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      !paymentChannels.lipaNambaActive
                        ? 'opacity-50 border-stone-200 bg-stone-100 cursor-not-allowed'
                        : paymentMethod === 'lipa_namba'
                        ? 'border-orange-500 bg-orange-500/10 text-stone-900 ring-2 ring-orange-500/20'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xs font-bold">📱 Lipa Namba</span>
                    <span className="text-[10px] text-stone-500 mt-1">
                      {paymentChannels.lipaNambaActive ? 'Till / Agent QR' : 'Inactive today'}
                    </span>
                  </button>

                  {/* Selcom Option */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!paymentChannels.selcomActive) return;
                      soundFx.playTick();
                      setPaymentMethod('selcom');
                    }}
                    disabled={!paymentChannels.selcomActive}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      !paymentChannels.selcomActive
                        ? 'opacity-50 border-stone-200 bg-stone-100 cursor-not-allowed'
                        : paymentMethod === 'selcom'
                        ? 'border-orange-500 bg-orange-500/10 text-stone-900 ring-2 ring-orange-500/20'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-xs font-bold">⚡ Selcom Pay</span>
                    <span className="text-[10px] text-stone-500 mt-1">
                      {paymentChannels.selcomActive ? 'Mobile Money' : 'Inactive today'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Digital Payment Details Panels */}
              {paymentMethod === 'lipa_namba' && (
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col gap-3 animate-in fade-in">
                  <div className="flex items-start gap-3">
                    {/* QR Code */}
                    <div className="w-20 h-20 bg-white p-1 rounded-xl border border-stone-200 shrink-0 flex items-center justify-center">
                      {paymentChannels.lipaNambaQrUrl ? (
                        <img
                          src={paymentChannels.lipaNambaQrUrl}
                          alt="Lipa Namba QR"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <QrCode className="w-12 h-12 text-stone-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-stone-400 uppercase">
                        MERCHANT TILL NUMBER (LIPA NAMBA)
                      </div>
                      <div className="text-sm font-extrabold text-stone-900 uppercase">
                        {paymentChannels.lipaNambaName}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-mono font-bold text-base text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-md">
                          {paymentChannels.lipaNambaNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(paymentChannels.lipaNambaNumber, 'lipa')}
                          className="text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'lipa' ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Caution banner required by prompt */}
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold">
                      Caution: Don't pay until food is delivered to your office door.
                    </span>
                  </div>

                  {/* User Paid in Advance Checkbox (Triggers 5-min alert chime to chef) */}
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isDigitalPaid}
                      onChange={(e) => setIsDigitalPaid(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
                    />
                    <span>I already initiated payment via Lipa Namba right now</span>
                  </label>
                </div>
              )}

              {paymentMethod === 'selcom' && (
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col gap-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Choose Mobile Money Provider:
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelcomProvider('vodacom')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border cursor-pointer ${
                          selcomProvider === 'vodacom'
                            ? 'bg-red-600 text-white border-red-600'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        Vodacom
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelcomProvider('airtel')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border cursor-pointer ${
                          selcomProvider === 'airtel'
                            ? 'bg-rose-700 text-white border-rose-700'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        Airtel
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelcomProvider('halotel')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border cursor-pointer ${
                          selcomProvider === 'halotel'
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        Halotel
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelcomProvider('mix_by_yas')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border cursor-pointer ${
                          selcomProvider === 'mix_by_yas'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        Mix by Yas
                      </button>
                    </div>
                  </div>

                  {/* Chef's Selcom Agent / Merchant Number shown downward with copy button */}
                  <div className="p-3 bg-white border border-stone-200 rounded-xl">
                    <div className="text-[11px] text-stone-400 font-bold uppercase">
                      CHEF'S SELCOM AGENT CODE / NUMBER:
                    </div>
                    <div className="text-xs font-bold text-stone-800 uppercase mt-0.5">
                      {paymentChannels.selcomMerchantName}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono font-extrabold text-base text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                        {paymentChannels.selcomAgentNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(paymentChannels.selcomAgentNumber, 'selcom')}
                        className="text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 px-3 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'selcom' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Code
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Caution note */}
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-amber-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Caution: Don't pay until food is delivered to your desk or office door.
                    </span>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isDigitalPaid}
                      onChange={(e) => setIsDigitalPaid(e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded-sm focus:ring-orange-500"
                    />
                    <span>I already completed transfer via Selcom agent</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Bar: Total Price & "Send Order" Button in Orange Background */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-baseline justify-between sm:justify-start w-full sm:w-auto gap-3">
            <div>
              <span className="text-xs text-stone-500 block">Total Due ({platesCount} {platesCount > 1 ? 'plates' : 'plate'})</span>
              <span className="text-xl sm:text-2xl font-black text-stone-900">
                {totalPrice.toLocaleString()} <span className="text-sm font-bold text-orange-600">{food.currency}</span>
              </span>
            </div>
            <span className="text-xs text-stone-400">· Free desk delivery</span>
          </div>

          <button
            type="button"
            onClick={handleSendOrder}
            className="w-full sm:w-auto min-w-[220px] px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Send Order
          </button>
        </div>
      </div>
    </div>
  );
};
