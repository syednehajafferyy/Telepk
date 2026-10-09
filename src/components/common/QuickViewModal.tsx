import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingCart,
  Check,
  ChevronRight,
} from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openProductBySlug,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);

  // Set default color if not selected
  const activeColor = selectedColor || (product.variants?.[0]?.colorName || '');

  // Calculate price with variant
  let currentPrice = product.price;
  const selectedVariant = product.variants?.find((v) => v.colorName === activeColor);
  if (selectedVariant) {
    currentPrice += selectedVariant.priceDelta;
  }

  const handleAddToCart = () => {
    addToCart(
      product,
      activeColor,
      selectedVariant?.storage,
      selectedVariant?.warranty,
      quantity
    );
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-100 z-10 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-500 hover:text-gray-900 shadow-md hover:bg-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview Column */}
        <div className="md:w-1/2 p-6 bg-gray-50 flex flex-col justify-between">
          <div className="relative rounded-2xl overflow-hidden bg-white aspect-square shadow-inner flex items-center justify-center">
            <img
              src={product.images[selectedImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isFlashDeal && (
              <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                Save {product.flashDiscountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImageIdx === idx ? 'border-indigo-600 shadow' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">{product.category}</span>
            </div>

            <h3 className="text-lg font-black text-gray-900 leading-snug">{product.name}</h3>

            {/* Ratings & SKU */}
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-black text-gray-950">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {product.originalPrice > currentPrice && (
                <span className="text-sm text-gray-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description Snippet */}
            <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-4">
                <label className="text-xs font-bold text-gray-700 block mb-2">
                  Select Color: <span className="text-indigo-600 font-medium">{activeColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedColor(v.colorName)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        activeColor === v.colorName
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-xs"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span>{v.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                style={{ backgroundColor: 'var(--color-primary)' }}
                className="flex-1 py-3 px-4 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-indigo-500/20 active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart (Rs. {(currentPrice * quantity).toLocaleString()})</span>
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition ${
                  isWishlisted
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                setQuickViewProduct(null);
                openProductBySlug(product.slug);
              }}
              className="w-full text-center text-xs font-semibold text-gray-600 hover:text-indigo-600 flex items-center justify-center gap-1 transition"
            >
              <span>View Full Specs & Verified Reviews</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
