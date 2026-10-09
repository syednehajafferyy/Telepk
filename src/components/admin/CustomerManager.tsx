import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Customer } from '../../types/ecommerce';
import { Users, Search, DollarSign, ShoppingBag, MapPin, Tag } from 'lucide-react';

export const CustomerManager: React.FC = () => {
  const { customers, orders } = useStore();
  const [search, setSearch] = useState('');

  const customerEmails = new Set([
    ...customers.map((customer) => customer.email.trim().toLowerCase()),
    ...orders.map((order) => order.customerEmail.trim().toLowerCase()).filter(Boolean),
  ]);
  const liveCustomers = [...customerEmails].map((email) => {
    const profile = customers.find((customer) => customer.email.trim().toLowerCase() === email);
    const customerOrders = orders
      .filter((order) => order.customerEmail.trim().toLowerCase() === email)
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
    const billableOrders = customerOrders.filter((order) => order.orderStatus !== 'Cancelled');
    const latestOrder = customerOrders[0];

    return {
      id: profile?.id || latestOrder?.id || email,
      name: profile?.name || latestOrder?.customerName || email,
      email,
      phone: profile?.phone || latestOrder?.customerPhone || '',
      city: profile?.city || latestOrder?.city || '',
      province: profile?.province || latestOrder?.province || '',
      ordersCount: customerOrders.length,
      totalSpent: billableOrders.reduce((total, order) => total + order.total, 0),
      tags: profile?.tags || ['New Customer' as const],
      lastOrderDate: latestOrder ? new Date(latestOrder.createdAt).toLocaleDateString() : '',
    };
  });

  const filtered = liveCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950">
            Customer Relationship Management (CRM)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Track customer Lifetime Value (LTV), order frequency, and segmented behavioral tags.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, city..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-200"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Customer Name & Phone</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Value (LTV)</th>
                <th className="py-3.5 px-4">Segment Tags</th>
                <th className="py-3.5 px-4 text-right">Last Purchase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 block">{c.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {c.phone} • {c.email}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800">{c.city}</span>
                    <span className="text-[10px] text-gray-400 block">{c.province}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900">{c.ordersCount} orders</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-black text-gray-900">
                      Rs. {c.totalSpent.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-900 border border-gray-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right text-gray-500 font-mono text-[11px]">
                    {c.lastOrderDate}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center text-sm text-gray-500">
                    No customer profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
