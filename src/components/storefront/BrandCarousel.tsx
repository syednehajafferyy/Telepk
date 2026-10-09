import React from 'react';
import { useStore } from '../../context/StoreContext';

interface BrandItem {
  id: string;
  name: string;
  discountText: string;
}

const BRANDS: BrandItem[] = [
  {
    id: 'b1',
    name: 'Anker',
    discountText: 'FLAT 35% OFF',
  },
  {
    id: 'b2',
    name: 'QCY',
    discountText: 'FLAT 25% OFF',
  },
  {
    id: 'b3',
    name: 'Baseus',
    discountText: 'UP TO 30% OFF',
  },
  {
    id: 'b4',
    name: 'Mibro',
    discountText: 'SAVE RS. 2,000',
  },
  {
    id: 'b5',
    name: 'SoundPEATS',
    discountText: 'MEGA DEALS',
  },
  {
    id: 'b6',
    name: 'Joyroom',
    discountText: 'HOT SALE 26%',
  },
  {
    id: 'b7',
    name: 'Tronsmart',
    discountText: 'UP TO 20% OFF',
  },
];

const renderBrandVectorLogo = (brandId: string) => {
  switch (brandId) {
    case 'b1': // ANKER
      return (
        <div className="flex items-center justify-center font-black tracking-tighter text-slate-900 text-lg sm:text-xl uppercase select-none">
          <span>ANK</span>
          <span className="text-[#1362D7] font-extrabold italic">E</span>
          <span>R</span>
        </div>
      );
    case 'b2': // QCY
      return (
        <div className="flex items-center justify-center font-extrabold tracking-tight text-slate-900 text-lg sm:text-xl uppercase select-none relative">
          <span>QCY</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 inline-block ml-0.5 mb-2.5 animate-pulse" />
        </div>
      );
    case 'b3': // BASEUS
      return (
        <div className="flex items-center justify-center font-black tracking-widest text-slate-900 text-sm sm:text-base uppercase select-none">
          <span>BASEUS</span>
        </div>
      );
    case 'b4': // MIBRO
      return (
        <div className="flex items-center justify-center font-bold tracking-wider text-slate-900 text-base sm:text-lg uppercase select-none">
          <span className="text-slate-900">mibro</span>
          <span className="text-[#1362D7] font-extrabold text-xs ml-0.5 align-top">°</span>
        </div>
      );
    case 'b5': // SOUNDPEATS
      return (
        <div className="flex flex-col items-center justify-center select-none">
          <svg
            className="w-5 h-5 text-slate-900 mb-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
            <path d="M12 12 2.1 12a10 10 0 0 0 9.9 10V12z" fill="#1362D7" stroke="none" />
          </svg>
          <span className="font-black tracking-tighter text-[10px] sm:text-[11px] text-slate-900 uppercase leading-none">
            SOUNDPEATS
          </span>
        </div>
      );
    case 'b6': // JOYROOM
      return (
        <div className="flex items-center justify-center font-black tracking-tight text-slate-900 text-sm sm:text-base uppercase italic select-none">
          <span className="bg-slate-900 text-white px-1 py-0.5 rounded-xs mr-1 not-italic text-[10px] font-bold">
            JR
          </span>
          <span>JOYROOM</span>
        </div>
      );
    case 'b7': // TRONSMART
      return (
        <div className="flex items-center justify-center font-black tracking-wider text-slate-900 text-xs sm:text-sm uppercase select-none">
          <span className="text-orange-500 font-extrabold mr-0.5">T</span>
          <span className="border-b-2 border-slate-900 pb-0.5">RONSMART</span>
        </div>
      );
    default:
      return (
        <span className="font-bold text-slate-900 text-sm uppercase">
          {brandId}
        </span>
      );
  }
};

export const BrandCarousel: React.FC = () => {
  const { setSelectedCategory, setActiveView } = useStore();

  const handleBrandClick = (_brandName: string) => {
    setSelectedCategory('All');
    setActiveView('storefront');
    const grid = document.getElementById('product-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-6 my-12">
      {/* Header Row: Title + Right-aligned View More rounded pill button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Brand Savings
        </h2>
        <button
          type="button"
          onClick={() => handleBrandClick('All')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2 rounded-full transition-colors cursor-pointer"
        >
          View More
        </button>
      </div>

      {/* Grid Layout: grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 w-full items-center justify-between my-6 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 w-full items-center justify-between my-6">
        {BRANDS.map((brand) => (
          <div
            key={brand.id}
            onClick={() => handleBrandClick(brand.name)}
            className="flex flex-col items-center justify-center text-center group cursor-pointer"
          >
            {/* Logo-Only Circle Stage: w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center p-4 */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center p-4 group-hover:border-[#1362D7] group-hover:shadow-md transition-all relative overflow-hidden">
              {renderBrandVectorLogo(brand.id)}
            </div>

            {/* Clean text label and discount badge strictly OUTSIDE and BELOW the circle */}
            <span className="text-xs font-bold text-slate-900 mt-2.5 text-center group-hover:text-[#1362D7] transition-colors leading-tight">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export const BrandSavings = BrandCarousel;
export default BrandCarousel;
