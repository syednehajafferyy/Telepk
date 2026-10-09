import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Order } from '../../types/ecommerce';
import { OrderSuccessModal } from './OrderSuccessModal';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Tag,
  AlertCircle,
  Phone,
  Check,
  Smartphone,
  Building,
  MapPin,
  Sparkles,
} from 'lucide-react';

const PAKISTANI_PROVINCES = [
  'Punjab',
  'Sindh',
  'Islamabad Capital Territory',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];

const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Abbottabad',
  'Mardan',
  'Mirpur (AJK)',
  'Muzaffarabad',
];

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    placeOrder,
    setActiveView,
  } = useStore();

  const { customer, isCustomerLoggedIn } = useAuth();

  // Automatic Pakistani Phone Formatter
  const formatPakistaniPhone = (value: string) => {
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('92')) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.length === 0) return '+92 ';
    if (cleaned.length <= 3) return `+92 ${cleaned}`;
    return `+92 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 10)}`;
  };

  const isPhoneValid = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 12 && cleaned.startsWith('923');
  };

  // Form states - Clean defaults for unauthenticated guest checkout
  const [formData, setFormData] = useState({
    fullName: customer?.name || '',
    phone: customer?.phone || '+92 ',
    email: customer?.email || '',
    province: customer?.addresses?.[0]?.province || 'Punjab',
    city: customer?.addresses?.[0]?.city || 'Lahore',
    address: customer?.addresses?.[0]?.address || '',
    postalCode: '54000',
    notes: '',
  });

  // Sync if customer logs in
  React.useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || customer.name,
        phone: prev.phone === '+92 ' || !prev.phone ? customer.phone : prev.phone,
        email: prev.email || customer.email,
        address: prev.address || customer.addresses?.[0]?.address || '',
        city: customer.addresses?.[0]?.city || prev.city,
        province: customer.addresses?.[0]?.province || prev.province,
      }));
    }
  }, [customer]);

  // Pre-selected default payment: Cash on Delivery (COD)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'jazzcash' | 'easypaisa'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Free shipping check (PKR 2,500)
  const FREE_SHIPPING_THRESHOLD = 2500;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.freeShipping;
  const shippingFee = cartSubtotal === 0 ? 0 : isFreeShipping ? 0 : 200;

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = appliedCoupon.discountAmount;
    }
  }

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPakistaniPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please fill out all required shipping fields');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode,
        items: [...cart],
        subtotal: cartSubtotal,
        shippingFee,
        discount: discountAmount,
        total: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
        orderStatus: 'Pending',
        courier: formData.city === 'Karachi' ? 'TCS Express' : 'Trax Logistics',
        estimatedDelivery: '2-3 Business Days',
        notes: formData.notes,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }

      setIsSubmitting(false);
      setConfirmedOrder(order);
    }, 600);
  };

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => setActiveView('storefront')}
          style={{ backgroundColor: 'var(--color-primary)' }}
          className="mt-5 px-6 py-3 rounded-2xl text-white text-xs font-bold min-h-[48px]"
        >
          Browse TeleX Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-slate-900 pb-20">
      {/* Return link */}
      <button
        onClick={() => setActiveView('storefront')}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-indigo-600 mb-6 transition min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Storefront</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
          Frictionless 1-Page Checkout
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete your order in 30 seconds. Cash on Delivery (COD) supported nationwide.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Delivery & Payment Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer Contact & Shipping Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-black text-gray-950">
                Delivery Details (Pakistan Shipping)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Muhammad Bilal Khan"
                  className="w-full min-h-[48px] px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">
                    Mobile Phone (+92 Auto Format) *
                  </label>
                  {isPhoneValid(formData.phone) ? (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Valid Pakistani Mobile
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-medium">
                      e.g. 03001234567
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+92 300 8472910"
                    className="w-full min-h-[48px] px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition font-mono font-bold"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Email Address (For Tax Receipt & Tracking Updates)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="bilal.khan@example.com"
                className="w-full min-h-[48px] px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Province and City Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Province *
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full min-h-[48px] px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer font-medium"
                >
                  {PAKISTANI_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  City (150+ Nationwide Destinations) *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full min-h-[48px] px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition cursor-pointer font-medium"
                >
                  {PAKISTANI_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Complete Street / House Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House / Apartment #, Street #, Sector / Phase / Mohallah"
                className="w-full min-h-[48px] px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Delivery Courier Instructions (Optional)
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Call before arrival, leave with security gate"
                className="w-full min-h-[48px] px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Section 2: Payment Method Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-black text-gray-950">Select Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. Cash on Delivery (COD) - Default Pre-selected */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition min-h-[48px] ${
                  paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/60 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-indigo-600 w-4 h-4 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-gray-900">Cash on Delivery (COD)</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Pre-Selected
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Pay cash to courier rider upon parcel inspection at your doorstep.
                  </p>
                </div>
              </label>

              {/* 2. JazzCash */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition min-h-[48px] ${
                  paymentMethod === 'jazzcash'
                    ? 'border-rose-500 bg-rose-50/60 shadow-sm ring-2 ring-rose-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'jazzcash'}
                  onChange={() => setPaymentMethod('jazzcash')}
                  className="mt-1 text-rose-600 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-black text-gray-900">JazzCash Mobile Wallet</span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Instant transfer via JazzCash Till / Mobile Account (0300-8472910).
                  </p>
                </div>
              </label>

              {/* 3. EasyPaisa */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition min-h-[48px] ${
                  paymentMethod === 'easypaisa'
                    ? 'border-emerald-500 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'easypaisa'}
                  onChange={() => setPaymentMethod('easypaisa')}
                  className="mt-1 text-emerald-600 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-black text-gray-900">EasyPaisa Account</span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Direct transfer via EasyPaisa App or nearest retailer.
                  </p>
                </div>
              </label>

              {/* 4. Credit / Debit Card */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition min-h-[48px] ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1 text-blue-600 w-4 h-4 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-black text-gray-900">Credit / Debit Card</span>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Visa & Mastercard processed with 3D Secure OTP verification.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Instant Checkout CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-sm space-y-5 sticky top-24">
            <h3 className="text-sm font-black text-gray-950 pb-3 border-b border-gray-100">
              Order Summary ({cart.length} Items)
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-gray-50 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-xl bg-gray-50 shrink-0 border border-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{item.title}</h5>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500">
                      <span>Qty: {item.quantity}</span>
                      {item.selectedColor && <span>• {item.selectedColor}</span>}
                    </div>
                    <span className="text-xs font-black text-gray-900 block mt-1">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-emerald-800">
                      {appliedCoupon.code} (-PKR {discountAmount.toLocaleString()})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-bold text-emerald-800 hover:text-rose-600 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon Code"
                    className="flex-1 min-h-[44px] px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 min-h-[44px] bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{couponError}</p>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">PKR {cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-PKR {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express TCS Shipping</span>
                <span className={isFreeShipping ? 'text-emerald-600 font-bold' : 'font-bold text-gray-900'}>
                  {isFreeShipping ? 'FREE' : `PKR ${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-gray-950 pt-2 border-t border-gray-100">
                <span>Grand Total</span>
                <span className="text-lg text-indigo-700">PKR {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* 48px Touch Target Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: 'var(--color-primary)' }}
              className="w-full min-h-[48px] py-4 px-5 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-indigo-500/25 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Confirming Order...'
                  : `Place Order (COD PKR ${grandTotal.toLocaleString()})`}
              </span>
            </button>

            <div className="text-center space-y-1 pt-1">
              <p className="text-[11px] text-gray-500 font-medium flex items-center justify-center gap-1">
                <Truck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Estimated Dispatch: Within 24 Hours via TCS</span>
              </p>
              <p className="text-[10px] text-gray-400">
                7-Day Replacement Guarantee • Official Retail Sealed Box
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Confirmed Order Celebration Modal */}
      {confirmedOrder && (
        <OrderSuccessModal
          order={confirmedOrder}
          onClose={() => {
            setConfirmedOrder(null);
            setActiveView('storefront');
          }}
        />
      )}
    </div>
  );
};
