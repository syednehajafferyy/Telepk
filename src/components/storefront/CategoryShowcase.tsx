import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CDN_MEDIA } from '../../data/mockData';
import { SafeImage } from '../ui/SafeImage';

export const CategoryShowcase: React.FC = () => {
  const { categories, setSelectedCategory, setActiveView } = useStore();

  const getCategoryGraphic = (slug: string) => {
    switch (slug) {
      case 'wireless-earbuds':
        return CDN_MEDIA.earbuds;
      case 'smartwatches':
        return CDN_MEDIA.smartwatches;
      case 'chargers-adapters':
        return CDN_MEDIA.chargers;
      case 'power-banks':
        return CDN_MEDIA.powerbanks;
      case 'bluetooth-speakers':
        return CDN_MEDIA.speakers;
      case 'cables-hubs':
        return CDN_MEDIA.cables;
      default:
        return CDN_MEDIA.earbuds;
    }
  };

  const handleSelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveView('storefront');
    const grid = document.getElementById('product-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories" className="max-w-7xl mx-auto px-6 my-12">
      {/* Title Header */}
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6 flex items-center justify-between">
        <span>Popular Categories</span>
      </h2>

      {/* Grid Layout: grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelect(cat.name)}
            className="bg-white rounded-[24px] border border-slate-100 p-4 aspect-[4/5] flex flex-col justify-between items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer"
          >
            {/* 1:1 Rounded Image Stage */}
            <div className="w-full aspect-square bg-slate-50 rounded-[18px] overflow-hidden relative mb-3 flex items-center justify-center p-2">
              <SafeImage
                src={cat.image || getCategoryGraphic(cat.slug)}
                alt={cat.name}
                className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 p-1"
              />
            </div>

            {/* Label */}
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide group-hover:text-[#1362D7] transition-colors leading-tight line-clamp-2">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
