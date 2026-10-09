import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ShoppingCart,
  Heart,
  ChevronRight,
  ChevronLeft,
  Share2,
  Zap,
  Info,
  PackageCheck,
  Clock,
  Sparkles,
  Flame,
  AlertTriangle,
} from 'lucide-react';

interface WarrantyOption {
  id: string;
  label: string;
  description: string;
  priceDelta: number;
}

const WARRANTY_OPTIONS: WarrantyOption[] = [
  {
    id: 'standard',
    label: '7-Day Replacement',
    description: 'Covers manufacturer defect on unboxing (Included)',
    priceDelta: 0,
  },
  {
    id: 'official-1yr',
    label: '1-Year Official Brand Warranty',
    description: 'Authorized service center repairs across Pakistan',
    priceDelta: 850,
  },
  {
    id: 'shield-2yr',
    label: '2-Year TeleX Shield Care',
    description: 'Accidental surge protection + free pickup/drop',
    priceDelta: 1650,
  },
];

const STORAGE_OPTIONS = ['Standard', '64GB Edition', '128GB Pro'];

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    setActiveView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    setIsCheckoutAuthModalOpen,
  } = useStore();

  const { isCustomerLoggedIn } = useAuth();

  const product = selectedProduct;

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.variants?.[0]?.colorName || ''
  );
  const [selectedStorage, setSelectedStorage] = useState<string>('Standard');
  const [selectedWarranty, setSelectedWarranty] = useState<string>('standard');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'warranty' | 'reviews'>('features');

  // Touch Swipe State for Mobile Media Gallery
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <button
          onClick={() => setActiveView('storefront')}
          className="mt-4 px-6 py-3 rounded-xl bg-gray-900 text-white text-xs font-bold min-h-[48px]"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  // Variant calculations
  const activeColor = selectedColor || product.variants?.[0]?.colorName || '';
  const currentVariant = product.variants?.find((v) => v.colorName === activeColor);

  // Storage delta
  const storageDelta = selectedStorage === '64GB Edition' ? 950 : selectedStorage === '128GB Pro' ? 1900 : 0;

  // Warranty delta
  const warrantyObj = WARRANTY_OPTIONS.find((w) => w.id === selectedWarranty) || WARRANTY_OPTIONS[0];
  const warrantyDelta = warrantyObj.priceDelta;

  // Dynamic calculated price
  const basePrice = product.price;
  const variantColorDelta = currentVariant?.priceDelta || 0;
  const currentPrice = basePrice + variantColorDelta + storageDelta + warrantyDelta;

  // Dynamic calculated SKU
  const colorCode = activeColor ? activeColor.replace(/\s+/g, '').substring(0, 3).toUpperCase() : 'DEF';
  const warrantyCode = selectedWarranty === 'official-1yr' ? '1YW' : selectedWarranty === 'shield-2yr' ? '2YS' : 'STD';
  const dynamicSku = `${product.sku}-${colorCode}-${warrantyCode}`;

  // Dynamic Stock Status
  const dynamicStock = Math.max(2, product.stock - (selectedStorage === '128GB Pro' ? 3 : 0));
  const isLowStock = dynamicStock <= 6;

  const discountPercent =
    product.originalPrice > currentPrice
      ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
      : 0;

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Image
      setSelectedImgIdx((prev) => (prev + 1) % product.images.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Image
      setSelectedImgIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleAddToCart = () => {
    addToCart(product, activeColor, selectedStorage, warrantyObj.label, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, activeColor, selectedStorage, warrantyObj.label, quantity);
    setIsCartOpen(false);
    if (!isCustomerLoggedIn) {
      // Intercept unauthenticated buy now action!
      setIsCheckoutAuthModalOpen(true);
    } else {
      setActiveView('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in pb-28 lg:pb-12 text-slate-900">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveView('storefront')}
          className="hover:text-indigo-600 transition min-h-[36px] flex items-center"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <button
          onClick={() => setActiveView('storefront')}
          className="hover:text-indigo-600 transition min-h-[36px] flex items-center"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Media Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-gray-200/80 p-6 flex items-center justify-center shadow-sm select-none touch-pan-y"
          >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
              {discountPercent > 0 && (
                <span
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="px-3 py-1 rounded-full text-xs font-black text-white uppercase tracking-wider shadow"
                >
                  Save {discountPercent}% OFF
                </span>
              )}
              {product.isFlashDeal && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1 shadow">
                  <Zap className="w-3 h-3 fill-slate-950" />
                  Flash Deal
                </span>
              )}
            </div>

            {/* Wishlist Button - 48px touch target */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 z-10 min-w-[48px] min-h-[48px] rounded-full backdrop-blur-md shadow-md flex items-center justify-center transition ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Carousel navigation arrows for desktop */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImgIdx((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
                  }
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg items-center justify-center transition border border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImgIdx((prev) => (prev + 1) % product.images.length)}
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-lg items-center justify-center transition border border-gray-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={product.images[selectedImgIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain transition-all duration-300"
            />

            {/* Mobile Swipe Indicator Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 md:hidden">
                {product.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      selectedImgIdx === idx ? 'w-6 bg-indigo-600' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-white transition shrink-0 p-1 min-h-[48px] min-w-[48px] ${
                    selectedImgIdx === idx
                      ? 'border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-gray-50 border border-gray-200/60 rounded-2xl text-center">
              <ShieldCheck className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <h5 className="text-[11px] font-bold text-gray-900">100% Genuine</h5>
              <p className="text-[10px] text-gray-500">Official Sealed Box</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200/60 rounded-2xl text-center">
              <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <h5 className="text-[11px] font-bold text-gray-900">Cash on Delivery</h5>
              <p className="text-[10px] text-gray-500">Nationwide TCS / Trax</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200/60 rounded-2xl text-center">
              <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <h5 className="text-[11px] font-bold text-gray-900">7-Day Replace</h5>
              <p className="text-[10px] text-gray-500">Check Warranty</p>
            </div>
          </div>
        </div>

        {/* Right: Info & Dynamic Variant Selection (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">{product.category}</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                SKU: {dynamicSku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Stock Status */}
            <div className="flex items-center gap-3 mt-2.5 text-xs flex-wrap">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount} verified)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                In Stock ({dynamicStock} units ready)
              </span>
            </div>

            {/* LOW STOCK ALERT BADGE */}
            {isLowStock && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 animate-pulse">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                <span className="font-bold">
                  Low Stock Alert: Only {dynamicStock} units left! Order now for same-day dispatch via TCS.
                </span>
              </div>
            )}
          </div>

          {/* Dynamic Pricing Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/90 border border-gray-200/90 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs text-gray-500 block mb-0.5">Calculated Price (All Inclusive):</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-gray-950">
                  Rs. {currentPrice.toLocaleString()}
                </span>
                {product.originalPrice > currentPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-3 py-1.5 rounded-xl">
              100% Cash on Delivery Eligible
            </span>
          </div>

          {/* 1. Color Swatches Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">
                1. Select Color: <span className="text-indigo-600 font-semibold">{activeColor}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedColor(v.colorName)}
                    className={`min-h-[48px] flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold border transition ${
                      activeColor === v.colorName
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 shadow-xs shrink-0"
                      style={{ backgroundColor: v.colorHex }}
                    />
                    <span>{v.colorName}</span>
                    {v.priceDelta > 0 && (
                      <span className="text-[10px] text-gray-400 font-normal">
                        (+Rs. {v.priceDelta})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Storage Choices Variant Selector */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-2">
              2. Storage / Edition Choice: <span className="text-indigo-600 font-semibold">{selectedStorage}</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {STORAGE_OPTIONS.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStorage(st)}
                  className={`min-h-[48px] p-2.5 rounded-2xl text-xs font-bold border text-center transition flex flex-col justify-center items-center ${
                    selectedStorage === st
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span>{st}</span>
                  {st !== 'Standard' && (
                    <span className="text-[10px] text-indigo-600 font-semibold">
                      +{st === '64GB Edition' ? 'Rs. 950' : 'Rs. 1,900'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Warranty Selection Variant Selector */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-2">
              3. Protection & Warranty Plan:
            </label>
            <div className="space-y-2">
              {WARRANTY_OPTIONS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWarranty(w.id)}
                  className={`w-full min-h-[48px] p-3 rounded-2xl text-left border transition flex items-center justify-between gap-3 ${
                    selectedWarranty === w.id
                      ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedWarranty === w.id
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedWarranty === w.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{w.label}</p>
                      <p className="text-[11px] text-gray-500">{w.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 shrink-0">
                    {w.priceDelta === 0 ? 'Free' : `+Rs. ${w.priceDelta}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Pakistani Delivery Timeline Info */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-950 font-bold">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Estimated Delivery Across Pakistan:</span>
            </div>
            <ul className="text-gray-600 space-y-1 text-[11px] pl-6 list-disc">
              <li><strong>Karachi:</strong> 24-48 Hours (Same-day dispatch)</li>
              <li><strong>Lahore, Islamabad, Rawalpindi:</strong> 2-3 Days via TCS Express</li>
              <li><strong>Other Cities & Towns:</strong> 3-4 Days via Trax Logistics</li>
            </ul>
          </div>

          {/* Desktop Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-xs min-h-[48px]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-sm min-h-[48px]"
                >
                  -
                </button>
                <span className="px-4 text-xs font-black text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-sm min-h-[48px]"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                style={{ backgroundColor: 'var(--color-primary)' }}
                className="flex-1 min-h-[48px] py-3.5 px-5 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-indigo-500/20 active:scale-98 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart (Rs. {(currentPrice * quantity).toLocaleString()})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full min-h-[48px] py-4 px-5 rounded-2xl bg-gray-950 hover:bg-black text-white font-black text-sm flex items-center justify-center gap-2 transition shadow-md active:scale-98 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Buy Now with Cash on Delivery (COD)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section: Features, Specs, Warranty, Reviews */}
      <div className="mt-14 pt-8 border-t border-gray-200">
        <div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-px scrollbar-none">
          {[
            { id: 'features', label: 'Key Features' },
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'warranty', label: 'Official TeleX Warranty Policy' },
            { id: 'reviews', label: `Verified Reviews (${product.reviewCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition min-h-[44px] ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === 'features' && (
            <div className="space-y-4 max-w-3xl">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider pt-2">
                Highlights:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feat, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-800"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex p-3 text-xs">
                  <span className="w-1/3 font-semibold text-gray-500">{key}</span>
                  <span className="w-2/3 font-bold text-gray-900">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="max-w-3xl bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 space-y-3 text-xs text-gray-700 leading-relaxed">
              <h4 className="font-bold text-sm text-indigo-950 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                TeleX Pakistan Verified Official Warranty
              </h4>
              <p>
                All devices sold on TeleX.pk include standard 7-Day Replacement Guarantee covering out-of-the-box manufacturing faults.
              </p>
              <p>
                Brand warranties (Anker, Mibro, Joyroom, QCY) are supported through authorized service centers in Karachi, Lahore, and Islamabad. In case of issues, simply contact our WhatsApp support desk at <strong>+92 300 8472910</strong> with your invoice order number.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="text-3xl font-black text-amber-500">{product.rating}</div>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Based on {product.reviewCount} verified Pakistani purchases
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-gray-100 bg-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900">Saad Rehan (Karachi)</span>
                    <span className="text-gray-400">2 days ago</span>
                  </div>
                  <div className="flex text-amber-400 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    Received through TCS courier in Karachi in 24 hours. Sealed pack original product. 10/10 recommended!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MOBILE STICKY CTA BAR (Fixed bottom bar on mobile) ================= */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 z-40 flex items-center justify-between gap-2 shadow-2xl safe-area-bottom">
        <div className="shrink-0 min-w-0 pr-1">
          <span className="text-[10px] text-gray-400 block font-semibold truncate">Price:</span>
          <span className="text-sm sm:text-base font-black text-gray-950 truncate block">
            Rs. {(currentPrice * quantity).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            onClick={handleAddToCart}
            style={{ backgroundColor: 'var(--color-primary)' }}
            className="min-h-[48px] px-3.5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="min-h-[48px] px-3.5 py-2.5 rounded-xl bg-gray-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
