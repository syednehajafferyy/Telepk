import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Lock,
  User,
  ArrowRight,
  Zap,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const CheckoutAuthModal: React.FC = () => {
  const {
    isCheckoutAuthModalOpen,
    setIsCheckoutAuthModalOpen,
    setActiveView,
    cart,
    cartSubtotal,
    addToast,
  } = useStore();

  const {
    loginCustomerWithPassword,
    setIsCustomerModalOpen,
    setCustomerModalTab,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'guest'>('guest');

  // Sign In State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutAuthModalOpen) return null;

  // 1. Quick Sign In - Password
  const handlePasswordSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginCustomerWithPassword(identifier, password);
    if (res.success) {
      setIsCheckoutAuthModalOpen(false);
      setActiveView('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleOpenVerifiedSignup = () => {
    setIsCheckoutAuthModalOpen(false);
    setCustomerModalTab('signup');
    setIsCustomerModalOpen(true);
  };

  // 3. Continue as Guest (Fastest flow)
  const handleContinueAsGuest = () => {
    setIsCheckoutAuthModalOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('Guest Checkout', 'You can create an account post-purchase to track your parcel.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-fade-in text-gray-900">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-gray-100 max-h-[92vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsCheckoutAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Cart Preview Banner */}
        <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-black text-indigo-950 block truncate">
                {cart.length} Products in Bag (PKR {cartSubtotal.toLocaleString()})
              </span>
              <span className="text-[10px] text-indigo-700 font-semibold block -mt-0.5">
                Cart preserved securely for checkout
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-1 rounded-lg shrink-0">
            TCS COD Ready
          </span>
        </div>

        {/* Modal Headline */}
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
            How would you like to check out?
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Choose an option below to proceed to your order details.
          </p>
        </div>

        {/* 3 Clear Option Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('guest');
              setErrorMsg('');
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'guest'
                ? 'bg-white text-gray-950 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Continue as Guest</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg('');
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-white text-gray-950 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-gray-950 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold animate-shake">
            {errorMsg}
          </div>
        )}

        {/* ================= OPTION 3: CONTINUE AS GUEST (Default / Fastest) ================= */}
        {activeTab === 'guest' && (
          <div className="p-6 rounded-3xl bg-amber-50/60 border border-amber-200/80 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <Zap className="w-6 h-6 fill-amber-500 text-amber-600" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 inline-block">
                Fastest Option (Takes 30 Seconds)
              </span>
              <h3 className="text-base font-black text-gray-950">
                Checkout Instantly Without a Password
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Enter your delivery address and pay via <strong>Cash on Delivery (COD)</strong> when courier arrives. You can create an account with 1-click on the order confirmation screen to track updates.
              </p>
            </div>

            <button
              type="button"
              onClick={handleContinueAsGuest}
              style={{ backgroundColor: 'var(--color-primary)' }}
              className="w-full min-h-[48px] py-3.5 px-5 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-indigo-500/25 active:scale-98 cursor-pointer"
            >
              <span>Continue to Checkout as Guest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= OPTION 1: QUICK SIGN IN / OTP VERIFICATION ================= */}
        {activeTab === 'signin' && (
          <form onSubmit={handlePasswordSignIn} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Email or Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="shopper@gmail.com or 03001234567"
                    className="w-full min-h-[48px] px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full min-h-[48px] px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="w-full min-h-[48px] py-3.5 px-4 text-white text-xs font-bold rounded-2xl shadow-md transition"
                >
                  Sign In & Proceed to Checkout
                </button>
          </form>
        )}

        {/* ================= OPTION 2: CREATE ACCOUNT & 1-CLICK SSO ================= */}
        {activeTab === 'register' && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-gray-600">Create an account using an email verification code.</p>
            <button
              type="button"
              onClick={handleOpenVerifiedSignup}
              style={{ backgroundColor: 'var(--color-primary)' }}
              className="w-full min-h-[48px] py-3 px-4 text-white text-xs font-bold rounded-xl"
            >
              Continue to email signup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
