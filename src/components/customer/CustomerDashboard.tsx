import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types/ecommerce';
import {
  Package,
  Heart,
  MapPin,
  User,
  LogOut,
  ChevronRight,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShoppingBag,
  Trash2,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { customer, logoutCustomer } = useAuth();
  const {
    orders,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    setActiveView,
    selectedTrackingOrder,
    setSelectedTrackingOrder,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'profile'>('orders');

  if (!customer) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-gray-900">Please sign in to view your dashboard</h2>
        <button
          onClick={() => setActiveView('storefront')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  // Filter orders matching customer
  const customerOrders = orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === customer.email.toLowerCase() ||
      o.customerPhone === customer.phone ||
      o.customerName === customer.name
  );

  // Active tracking order modal
  const trackingOrder = selectedTrackingOrder || customerOrders[0];

  // Wishlist products
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            style={{ backgroundColor: '#1362D7' }}
            className="w-14 h-14 rounded-xl text-white font-bold text-xl flex items-center justify-center shadow-md shadow-blue-500/20 uppercase shrink-0"
          >
            {customer.name.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{customer.name}</h1>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-lime-50 text-[#3d8315] border border-lime-200/60">
                Verified Shopper
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">{customer.phone} • {customer.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setActiveView('storefront')}
            className="px-4 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition cursor-pointer"
          >
            Continue Shopping
          </button>
          <button
            onClick={logoutCustomer}
            className="px-4 py-2.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid: Navigation Sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-2 border border-slate-200/80 shadow-xs space-y-1.5">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-l-4 border-[#1362D7] bg-slate-50 text-[#1362D7] font-semibold shadow-2xs'
                  : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>My Orders & Tracking</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === 'orders' ? 'bg-blue-100/80 text-[#1362D7] font-semibold' : 'bg-slate-100 text-slate-500 font-medium'
              }`}>
                {customerOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'border-l-4 border-[#1362D7] bg-slate-50 text-[#1362D7] font-semibold shadow-2xs'
                  : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Saved Wishlist</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === 'wishlist' ? 'bg-blue-100/80 text-[#1362D7] font-semibold' : 'bg-slate-100 text-slate-500 font-medium'
              }`}>
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === 'addresses'
                  ? 'border-l-4 border-[#1362D7] bg-slate-50 text-[#1362D7] font-semibold shadow-2xs'
                  : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === 'addresses' ? 'bg-blue-100/80 text-[#1362D7] font-semibold' : 'bg-slate-100 text-slate-500 font-medium'
              }`}>
                {customer.addresses?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-l-4 border-[#1362D7] bg-slate-50 text-[#1362D7] font-semibold shadow-2xs'
                  : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-50/70 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>Profile Settings</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS & LIVE TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Live Tracking Timeline Showcase */}
              {trackingOrder && (
                <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1362D7]">
                        Live Consignment Tracking
                      </span>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                        <span>Order #{trackingOrder.orderNumber}</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1362D7] border border-blue-100">
                          {trackingOrder.orderStatus}
                        </span>
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-900 block">
                        {trackingOrder.courier}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-normal">
                        Code: {trackingOrder.trackingNumber}
                      </span>
                    </div>
                  </div>

                  {/* 5-Step Milestone Timeline */}
                  <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6 my-4">
                    {trackingOrder.timeline?.map((step, idx) => (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition ${
                            step.completed
                              ? 'bg-blue-50 text-[#1362D7] border border-blue-200 shadow-2xs'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 font-normal'
                          }`}
                        >
                          {step.completed ? <CheckCircle2 className="w-4 h-4 text-[#1362D7]" /> : idx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-xs sm:text-sm font-semibold ${
                                step.completed ? 'text-slate-900' : 'text-slate-400'
                              }`}
                            >
                              {step.title}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-normal font-mono">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-normal mt-0.5">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Items in this tracking order */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-normal">
                      Total items in package:{' '}
                      <strong className="font-semibold text-slate-900">{trackingOrder.items.reduce((a, b) => a + b.quantity, 0)}</strong>
                    </span>
                    <span className="font-bold text-slate-900">
                      Payable on Delivery: Rs. {trackingOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* All Orders List */}
              <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  All Recent Orders ({customerOrders.length})
                </h3>

                {customerOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center font-normal">
                    You have not placed any orders yet.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {customerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-xs text-slate-900">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1362D7] border border-blue-100">
                              {ord.orderStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-normal">
                            {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length}{' '}
                            item(s) • Total: <strong className="font-semibold text-slate-900">Rs. {ord.total.toLocaleString()}</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedTrackingOrder(ord)}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:border-blue-200 text-xs font-semibold text-[#1362D7] hover:bg-blue-50/60 transition cursor-pointer"
                        >
                          View Tracking
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Your Saved Wishlist ({wishlistedProducts.length})
              </h3>

              {wishlistedProducts.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-normal">
                  Your wishlist is empty. Tap the heart icon on any gadget to save it here!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 bg-white shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded-lg bg-slate-50 shrink-0 border border-slate-100"
                        />
                        <div className="truncate">
                          <span className="text-[10px] font-semibold text-[#1362D7] uppercase tracking-wider">
                            {p.brand}
                          </span>
                          <h4 className="text-xs font-semibold text-slate-900 truncate">{p.name}</h4>
                          <span className="text-xs font-extrabold text-slate-950 block mt-0.5">
                            Rs. {p.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => addToCart(p, p.variants?.[0]?.colorName, undefined, undefined, 1)}
                          style={{ backgroundColor: '#1362D7' }}
                          className="p-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition cursor-pointer shadow-2xs"
                          title="Move to Cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Saved Delivery Addresses</h3>
                <button className="text-xs font-semibold text-[#1362D7] hover:underline cursor-pointer">
                  + Add New Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customer.addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-xl border ${
                      addr.isDefault
                        ? 'border-[#1362D7] bg-blue-50/30 shadow-2xs'
                        : 'border-slate-200/80 bg-white shadow-2xs'
                    } space-y-2 text-xs`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-semibold text-[#1362D7] bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-800 font-medium">{addr.recipientName}</p>
                    <p className="text-slate-500 font-normal leading-snug">{addr.address}</p>
                    <p className="text-slate-500 font-normal">{addr.city}, {addr.province}</p>
                    <p className="text-slate-500 font-mono">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-slate-900">Account Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={customer.name}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Mobile Phone (+92)</label>
                  <input
                    type="text"
                    defaultValue={customer.phone}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    defaultValue={customer.email}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Member Status</label>
                  <input
                    type="text"
                    disabled
                    value="VIP Registered Customer"
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
