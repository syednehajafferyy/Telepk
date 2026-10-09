import React from 'react';
import { BuilderSection } from '../../../types/builder';
import {
  Sparkles,
  Grid,
  ShoppingBag,
  Columns,
  MessageSquare,
  HelpCircle,
  Plus,
  Trash2,
  Video,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface BlockEditorProps {
  section: BuilderSection;
  onUpdate: (updatedConfig: Record<string, any>) => void;
  onClose: () => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ section, onUpdate, onClose }) => {
  const { type, config } = section;

  const handleChange = (key: string, value: any) => {
    onUpdate({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-xl space-y-6 text-xs animate-fade-in text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-bold shadow-xs">
            {type === 'hero' && <Sparkles className="w-4 h-4" />}
            {type === 'categories' && <Grid className="w-4 h-4" />}
            {type === 'product_grid' && <ShoppingBag className="w-4 h-4 text-gray-900" />}
            {type === 'promo_banners' && <Columns className="w-4 h-4 text-gray-900" />}
            {type === 'social_proof' && <MessageSquare className="w-4 h-4 text-gray-900" />}
            {type === 'faq' && <HelpCircle className="w-4 h-4 text-gray-900" />}
          </span>
          <div>
            <h3 className="text-sm font-black text-gray-950">{section.title}</h3>
            <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
              Type: {section.type} • ID: {section.id}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-bold transition text-xs"
        >
          Close Inspector
        </button>
      </div>

      {/* ---------------- 1. HERO CAROUSEL CONTROLS ---------------- */}
      {type === 'hero' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Slide Autoplay</label>
              <select
                value={config.autoplay ? 'yes' : 'no'}
                onChange={(e) => handleChange('autoplay', e.target.value === 'yes')}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:border-gray-200"
              >
                <option value="yes">Enabled (Autoplay on)</option>
                <option value="no">Disabled</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Rotation Speed (Sec)</label>
              <input
                type="number"
                value={config.intervalSeconds || 6}
                onChange={(e) => handleChange('intervalSeconds', parseInt(e.target.value) || 6)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 block">
                Banners & Slides ({config.slides?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => {
                  const newSlide = {
                    id: `slide-${Date.now()}`,
                    tagline: 'SPECIAL LAUNCH',
                    heading: 'New Flagship Gadget',
                    subheading: 'Official Brand Warranty • Fast TCS Delivery Nationwide',
                    badge: 'LIMITED OFFER',
                    ctaText: 'Shop Now',
                    ctaLink: '#products',
                    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80',
                    videoUrl: 'https://www.youtube.com/watch?v=mock-gadget-review',
                    bgGradient: 'from-gray-100 to-white',
                  };
                  handleChange('slides', [...(config.slides || []), newSlide]);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-100 font-bold transition text-[11px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>
            </div>

            {config.slides?.map((slide: any, idx: number) => (
              <div key={slide.id || idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/90 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    Slide #{idx + 1}: {slide.heading || 'Untitled'}
                  </span>
                  {config.slides.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = config.slides.filter((_: any, i: number) => i !== idx);
                        handleChange('slides', updated);
                      }}
                      className="text-gray-600 hover:text-gray-900 p-1"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold block mb-1">Heading Title</label>
                  <input
                    type="text"
                    value={slide.heading}
                    onChange={(e) => {
                      const updated = [...config.slides];
                      updated[idx] = { ...updated[idx], heading: e.target.value };
                      handleChange('slides', updated);
                    }}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold block mb-1">Subheading Description</label>
                  <input
                    type="text"
                    value={slide.subheading}
                    onChange={(e) => {
                      const updated = [...config.slides];
                      updated[idx] = { ...updated[idx], subheading: e.target.value };
                      handleChange('slides', updated);
                    }}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Tagline Pill</label>
                    <input
                      type="text"
                      value={slide.tagline}
                      onChange={(e) => {
                        const updated = [...config.slides];
                        updated[idx] = { ...updated[idx], tagline: e.target.value };
                        handleChange('slides', updated);
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Promotional Badge</label>
                    <input
                      type="text"
                      value={slide.badge}
                      onChange={(e) => {
                        const updated = [...config.slides];
                        updated[idx] = { ...updated[idx], badge: e.target.value };
                        handleChange('slides', updated);
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      value={slide.ctaText}
                      onChange={(e) => {
                        const updated = [...config.slides];
                        updated[idx] = { ...updated[idx], ctaText: e.target.value };
                        handleChange('slides', updated);
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">CTA Target Link</label>
                    <input
                      type="text"
                      value={slide.ctaLink}
                      onChange={(e) => {
                        const updated = [...config.slides];
                        updated[idx] = { ...updated[idx], ctaLink: e.target.value };
                        handleChange('slides', updated);
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold block mb-1 flex items-center gap-1">
                    <Video className="w-3 h-3 text-gray-600" />
                    <span>Product Video Link (YouTube / MP4 Showcase)</span>
                  </label>
                  <input
                    type="text"
                    value={slide.videoUrl || ''}
                    placeholder="https://www.youtube.com/watch?v=..."
                    onChange={(e) => {
                      const updated = [...config.slides];
                      updated[idx] = { ...updated[idx], videoUrl: e.target.value };
                      handleChange('slides', updated);
                    }}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 3. CATEGORY SHOWCASE CONTROLS ---------------- */}
      {type === 'categories' && (
        <div className="space-y-4">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Grid Layout Presentation</label>
            <select
              value={config.layout || 'grid-6'}
              onChange={(e) => handleChange('layout', e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            >
              <option value="grid-6">6-Column Comprehensive Grid (Desktop)</option>
              <option value="grid-4">4-Column Spacious Grid</option>
              <option value="horizontal-scroll">Horizontal Mobile Swiper</option>
            </select>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={config.showCount}
                onChange={(e) => handleChange('showCount', e.target.checked)}
                className="w-4 h-4 text-gray-900 rounded"
              />
              <span>Show product count under each category badge (e.g. 18 items)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <input
                type="checkbox"
                checked={config.showIcons}
                onChange={(e) => handleChange('showIcons', e.target.checked)}
                className="w-4 h-4 text-gray-900 rounded"
              />
              <span>Display category icons alongside imagery</span>
            </label>
          </div>
        </div>
      )}

      {/* ---------------- 4. PRODUCT GRID CONTROLS ---------------- */}
      {type === 'product_grid' && (
        <div className="space-y-4">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Section Title</label>
            <input
              type="text"
              value={config.sectionTitle || ''}
              onChange={(e) => handleChange('sectionTitle', e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Collection</label>
              <select
                value={config.collectionType || 'best_sellers'}
                onChange={(e) => handleChange('collectionType', e.target.value)}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl"
              >
                <option value="best_sellers">Best sellers</option>
                <option value="new_arrivals">New arrivals</option>
                <option value="manual_sku">Selected SKUs</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Items to show</label>
              <input
                type="number"
                min={1}
                max={24}
                value={config.itemsCount ?? 8}
                onChange={(e) => handleChange('itemsCount', Number(e.target.value) || 1)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
          {config.collectionType === 'manual_sku' && (
            <div>
              <label className="font-bold text-gray-700 block mb-1">Product SKUs</label>
              <textarea
                rows={3}
                value={(config.manualSkus || []).join('\n')}
                onChange={(e) => handleChange('manualSkus', e.target.value.split('\n').map((sku: string) => sku.trim()).filter(Boolean))}
                placeholder="One SKU per line"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
              />
            </div>
          )}
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <input
              type="checkbox"
              checked={Boolean(config.filterTabsEnabled)}
              onChange={(e) => handleChange('filterTabsEnabled', e.target.checked)}
              className="w-4 h-4 text-black rounded"
            />
            <span>Enable product filter tabs</span>
          </label>
        </div>
      )}

      {/* ---------------- 5. PROMOTIONAL SPLIT BANNERS CONTROLS ---------------- */}
      {type === 'promo_banners' && (
        <div className="space-y-4">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Grid Column Split</label>
            <select
              value={config.columns || 2}
              onChange={(e) => handleChange('columns', parseInt(e.target.value) || 2)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium"
            >
              <option value={1}>1 Column (Full Width Master Spotlight)</option>
              <option value={2}>2 Column Split (50/50 Dual Spotlights)</option>
              <option value={3}>3 Column Grid (Three-Way Split)</option>
            </select>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 block">
                Promotional Banners ({config.banners?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => {
                  const newBanner = {
                    id: `pb-${Date.now()}`,
                    title: 'New Spotlight Deal',
                    subtitle: 'Up to 30% OFF with official warranty',
                    badgeText: 'HOT DEAL',
                    ctaText: 'Shop Collection',
                    ctaLink: '#products',
                    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
                    gradient: 'from-gray-100 to-white',
                  };
                  handleChange('banners', [...(config.banners || []), newBanner]);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-100 font-bold transition text-[11px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Banner</span>
              </button>
            </div>

            {config.banners?.map((b: any, idx: number) => (
              <div key={b.id || idx} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Banner #{idx + 1}</span>
                  {config.banners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = config.banners.filter((_: any, i: number) => i !== idx);
                        handleChange('banners', updated);
                      }}
                      className="text-gray-600 hover:text-gray-900 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold block mb-1">Headline</label>
                  <input
                    type="text"
                    value={b.title}
                    onChange={(e) => {
                      const updated = [...config.banners];
                      updated[idx] = { ...updated[idx], title: e.target.value };
                      handleChange('banners', updated);
                    }}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold block mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={b.subtitle}
                    onChange={(e) => {
                      const updated = [...config.banners];
                      updated[idx] = { ...updated[idx], subtitle: e.target.value };
                      handleChange('banners', updated);
                    }}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={b.badgeText}
                      onChange={(e) => {
                        const updated = [...config.banners];
                        updated[idx] = { ...updated[idx], badgeText: e.target.value };
                        handleChange('banners', updated);
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">CTA Label</label>
                    <input
                      type="text"
                      value={b.ctaText}
                      onChange={(e) => {
                        const updated = [...config.banners];
                        updated[idx] = { ...updated[idx], ctaText: e.target.value };
                        handleChange('banners', updated);
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 6. SOCIAL PROOF & REVIEWS CONTROLS ---------------- */}
      {type === 'social_proof' && (
        <div className="space-y-4">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Headline</label>
            <input
              type="text"
              value={config.headline || ''}
              onChange={(e) => handleChange('headline', e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">Subheadline</label>
            <input
              type="text"
              value={config.subheadline || ''}
              onChange={(e) => handleChange('subheadline', e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 block">
                Customer Testimonials ({config.reviews?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => {
                  const newReview = {
                    id: `rev-${Date.now()}`,
                    name: 'Zeeshan Ahmed',
                    city: 'Rawalpindi, Saddar',
                    rating: 5,
                    productName: 'Baseus Blade 100W Power Bank',
                    comment: 'Best purchase ever. Delivery in 24 hours via Trax. Packaging was 10/10.',
                    verified: true,
                  };
                  handleChange('reviews', [...(config.reviews || []), newReview]);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-100 font-bold transition text-[11px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review</span>
              </button>
            </div>

            {config.reviews?.map((r: any, idx: number) => (
              <div key={r.id || idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">{r.name} ({r.city})</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = config.reviews.filter((_: any, i: number) => i !== idx);
                      handleChange('reviews', updated);
                    }}
                    className="text-gray-600 hover:text-gray-900 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={r.name}
                    placeholder="Customer Name"
                    onChange={(e) => {
                      const updated = [...config.reviews];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      handleChange('reviews', updated);
                    }}
                    className="p-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={r.city}
                    placeholder="Pakistani City (e.g. Lahore)"
                    onChange={(e) => {
                      const updated = [...config.reviews];
                      updated[idx] = { ...updated[idx], city: e.target.value };
                      handleChange('reviews', updated);
                    }}
                    className="p-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>

                <textarea
                  rows={2}
                  value={r.comment}
                  placeholder="Feedback comment..."
                  onChange={(e) => {
                    const updated = [...config.reviews];
                    updated[idx] = { ...updated[idx], comment: e.target.value };
                    handleChange('reviews', updated);
                  }}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 7. FAQ ACCORDION CONTROLS ---------------- */}
      {type === 'faq' && (
        <div className="space-y-4">
          <div>
            <label className="font-bold text-gray-700 block mb-1">FAQ Block Title</label>
            <input
              type="text"
              value={config.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
            />
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 block">
                Questions & Answers ({config.faqs?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => {
                  const newFaq = {
                    id: `faq-${Date.now()}`,
                    question: 'Can I inspect the parcel before paying Cash on Delivery?',
                    answer: 'Yes, our TCS and Trax courier partners facilitate flyer inspection upon receipt before handoff.',
                  };
                  handleChange('faqs', [...(config.faqs || []), newFaq]);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-100 font-bold transition text-[11px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            {config.faqs?.map((f: any, idx: number) => (
              <div key={f.id || idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">FAQ Item #{idx + 1}</span>
                  {config.faqs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = config.faqs.filter((_: any, i: number) => i !== idx);
                        handleChange('faqs', updated);
                      }}
                      className="text-gray-600 hover:text-gray-900 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={f.question}
                  placeholder="Question"
                  onChange={(e) => {
                    const updated = [...config.faqs];
                    updated[idx] = { ...updated[idx], question: e.target.value };
                    handleChange('faqs', updated);
                  }}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                />
                <textarea
                  rows={2}
                  value={f.answer}
                  placeholder="Answer"
                  onChange={(e) => {
                    const updated = [...config.faqs];
                    updated[idx] = { ...updated[idx], answer: e.target.value };
                    handleChange('faqs', updated);
                  }}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs resize-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
