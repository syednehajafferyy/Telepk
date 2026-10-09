import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { DEFAULT_HOMEPAGE_LAYOUT } from '../../data/defaultBuilderLayout';
import { BuilderSection } from '../../types/builder';
import { HeroCarousel } from './HeroCarousel';
import { CategoryShowcase } from './CategoryShowcase';
import { BrandCarousel } from './BrandCarousel';
import { ProductGridSection } from './ProductGridSection';
import { TechSpecsRow } from './TechSpecsRow';
import { PromoBanners } from './PromoBanners';
import { Testimonials } from './Testimonials';
import { FAQSection } from './FAQSection';

export const DynamicPageRenderer: React.FC = () => {
  const { sections: legacySections, products } = useStore();
  const [layout, setLayout] = useState<BuilderSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('telex_homepage_layout');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLayout(parsed);
            setIsLoading(false);
            return;
          }
        }
      }
      setLayout(DEFAULT_HOMEPAGE_LAYOUT);
    } catch (e) {
      console.error('Failed to load homepage layout', e);
      setLayout(DEFAULT_HOMEPAGE_LAYOUT);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse py-4">
        <div className="w-full h-80 bg-slate-200/80 rounded-[36px]" />
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-slate-200/80 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const activeSections = layout.filter((sec) => sec.enabled !== false);

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {activeSections.map((section) => {
        const { type, config } = section;

        switch (type) {
          case 'hero':
            return (
              <HeroCarousel
                key={section.id}
                slides={
                  config.slides?.map((s: any) => ({
                    id: s.id,
                    tagline: s.tagline || 'PREMIER TECH',
                    heading: s.heading || '',
                    subheading: s.subheading || '',
                    badge: s.badge || '',
                    ctaText: s.ctaText || 'Shop Gadgets',
                    ctaLink: s.ctaLink || '#products',
                    image: s.imageUrl || s.image || '',
                    bgColor: s.bgColor || '#EFF6FF',
                    badgeColor: s.badgeColor || '#1362D7',
                  })) || []
                }
              />
            );

          case 'categories':
            return (
              <React.Fragment key={section.id}>
                <CategoryShowcase />
                <BrandCarousel />
              </React.Fragment>
            );

          case 'product_grid':
            return (
              <React.Fragment key={section.id}>
                {/* Discover Our Range Product Grid */}
                <ProductGridSection />
                {/* Tech Specs & Benefits Circular Row */}
                <TechSpecsRow />
              </React.Fragment>
            );

          case 'promo_banners':
            return (
              <PromoBanners
                key={section.id}
                settings={{
                  banners: config.banners?.map((b: any) => ({
                    id: b.id,
                    title: b.title,
                    subtitle: b.subtitle,
                    discountText: b.badgeText || 'Special Offer',
                    btnText: b.ctaText || 'Shop Now',
                    btnLink: b.ctaLink || '#products',
                    image: b.imageUrl,
                  })),
                }}
              />
            );

          case 'social_proof':
            return <Testimonials key={section.id} />;

          case 'faq':
            return (
              <FAQSection
                key={section.id}
                settings={{
                  faqs:
                    config.faqs?.map((f: any) => ({
                      q: f.question,
                      a: f.answer,
                    })) || [],
                }}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
