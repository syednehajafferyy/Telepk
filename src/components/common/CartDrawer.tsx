import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  CheckCircle2,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutAuthModalOpen,
    updateCartQty,
    removeFromCart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setActiveView,
  } = useStore();

  const { isCustomerLoggedIn } = useAuth();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  // Free shipping threshold for Pakistan
  const FREE_SHIPPING_THRESHOLD = 2500;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.freeShipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.discountAmount) {
      discountAmount = appliedCoupon.discountAmount;
    }
  }

  const shippingFee = cartSubtotal === 0 ? 0 : isFreeShipping ? 0 : 200;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    if (!isCustomerLoggedIn) {
      // Intercept unauthenticated checkout action!
      setIsCheckoutAuthModalOpen(true);
    } else {
      setActiveView('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in text-gray-900">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gray-900" />
              <h2 className="text-base font-black text-gray-900">Your Cart ({cart.length} items)</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="min-h-[48px] min-w-[48px] rounded-2xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition flex items-center justify-center cursor-pointer"
              title="Close Cart Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator Bar */}
          <div className="bg-indigo-50/80 p-3 sm:px-5 border-b border-indigo-100">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 mb-1.5">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              {isFreeShipping ? (
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <strong>FREE Delivery across Pakistan Unlocked!</strong>
                </span>
              ) : (
                <span>
                  Add <strong>PKR {remainingForFreeShipping.toLocaleString()}</strong> more to unlock{' '}
                  <span className="text-indigo-600 font-extrabold">FREE Delivery across Pakistan</span>
                </span>
              )}
            </div>
            <div className="w-full bg-indigo-200/60 rounded-full h-2.5 overflow-hidden">
              <div
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: isFreeShipping ? '#10b981' : 'var(--color-primary)',
                }}
                className="h-full rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-gray-900">Your shopping cart is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Discover trending earbuds, smartwatches, and fast GaN chargers.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="mt-4 px-6 py-3 rounded-2xl text-white text-xs font-bold hover:opacity-90 transition shadow-md min-h-[48px] flex items-center justify-center"
                >
                  Explore Tech Deals
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-xs transition"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-xl bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="min-h-[36px] min-w-[36px] flex items-center justify-center text-gray-400 hover:text-rose-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {item.selectedColor && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-200/80 text-gray-700">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedStorage && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                            {item.selectedStorage}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Instant Quantity Controls with 48px touch targets */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, -1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-700 font-black transition active:scale-95"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-black text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.id, 1)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-700 font-black transition active:scale-95"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-gray-950">
                          PKR {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-3 shrink-0">
              {/* Promo Code Input Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-800">{appliedCoupon.code}</span>
                      <span className="text-emerald-700 text-[11px] block">
                        Discount Applied: -PKR {discountAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-emerald-800 hover:text-rose-600 text-xs font-bold underline p-1 min-h-[36px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Promo Code (e.g. TELEX10)"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 uppercase font-mono min-h-[44px]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition min-h-[44px]"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-500 font-semibold">{couponError}</p>
              )}

              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">PKR {cartSubtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-PKR {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated TCS Shipping</span>
                  <span className={isFreeShipping ? 'text-emerald-600 font-bold' : 'font-semibold text-gray-900'}>
                    {isFreeShipping ? 'FREE' : `PKR ${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-950 pt-2 border-t border-gray-100">
                  <span>Grand Total</span>
                  <span className="text-base text-indigo-700">PKR {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button - 48px Touch Target */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                style={{ backgroundColor: 'var(--color-primary)' }}
                className="w-full min-h-[48px] py-3.5 px-4 rounded-2xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-indigo-500/20 active:scale-98 cursor-pointer"
              >
                <span>Proceed to 1-Page Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 text-center pt-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Cash on Delivery Eligible Across Pakistan</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
