import React, { useState } from 'react';
import { Product } from '../../types/ecommerce';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    openProductBySlug,
    setQuickViewProduct,
  } = useStore();

  const [imgSrc, setImgSrc] = useState<string>(
    product.images?.[0] || PLACEHOLDER_IMAGE
  );

  const isWishlisted = isInWishlist(product.id);

  // Tinted Image Stage Background based on category
  const getStageBg = (categoryName: string) => {
    const cat = categoryName.toLowerCase();
    if (cat.includes('charger') || cat.includes('adapter')) return 'bg-[#FEF3C7]';
    if (cat.includes('earbud') || cat.includes('audio')) return 'bg-[#EFF6FF]';
    if (cat.includes('watch')) return 'bg-[#F3E8FF]';
    if (cat.includes('power') || cat.includes('bank')) return 'bg-[#ECFDF5]';
    return 'bg-[#F4F5F0]';
  };

  return (
    <div
      onClick={() => openProductBySlug(product.slug)}
      className="bg-white rounded-[28px] p-3 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Tinted Image Stage */}
        <div className={`aspect-square ${getStageBg(product.category)} rounded-[22px] relative overflow-hidden flex items-center justify-center`}>
          {/* Wishlist Floating Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-xs ${
              isWishlisted ? 'text-red-500 bg-white shadow-xs' : ''
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Product Image */}
          <SafeImage
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />

          {/* Quick View Button */}
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="w-full py-2 px-3 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold hover:bg-white shadow-md flex items-center justify-center gap-1.5 transition border border-slate-100"
            >
              <Eye className="w-3.5 h-3.5 text-[#1362D7]" />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Product Title */}
        <h3
          className="text-base font-semibold text-slate-900 mt-3 px-1 line-clamp-2 leading-snug group-hover:text-[#1362D7] transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>
      </div>

      {/* Price Tag Bar: Full-width pill underneath image */}
      <div className="bg-[#FEF08A] text-slate-900 font-bold text-xs py-2 px-4 rounded-full flex justify-between items-center mt-3 shadow-2xs">
        <span>Rs. {product.price.toLocaleString()}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, '', undefined, undefined, 1);
          }}
          className="bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-semibold px-3 py-1 rounded-full transition-colors flex items-center gap-1"
        >
          <ShoppingCart className="w-3 h-3" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
