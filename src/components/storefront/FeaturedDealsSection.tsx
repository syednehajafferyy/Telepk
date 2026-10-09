import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';

// Fallback SVG placeholder image data URL
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300' fill='none'%3E%3Crect width='300' height='300' fill='%23F8FAFC'/%3E%3Cpath d='M150 115C130.67 115 115 130.67 115 150C115 169.33 130.67 185 150 185C169.33 185 185 169.33 185 150C185 130.67 169.33 115 150 115Z' fill='%23E2E8F0'/%3E%3Cpath d='M110 205L138 172L158 192L188 152L215 205H110Z' fill='%23CBD5E1'/%3E%3C/svg%3E";

export const FeaturedDealsSection: React.FC = () => {
  const { products, openProductBySlug, setSelectedCategory } = useStore();

  const featuredProducts = products.slice(0, 6);

  return (
    <section className="my-8">
      {/* Header: Left-aligned Section Title + Right-aligned "View All" pill */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">
          Top Gadget Deals
        </h2>
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('All');
            const grid = document.getElementById('product-grid');
            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 transition cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid: grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {featuredProducts.map((product) => {
          const discountPercent =
            product.originalPrice > product.price
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

          return (
            <div
              key={product.id}
              onClick={() => openProductBySlug(product.slug)}
              className="bg-white rounded-xl border border-slate-200/80 overflow-hidden p-2.5 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Image Stage */}
              <div className="aspect-square bg-slate-50 rounded-lg relative overflow-hidden mb-2 flex flex-col justify-between">
                {/* Discount Badge: Top-left pill */}
                {discountPercent > 0 ? (
                  <span className="bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-sm w-max z-10 m-1">
                    -{discountPercent}%
                  </span>
                ) : (
                  <span />
                )}

                {/* Main Product Image */}
                <img
                  src={product.images?.[0] || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Tag Badge: Bottom full-width pill */}
                <span className="bg-blue-600/90 backdrop-blur-xs text-white text-[9px] font-semibold py-0.5 text-center block w-full mt-auto rounded-sm z-10">
                  {product.category || 'Official Warranty'}
                </span>
              </div>

              {/* Content */}
              <div>
                {/* Title: text-xs font-medium text-slate-800 line-clamp-2 mb-1.5 h-8 */}
                <h3
                  className="text-xs font-medium text-slate-800 line-clamp-2 mb-1.5 h-8 leading-snug group-hover:text-[#1362D7] transition-colors"
                  title={product.name}
                >
                  {product.name}
                </h3>

                {/* Pricing Row: Main Price + Strike-through Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-slate-900">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-[10px] text-slate-400 line-through ml-1">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedDealsSection;
