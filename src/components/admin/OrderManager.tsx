import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types/ecommerce';
import {
  Package,
  Truck,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  ChevronDown,
  X,
  FileText,
} from 'lucide-react';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus, addAuditLog } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.city.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-gray-100 text-gray-900';
      case 'Shipped':
        return 'bg-gray-100 text-gray-900';
      case 'Processing':
        return 'bg-gray-100 text-gray-900';
      case 'Cancelled':
      case 'Returned':
        return 'bg-gray-100 text-gray-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950">
            Order Fulfillment & Logistics
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Nationwide TCS & Trax courier status dispatch workflow, invoice slips, and customer verification.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer, or City..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-200"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold text-gray-700 cursor-pointer"
          >
            <option value="All">All Statuses ({orders.length})</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">City / Destination</th>
                <th className="py-3.5 px-4">Total & Payment</th>
                <th className="py-3.5 px-4">Courier Consignment</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-gray-950 block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 block">{ord.customerName}</span>
                    <span className="text-[10px] font-mono text-gray-500">{ord.customerPhone}</span>
                  </td>

                  <td className="py-3.5 px-4 min-w-48">
                    <div className="space-y-1">
                      {ord.items.map((item) => (
                        <div key={item.id} className="text-gray-700">
                          {item.title} <span className="font-mono text-gray-500">×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800">{ord.city}</span>
                    <span className="text-[10px] text-gray-400 block truncate max-w-[120px]">
                      {ord.province}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-black text-gray-950 block">
                      Rs. {ord.total.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-500">
                      {ord.paymentMethod} • {ord.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-[11px]">
                      <span className="font-bold text-gray-900 block">{ord.courier}</span>
                      <span className="font-mono text-gray-500 text-[10px]">
                        {ord.trackingNumber}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer outline-none border border-black/10 ${getStatusBadge(
                        ord.orderStatus
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition"
                      title="Print Tax Slip / Packing Sheet"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 px-4 text-center text-sm text-gray-500">
                    No customer orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Slip */}
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-black text-gray-950">TeleX Pakistan (Pvt.) Ltd.</h3>
                  <p className="text-[11px] text-gray-500">Official Tax Invoice & Dispatch Slip</p>
                  <p className="text-[10px] text-gray-400">NTN: 8492019-3 • Karachi Hub</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-gray-900 font-mono block">
                    {selectedInvoiceOrder.orderNumber}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-gray-200">
                <div>
                  <h5 className="font-bold text-gray-800 mb-1">Customer / Consignee:</h5>
                  <p className="font-semibold text-gray-900">{selectedInvoiceOrder.customerName}</p>
                  <p className="text-gray-600 leading-snug">{selectedInvoiceOrder.address}</p>
                  <p className="text-gray-600">{selectedInvoiceOrder.city}, {selectedInvoiceOrder.province}</p>
                  <p className="text-gray-600 font-mono mt-0.5">{selectedInvoiceOrder.customerPhone}</p>
                </div>

                <div>
                  <h5 className="font-bold text-gray-800 mb-1">Logistics & Courier:</h5>
                  <p className="font-semibold text-gray-900">{selectedInvoiceOrder.courier}</p>
                  <p className="font-mono text-gray-500">Tracking: {selectedInvoiceOrder.trackingNumber}</p>
                  <p className="font-bold text-gray-900 mt-2">
                    Payment Mode: {selectedInvoiceOrder.paymentMethod.toUpperCase()} (COD)
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h5 className="font-bold text-gray-800">Items Manifest:</h5>
                {selectedInvoiceOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between p-2 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-900">{it.title}</p>
                      <p className="text-[10px] text-gray-500">Qty: {it.quantity} {it.selectedColor ? `• ${it.selectedColor}` : ''}</p>
                    </div>
                    <span className="font-bold text-gray-900">
                      Rs. {(it.price * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-gray-200 space-y-1 text-right">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal:</span>
                  <span>Rs. {selectedInvoiceOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedInvoiceOrder.discount > 0 && (
                  <div className="flex justify-between text-gray-900">
                    <span>Discount:</span>
                    <span>-Rs. {selectedInvoiceOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Shipping:</span>
                  <span>{selectedInvoiceOrder.shippingFee === 0 ? 'FREE' : `Rs. ${selectedInvoiceOrder.shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-gray-950 pt-1 border-t border-gray-200">
                  <span>Total Due on Delivery:</span>
                  <span className="text-base text-gray-900">Rs. {selectedInvoiceOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Dispatch Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
