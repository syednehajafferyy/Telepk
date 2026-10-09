import React from 'react';
import { useStore } from '../../context/StoreContext';

export const AnalyticsDashboard: React.FC = () => {
  const { orders, products } = useStore();

  const salesOrders = orders.filter((order) => order.orderStatus !== 'Cancelled');
  const paidOrders = salesOrders.filter((order) => order.paymentStatus === 'Paid');
  const totalRevenue = paidOrders.reduce((acc, order) => acc + order.total, 0);
  const paidOrderCount = paidOrders.length;
  const aov = paidOrderCount > 0 ? Math.round(totalRevenue / paidOrderCount) : 0;
  const productSales = new Map<string, { title: string; image: string; quantity: number; sku: string }>();

  for (const order of salesOrders) {
    for (const item of order.items) {
      const product = products.find((entry) => entry.id === item.productId);
      const sale = productSales.get(item.productId);
      productSales.set(item.productId, {
        title: item.title,
        image: item.image,
        quantity: (sale?.quantity || 0) + item.quantity,
        sku: product?.sku || item.productId,
      });
    }
  }

  const topProducts = [...productSales.entries()]
    .sort(([, first], [, second]) => second.quantity - first.quantity)
    .slice(0, 4);
  const regionalOrders = new Map<string, number>();
  for (const order of salesOrders) {
    const region = order.province || order.city || 'Location not provided';
    regionalOrders.set(region, (regionalOrders.get(region) || 0) + 1);
  }
  const topRegions = [...regionalOrders.entries()]
    .sort(([, first], [, second]) => second - first)
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950">
            Real-Time Storefront Analytics
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Revenue and order volume calculated from recorded store orders.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Paid Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, note: 'Total value of paid orders' },
          { label: 'Total Orders', value: orders.length.toLocaleString(), note: 'Orders recorded in this store' },
          { label: 'Average Order Value', value: `Rs. ${aov.toLocaleString()}`, note: 'Based on recorded orders' },
          { label: 'Paid Orders', value: paidOrderCount.toLocaleString(), note: 'Orders marked as paid' },
        ].map((metric) => (
          <div key={metric.label} className="bg-white p-5 rounded-xl border border-gray-200 space-y-2">
            <div className="text-xs text-gray-500 font-semibold">{metric.label}</div>
            <div className="text-2xl font-black text-gray-950">{metric.value}</div>
            <p className="text-[11px] text-gray-400">{metric.note}</p>
          </div>
        ))}
      </div>

      {/* Regional Share & Top Selling SKUs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top SKUs (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-950">Top-Selling Tech Hardware</h3>
          <div className="space-y-3">
            {topProducts.length === 0 && (
              <p className="text-xs text-gray-500">No order items recorded yet.</p>
            )}
            {topProducts.map(([productId, sale], idx) => (
              <div
                key={productId}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-gray-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-gray-200 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <img src={sale.image} alt={sale.title} className="w-10 h-10 object-cover rounded-lg bg-white shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-gray-900 truncate">{sale.title}</p>
                    <span className="text-[10px] text-gray-400 font-mono">SKU: {sale.sku}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span className="text-xs font-black text-gray-950 block">{sale.quantity} units</span>
                  <span className="text-[10px] font-semibold text-gray-500">from recorded orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Pakistani Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-950">Shipment Volume by Region</h3>
          <div className="space-y-3 text-xs">
            {topRegions.length === 0 && (
              <p className="text-gray-500">No shipment location data recorded yet.</p>
            )}
            {topRegions.map(([region, count]) => {
              const share = orders.length ? Math.round((count / orders.length) * 100) : 0;
              return (
                <div key={region}>
                  <div className="flex justify-between font-bold text-gray-800 mb-1">
                    <span>{region}</span>
                    <span>{count} ({share}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#1362D7] h-2 rounded-full" style={{ width: `${share}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
