import React, { useState } from 'react';
import { HomepageLayoutConfig, BuilderSection } from '../../../types/builder';
import { useStore } from '../../../context/StoreContext';
import {
  Monitor,
  Smartphone,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowRight,
  Code,
  Check,
  Copy,
} from 'lucide-react';

interface LiveStorefrontPreviewProps {
  layout: HomepageLayoutConfig;
  activeBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
}

export const LiveStorefrontPreview: React.FC<LiveStorefrontPreviewProps> = ({
  layout,
  activeBlockId,
  onSelectBlock,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [isIframeMode, setIsIframeMode] = useState<boolean>(false);
  const [showJsonInspector, setShowJsonInspector] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Active enabled blocks
  const visibleSections = layout.filter((s) => s.enabled);

  // Copy JSON payload
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(layout, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Top Frame Control Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-gray-900 tracking-wide">
            TeleX Live Storefront Frame
          </span>
          <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {visibleSections.length} Active Blocks
          </span>
        </div>

        {/* Viewport & Utility Switchers */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop vs Mobile Toggle */}
          <div className="bg-gray-100 p-0.5 rounded-lg border border-gray-200 flex items-center">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewport === 'desktop'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
              title="Desktop 100% Fluid Frame"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewport === 'mobile'
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
              title="Mobile 375px Device Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile (375px)</span>
            </button>
          </div>

          {/* Iframe View Switcher */}
          <button
            type="button"
            onClick={() => setIsIframeMode(!isIframeMode)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
              isIframeMode
                ? 'bg-black border-black text-white'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
            title="Toggle Real Isolated Iframe Mode"
          >
            <span>{isIframeMode ? 'Iframe: ON' : 'Iframe: Direct'}</span>
          </button>

          {/* View Raw JSON */}
          <button
            type="button"
            onClick={() => setShowJsonInspector(true)}
            className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
            title="Inspect Live Layout JSON"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100 flex justify-center items-start">
        {viewport === 'desktop' ? (
          /* Desktop Fluid Container */
          <div className="w-full bg-white text-gray-900 rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
            {isIframeMode ? (
              <IframeContainer layout={visibleSections} />
            ) : (
              <RenderedStorefrontSections
                sections={visibleSections}
                activeBlockId={activeBlockId}
                onSelectBlock={onSelectBlock}
                openFaqIndex={openFaqIndex}
                setOpenFaqIndex={setOpenFaqIndex}
              />
            )}
          </div>
        ) : (
          /* Mobile Realistic Phone Shell (375px width) */
          <div className="w-[375px] shrink-0 bg-gray-200 rounded-[40px] p-3 shadow-sm border border-gray-300 relative">
            {/* Dynamic Mobile Island / Notch */}
            <div className="w-32 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center gap-1.5 z-20 relative">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            </div>

            {/* Mobile Screen Surface */}
            <div className="w-full bg-white text-gray-900 rounded-[36px] overflow-y-auto max-h-[720px] shadow-inner text-left scrollbar-thin">
              {/* Mobile Header Mockup */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-gray-100 flex items-center justify-between text-xs z-20">
                <span className="font-black text-black tracking-tight">TeleX.pk</span>
                <span className="text-[10px] text-gray-400 font-mono">12:50 PM • 5G</span>
              </div>

              {isIframeMode ? (
                <IframeContainer layout={visibleSections} isMobile />
              ) : (
                <RenderedStorefrontSections
                  sections={visibleSections}
                  activeBlockId={activeBlockId}
                  onSelectBlock={onSelectBlock}
                  isMobile
                  openFaqIndex={openFaqIndex}
                  setOpenFaqIndex={setOpenFaqIndex}
                />
              )}
            </div>

            {/* Home Indicator Bar */}
            <div className="w-32 h-1 bg-gray-400 rounded-full mx-auto mt-2" />
          </div>
        )}
      </div>

      {/* JSON Inspector Modal */}
      {showJsonInspector && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl max-w-2xl w-full p-6 text-gray-900 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-gray-700" />
                <h3 className="font-bold text-sm">Homepage Layout JSON</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonInspector(false)}
                className="text-gray-500 hover:text-black text-xs font-semibold px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <pre className="bg-gray-50 p-4 rounded-lg font-mono text-[11px] text-gray-700 overflow-y-auto max-h-96 border border-gray-200">
              {JSON.stringify(layout, null, 2)}
            </pre>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="px-4 py-2 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold text-xs flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- Rendered Storefront Sections Subcomponent ---------------- */
interface RenderedStorefrontSectionsProps {
  sections: BuilderSection[];
  activeBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
  isMobile?: boolean;
  openFaqIndex: number | null;
  setOpenFaqIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const RenderedStorefrontSections: React.FC<RenderedStorefrontSectionsProps> = ({
  sections,
  activeBlockId,
  onSelectBlock,
  isMobile = false,
  openFaqIndex,
  setOpenFaqIndex,
}) => {
  const { products, categories, addToCart } = useStore();

  if (sections.length === 0) {
    return (
      <div className="p-12 text-center text-gray-400 space-y-2">
        <Sparkles className="w-10 h-10 mx-auto text-gray-300" />
        <p className="font-bold text-sm text-gray-600">All blocks are currently disabled or hidden</p>
        <p className="text-xs">Enable blocks in the left builder panel to preview them live.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isMobile ? 'p-3' : 'p-6 sm:p-8'}`}>
      {sections.map((section) => {
        const isEditing = activeBlockId === section.id;
        const { type, config } = section;

        return (
          <div
            key={section.id}
            onClick={() => onSelectBlock?.(section.id)}
            className={`relative rounded-3xl transition-all cursor-pointer group ${
              isEditing
                ? 'ring-2 ring-black shadow-md'
                : 'hover:ring-2 hover:ring-gray-300'
            }`}
          >
            {/* Block Edit Indicator Overlay Badge */}
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="px-2.5 py-1 rounded-full bg-gray-800 text-white font-mono text-[10px] font-bold shadow-sm flex items-center gap-1">
                <span>Edit Block</span>
                <span className="text-gray-300 uppercase">({type})</span>
              </span>
            </div>

            {/* a. HERO CAROUSEL BLOCK */}
            {type === 'hero' && (
              <HeroPreviewBlock config={config} isMobile={isMobile} />
            )}

            {/* c. CATEGORY SHOWCASE BLOCK */}
            {type === 'categories' && (
              <CategoriesPreviewBlock config={config} categories={categories} />
            )}

            {/* d. DYNAMIC PRODUCT GRID BLOCK */}
            {type === 'product_grid' && (
              <ProductGridPreviewBlock
                config={config}
                products={products}
                isMobile={isMobile}
                addToCart={addToCart}
              />
            )}

            {/* e. PROMOTIONAL SPLIT BANNERS BLOCK */}
            {type === 'promo_banners' && (
              <PromoBannersPreviewBlock config={config} />
            )}

            {/* f. SOCIAL PROOF & REVIEWS BLOCK */}
            {type === 'social_proof' && (
              <SocialProofPreviewBlock config={config} />
            )}

            {/* g. FAQ ACCORDION BLOCK */}
            {type === 'faq' && (
              <FaqPreviewBlock
                config={config}
                openIndex={openFaqIndex}
                setOpenIndex={setOpenFaqIndex}
                isMobile={isMobile}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ---------------- 1. Hero Preview Block ---------------- */
const HeroPreviewBlock: React.FC<{ config: any; isMobile?: boolean }> = ({ config, isMobile }) => {
  const slides = config.slides || [];
  const slide = slides[0] || {};

  return (
    <div className="relative rounded-xl overflow-hidden bg-white text-gray-900 p-6 sm:p-10 shadow-sm border border-gray-200">
      <div className="relative z-10 space-y-4 max-w-xl text-left">
        {slide.badge && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700 border border-gray-200">
            <Sparkles className="w-3 h-3" />
            <span>{slide.badge}</span>
          </span>
        )}
        <h2 className={`${isMobile ? 'text-xl' : 'text-3xl sm:text-4xl'} font-bold text-gray-950 tracking-tight leading-tight`}>
          {slide.heading || 'Flagship Gadget Release'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
          {slide.subheading || 'Fast Nationwide TCS Cash on Delivery with official warranty'}
        </p>
        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            className="px-5 py-2.5 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <span>{slide.ctaText || 'Shop Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {slide.videoUrl && (
            <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
              ▶ Video Preview
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- 3. Category Showcase Preview Block ---------------- */
const CategoriesPreviewBlock: React.FC<{ config: any; categories: any[] }> = ({ config, categories }) => {
  const gridColsClass =
    config.layout === 'grid-4'
      ? 'grid-cols-2 sm:grid-cols-4'
      : config.layout === 'horizontal-scroll'
      ? 'flex overflow-x-auto pb-2'
      : 'grid-cols-3 sm:grid-cols-6';

  return (
    <div className="space-y-3 text-left">
      <h3 className="text-base font-black text-gray-950">Top Tech Categories</h3>
      <div className={`grid ${gridColsClass} gap-3`}>
        {categories.slice(0, 6).map((cat) => (
          <div
            key={cat.id}
            className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-400 transition text-center space-y-1.5 shrink-0"
          >
            <img src={cat.image} alt={cat.name} className="w-12 h-12 object-cover rounded-xl mx-auto" />
            <p className="text-xs font-bold text-gray-900 truncate">{cat.name}</p>
            {config.showCount && (
              <span className="text-[10px] text-gray-500 font-mono block">
                {cat.productCount} Items
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 4. Dynamic Product Grid Preview Block ---------------- */
const ProductGridPreviewBlock: React.FC<{
  config: any;
  products: any[];
  isMobile?: boolean;
  addToCart: (p: any) => void;
}> = ({ config, products, isMobile, addToCart }) => {
  let displayProducts = products;

  if (config.collectionType === 'manual_sku' && config.manualSkus?.length) {
    const manualSkusSet = new Set(config.manualSkus.map((s: string) => s.toLowerCase()));
    displayProducts = products.filter((p) =>
      manualSkusSet.has(p.sku?.toLowerCase() || '') || manualSkusSet.has(p.id.toLowerCase())
    );
    if (displayProducts.length === 0) {
      displayProducts = products.slice(0, 4);
    }
  } else {
    displayProducts = products.slice(0, config.itemsCount || 8);
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-base sm:text-lg font-black text-gray-950">
          {config.sectionTitle || 'Featured Products'}
        </h3>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase">
          {config.collectionType === 'best_sellers'
            ? 'Best Sellers'
            : config.collectionType === 'new_arrivals'
            ? 'New Arrivals'
            : 'Manual SKU Curated'}
        </span>
      </div>

      {config.filterTabsEnabled && (
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {['All Gadgets', 'Earbuds', 'Smartwatches', 'Fast Chargers'].map((tab, i) => (
            <span
              key={tab}
              className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition shrink-0 ${
                i === 0
                  ? 'bg-gray-950 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      )}

      <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'} gap-3`}>
        {displayProducts.slice(0, 4).map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-3 border border-gray-200/90 shadow-xs space-y-2">
            <img src={p.image} alt={p.name} className="w-full h-32 object-cover rounded-xl" />
            <p className="font-bold text-xs text-gray-900 truncate">{p.name}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-gray-900">Rs. {p.price?.toLocaleString()}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p);
                }}
                className="px-2 py-1 rounded-lg bg-gray-100 text-gray-800 font-semibold text-[10px] hover:bg-black hover:text-white transition"
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 5. Promotional Split Banners Preview Block ---------------- */
const PromoBannersPreviewBlock: React.FC<{ config: any }> = ({ config }) => {
  const banners = config.banners || [];
  const colClass =
    config.columns === 1
      ? 'grid-cols-1'
      : config.columns === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={`grid ${colClass} gap-3 text-left`}>
      {banners.map((b: any, idx: number) => (
        <div
          key={b.id || idx}
          className="relative rounded-xl overflow-hidden p-5 sm:p-6 bg-gray-100 text-gray-900 min-h-[170px] flex flex-col justify-between border border-gray-200"
        >
          <div className="space-y-1.5 relative z-10">
            <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-800 inline-block">
              {b.badgeText || 'Special Offer'}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-gray-950">{b.title}</h4>
            <p className="text-xs text-gray-600 line-clamp-1">{b.subtitle}</p>
          </div>
          <div className="pt-3">
            <span className="text-xs font-semibold text-gray-700 flex items-center gap-1">
              <span>{b.ctaText || 'Shop Now'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------------- 6. Social Proof Preview Block ---------------- */
const SocialProofPreviewBlock: React.FC<{ config: any }> = ({ config }) => {
  const reviews = config.reviews || [];

  return (
    <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200/80 space-y-4 text-left">
      <div className="text-center max-w-md mx-auto space-y-1">
        <h3 className="text-base font-black text-gray-950">{config.headline}</h3>
        <p className="text-xs text-gray-500">{config.subheadline}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {reviews.map((r: any, idx: number) => (
          <div key={r.id || idx} className="p-4 bg-white rounded-2xl border border-gray-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-900">{r.name}</span>
              <span className="text-amber-500 font-bold">★ {r.rating}/5</span>
            </div>
            <span className="text-[10px] text-gray-400 block">{r.city}</span>
            <p className="text-xs text-gray-600 italic">"{r.comment}"</p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold pt-1">
              <CheckCircle className="w-3 h-3" />
              <span>Verified Buyer</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- 7. FAQ Preview Block ---------------- */
const FaqPreviewBlock: React.FC<{
  config: any;
  openIndex: number | null;
  setOpenIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isMobile?: boolean;
}> = ({ config, openIndex, setOpenIndex }) => {
  const faqs = config.faqs || [];

  return (
    <div className="p-6 rounded-3xl bg-white border border-gray-200/90 shadow-xs space-y-3 text-left">
      <h3 className="text-base font-black text-gray-950">{config.title || 'Frequently Asked Questions'}</h3>
      <div className="divide-y divide-gray-100">
        {faqs.map((faq: any, idx: number) => {
          const isOpen = openIndex === idx;
          return (
            <div key={faq.id || idx} className="py-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenIndex(isOpen ? null : idx);
                }}
                className="w-full flex items-center justify-between font-bold text-xs text-gray-800 text-left gap-2"
              >
                <span>{faq.question}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-black shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
              </button>
              {isOpen && (
                <p className="text-xs text-gray-600 mt-2 pl-1 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- Isolated Iframe Container ---------------- */
const IframeContainer: React.FC<{ layout: BuilderSection[]; isMobile?: boolean }> = ({
  layout,
  isMobile,
}) => {
  // Generate HTML srcDoc for pure sandboxed iframe execution
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; }
        </style>
      </head>
      <body class="p-4 sm:p-6 space-y-6">
        <div class="text-center py-2 border-b border-gray-200">
          <span class="text-xs font-bold text-black uppercase tracking-wider">TeleX Live Sandbox Frame</span>
          <p class="text-[11px] text-gray-400">Rendering ${layout.length} active layout sections</p>
        </div>
        ${layout
          .map(
            (sec) => `
          <div class="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold uppercase">${sec.type}</span>
            <h4 class="font-bold text-sm text-gray-900 mt-1">${sec.title}</h4>
            <pre class="text-[10px] text-gray-500 mt-2 bg-gray-50 p-2 rounded overflow-x-auto">${JSON.stringify(sec.config, null, 2)}</pre>
          </div>
        `
          )
          .join('')}
      </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={htmlContent}
      title="Storefront Live Sandbox Iframe"
      className={`w-full border-0 ${isMobile ? 'h-[640px]' : 'h-[680px]'}`}
    />
  );
};
