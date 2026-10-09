import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types/ecommerce';
import { Tag, Plus, Check, X, Percent, Gift, Trash2 } from 'lucide-react';

export const PromotionEngine: React.FC = () => {
  const { coupons, createCoupon, toggleCouponStatus } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountPercent: 10,
    minSpend: 3000,
    freeShipping: false,
    expiresAt: '2026-12-31',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;

    createCoupon({
      id: `coup-${Date.now()}`,
      code: formData.code.toUpperCase().trim(),
      description: formData.description,
      discountPercent: formData.discountPercent > 0 ? formData.discountPercent : undefined,
      minSpend: formData.minSpend,
      freeShipping: formData.freeShipping,
      active: true,
      expiresAt: formData.expiresAt,
      usageCount: 0,
    });

    setIsModalOpen(false);
    setFormData({
      code: '',
      description: '',
      discountPercent: 10,
      minSpend: 3000,
      freeShipping: false,
      expiresAt: '2026-12-31',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950">
            Promotions & Coupon Engine
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure percentage vouchers, minimum cart thresholds, and nationwide free shipping perks.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: 'var(--color-primary)' }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl shadow-md hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className={`p-5 rounded-3xl border transition-all ${
              c.active
                ? 'bg-white border-gray-200 shadow-sm'
                : 'bg-gray-50/70 border-gray-200/60 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-black text-base text-gray-950 px-3 py-1 bg-gray-100 rounded-xl">
                {c.code}
              </span>
              <button
                onClick={() => toggleCouponStatus(c.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  c.active ? 'bg-gray-100 text-gray-900' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {c.active ? 'Active' : 'Disabled'}
              </button>
            </div>

            <p className="text-xs font-semibold text-gray-800 leading-snug">{c.description}</p>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
              <div className="flex justify-between">
                <span>Min Spend:</span>
                <span className="font-bold text-gray-700">Rs. {c.minSpend.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Redeemed:</span>
                <span className="font-bold text-gray-900">{c.usageCount} times</span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>
                <span className="font-mono text-gray-400">{c.expiresAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-gray-950 mb-4">Create Promotion Voucher</h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EIDMUBARAK"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl uppercase font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 15% off on smartwatches"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Min Spend (PKR)</label>
                  <input
                    type="number"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="w-full py-3 text-white font-bold rounded-xl shadow transition"
                >
                  Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
