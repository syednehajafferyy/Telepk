import React, { useRef, useState } from 'react';
import { Order } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle2,
  Package,
  Printer,
  MessageSquare,
  ArrowRight,
  Truck,
  ShieldCheck,
  X,
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const { setActiveView, setSelectedTrackingOrder } = useStore();
  const { isCustomerLoggedIn, setIsCustomerModalOpen, setCustomerModalTab } = useAuth();
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleTrackInDashboard = () => {
    setSelectedTrackingOrder(order);
    setActiveView('customer-dashboard');
    onClose();
  };

  const handleCreateAccount = () => {
    setCustomerModalTab('signup');
    setIsCustomerModalOpen(true);
    onClose();
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum! I have placed Order #${order.orderNumber} on TeleX.pk for Rs. ${order.total.toLocaleString()}. Please confirm dispatch.`
    );
    window.open(`https://wa.me/923008472910?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-gray-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            Order Confirmed! Shukriya!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
            Thank You, {order.customerName.split(' ')[0]}!
          </h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Your parcel is being packaged at our Karachi logistics hub. We'll send SMS and WhatsApp updates at each stage.
          </p>
        </div>

        {/* Order Details Card / Printable Invoice */}
        <div
          ref={invoiceRef}
          className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-4 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
            <div>
              <span className="text-gray-400 text-[11px] block">Order Tracking Number</span>
              <span className="text-base font-black text-gray-900 font-mono">
                {order.orderNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[11px] block">Assigned Courier</span>
              <span className="font-bold text-indigo-700 flex items-center gap-1 justify-end">
                <Truck className="w-3.5 h-3.5" />
                {order.courier} ({order.trackingNumber})
              </span>
            </div>
          </div>

          {/* Delivery & Payment Info */}
          <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-200">
            <div>
              <h5 className="font-bold text-gray-700 mb-1">Destination Address:</h5>
              <p className="text-gray-600 leading-snug">{order.customerName}</p>
              <p className="text-gray-600 leading-snug">{order.address}</p>
              <p className="text-gray-600 font-semibold">{order.city}, {order.province}</p>
              <p className="text-gray-600 font-mono mt-0.5">{order.customerPhone}</p>
            </div>
            <div>
              <h5 className="font-bold text-gray-700 mb-1">Payment Method:</h5>
              <span className="px-2.5 py-1 rounded-lg bg-gray-200 text-gray-800 font-bold uppercase text-[11px]">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod.toUpperCase()}
              </span>
              <p className="text-gray-500 text-[11px] mt-2">
                Pay exact cash amount: <strong>Rs. {order.total.toLocaleString()}</strong> to courier upon delivery.
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h5 className="font-bold text-gray-700 mb-2">Purchased Items ({order.items.length}):</h5>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg bg-gray-50 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0 pl-2">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="pt-2 border-t border-gray-200 space-y-1 text-right">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal:</span>
              <span>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Voucher Discount:</span>
                <span>-Rs. {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Shipping (TCS Express):</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `Rs. ${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-gray-950 pt-1 border-t border-gray-200">
              <span>Total Payable Amount:</span>
              <span className="text-base text-indigo-700">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Post-Purchase Guest Account Creation (Option 3 fulfillment) */}
        {!isCustomerLoggedIn && (
          <div className="mt-5 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs space-y-3">
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-indigo-950">Create an account with email verification</h5>
            </div>
            <p className="text-[11px] text-gray-600">
              Verify your email to create an account and manage future orders.
            </p>
            <button
              type="button"
              onClick={handleCreateAccount}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition min-h-[44px]"
            >
              Create account
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleTrackInDashboard}
            style={{ backgroundColor: 'var(--color-primary)' }}
            className="flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-indigo-500/20"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Confirmation</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
            title="Print Tax Receipt / Invoice"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
