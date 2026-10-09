import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const FlashDeals: React.FC = () => {
  const { products } = useStore();

  // Filter flash deal products
  const flashProducts = products.filter((p) => p.isFlashDeal || p.price < p.originalPrice).slice(0, 4);

  return (
    <section id="flash-deals" className="my-8 sm:my-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {flashProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
      </div>
    </section>
  );
};

