import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MOCK_PROMO_BANNERS } from '../../data/mockData';

interface PromoBannersProps {
  settings?: {
    banners?: any[];
  };
}

export const PromoBanners: React.FC<PromoBannersProps> = ({ settings }) => {
  const { setSelectedCategory } = useStore();

  const banners = (settings?.banners && settings.banners.length >= 4)
    ? settings.banners
    : MOCK_PROMO_BANNERS;

  return (
    <section className="my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {banners.slice(0, 4).map((b: any) => (
          <div
            key={b.id}
            onClick={() => {
              if (b.category) setSelectedCategory(b.category);
              const grid = document.getElementById('product-grid');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-xl overflow-hidden aspect-[16/9] relative shadow-sm hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex flex-col justify-between text-white"
          >
            {/* Background Image */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden opacity-40 group-hover:opacity-60 transition-opacity">
              <img
                src={b.image || b.imageUrl}
                alt={b.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-[180px] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#65C42C] block">
                {b.discountText || b.badgeText}
              </span>
              <h3 className="text-sm font-bold text-white leading-tight line-clamp-1">
                {b.title}
              </h3>
              <p className="text-[11px] text-slate-300 line-clamp-1">
                {b.subtitle}
              </p>
            </div>

            {/* TeleX Royal Blue CTA button */}
            <div className="relative z-10 pt-2">
              <button
                type="button"
                className="bg-[#1362D7] hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                {b.btnText || b.ctaText || 'Shop Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanners;
