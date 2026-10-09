import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ui/ProductCard';

interface ProductGridSectionProps {
  settings?: {
    filterTabs?: string[];
    itemsPerPage?: number;
  };
}

export const ProductGridSection: React.FC<ProductGridSectionProps> = ({ settings }) => {
  const { products, selectedCategory, setSelectedCategory } = useStore();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Best Seller' | 'New Drops' | 'Featured'>('All');

  // Filter products
  let filtered = products.filter((p) => {
    if (selectedCategory !== 'All' && selectedCategory !== 'All Products') {
      if (p.category !== selectedCategory) return false;
    }
    if (activeFilter === 'Best Seller' && !p.tags?.includes('Best Seller')) return false;
    if (activeFilter === 'New Drops' && !p.isFlashDeal) return false;
    return true;
  });

  return (
    <section id="product-grid" className="my-10 scroll-mt-24">
      {/* Section Header: Left-aligned editorial title + Right-aligned filter pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover our range <span className="italic font-serif font-normal text-[#1362D7]">—</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Engineered hardware backed by 100% official TeleX Warranty
          </p>
        </div>

        {/* Right-aligned Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['All', 'Best Seller', 'New Drops', 'Featured'] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`border rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                  : 'border-slate-300 text-slate-700 hover:border-slate-400 bg-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <p className="text-sm font-bold text-slate-800">No products match your active selection.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setActiveFilter('All');
            }}
            className="mt-4 px-5 py-2 bg-slate-950 text-white text-xs font-bold rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            View All Products
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGridSection;
