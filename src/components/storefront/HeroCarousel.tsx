import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../../types/ecommerce';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroCarouselProps {
  slides?: HeroSlide[];
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 's1',
    tagline: 'PREMIER AUDIO RELEASE',
    heading: 'Experience pure audio in every dimension.',
    subheading: '28dB Hybrid Active Noise Cancellation • 30H Battery • Fast USB-C Charging',
    badge: '99.4% ANC EFFICIENCY',
    ctaText: 'Shop Audio →',
    ctaLink: '#products',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    bgColor: '#ECFDF5',
    badgeColor: '#1362D7',
  },
  {
    id: 's2',
    tagline: 'RUGGED SMARTWATCH',
    heading: 'Precision tracking on every adventure.',
    subheading: '1.43" HD AMOLED Retina • Stainless Steel 316L Bezel • Dual Satellite GPS',
    badge: '10-DAY BATTERY',
    ctaText: 'Shop Smartwatches →',
    ctaLink: '#products',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    bgColor: '#EFF6FF',
    badgeColor: '#1362D7',
  },
  {
    id: 's3',
    tagline: 'FAST CHARGING TECH',
    heading: 'Ultra-fast power for all your devices.',
    subheading: '65W & 100W GaN Technology • Dynamic Temperature Shield • Multi-Port USB-C',
    badge: '100W PD FAST CHARGE',
    ctaText: 'Shop Chargers →',
    ctaLink: '#products',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    bgColor: '#FEF3C7',
    badgeColor: '#1362D7',
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const activeSlides = (slides && slides.length > 0) ? slides : DEFAULT_SLIDES;
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!activeSlides || activeSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeSlides]);

  const slide = activeSlides[currentIdx] || DEFAULT_SLIDES[0];

  // Render title with styled italic accent
  const renderTitle = (titleText: string) => {
    if (titleText.includes('audio')) {
      return (
        <>
          Experience pure audio in <span className="italic font-serif font-normal text-[#1362D7]">every dimension</span>.
        </>
      );
    }
    if (titleText.includes('tracking')) {
      return (
        <>
          Precision tracking on <span className="italic font-serif font-normal text-[#1362D7]">every adventure</span>.
        </>
      );
    }
    if (titleText.includes('power')) {
      return (
        <>
          Ultra-fast power for <span className="italic font-serif font-normal text-[#1362D7]">all your devices</span>.
        </>
      );
    }
    return titleText;
  };

  return (
      <div className="rounded-[36px] bg-gradient-to-r from-[#ECFDF5] via-[#EFF6FF] to-[#FEF3C7] p-8 sm:p-14 my-6 relative overflow-hidden shadow-sm min-h-[380px] sm:min-h-[420px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full">
          {/* Left Side: Category tag, heading, specs subtext, and rounded CTA button */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-block bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-[#1362D7] border border-blue-100 shadow-2xs uppercase tracking-wider">
              {slide.tagline || 'PREMIER TECH RELEASE'}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              {renderTitle(slide.heading)}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-lg font-normal leading-relaxed">
              {slide.subheading}
            </p>

            <div className="pt-3 flex items-center gap-4">
              <a
                href={slide.ctaLink || '#products'}
                className="bg-[#D9F99D] hover:bg-[#bef264] text-slate-950 font-semibold px-6 py-3.5 rounded-full shadow-sm hover:scale-105 transition-all inline-flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>{slide.ctaText || 'Shop Now →'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/70 backdrop-blur-sm px-4 py-3 rounded-full border border-slate-200/60">
                <ShieldCheck className="w-4 h-4 text-[#1362D7]" />
                <span>100% Verified TeleX Warranty</span>
              </div>
            </div>
          </div>

          {/* Right Side: Glassmorphic Hero Stage Card & Floating Stat Badge */}
          <div className="lg:col-span-5 flex items-center justify-center relative py-4">
            {/* Soft Ambient Radial Glow behind the hero card */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#1362D7]/20 via-indigo-500/20 to-[#65C42C]/20 rounded-[40px] blur-3xl -z-10 animate-pulse-subtle" />

            <div className="relative w-full max-w-[380px] aspect-[4/3] sm:aspect-[4/3] rounded-[32px] p-2 bg-white/70 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-900/10 overflow-hidden group">
              {/* Product Image Stage */}
              <div className="w-full h-full rounded-[24px] overflow-hidden relative bg-slate-900/5">
                <img
                  src={slide.image}
                  alt={slide.heading}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Subtle bottom vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>

              {/* Floating Stat Badge */}
              {slide.badge && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 animate-fade-in z-10">
                  <span className="w-2 h-2 rounded-full bg-[#65C42C] animate-pulse" />
                  <span
                    className="text-xs font-black uppercase tracking-tight"
                    style={{ color: slide.badgeColor || '#1362D7' }}
                  >
                    {slide.badge}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Show slide ${idx + 1}: ${activeSlides[idx].tagline}`}
              aria-current={currentIdx === idx ? 'true' : undefined}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIdx === idx ? 'w-6 bg-slate-900' : 'w-2 bg-slate-400/40 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
  );
};

export default HeroCarousel;
