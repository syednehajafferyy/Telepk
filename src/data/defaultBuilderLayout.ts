import { HomepageLayoutConfig } from '../types/builder';

export const DEFAULT_HOMEPAGE_LAYOUT: HomepageLayoutConfig = [
  // 1. Hero Carousel
  {
    id: 'block-hero-1',
    type: 'hero',
    title: 'Hero Banners & Video Highlights',
    enabled: true,
    config: {
      autoplay: true,
      intervalSeconds: 6,
      slides: [
        {
          id: 's1',
          tagline: 'PREMIER AUDIO RELEASE',
          heading: 'Experience pure audio in every dimension.',
          subheading: '28dB Hybrid Active Noise Cancellation • 30H Battery • Fast USB-C Charging',
          badge: '99.4% ANC EFFICIENCY',
          ctaText: 'Shop Audio →',
          ctaLink: '#products',
          imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
          bgGradient: 'from-[#ECFDF5] via-[#EFF6FF] to-[#FEF3C7]',
        },
        {
          id: 's2',
          tagline: 'RUGGED SMARTWATCH',
          heading: 'Precision tracking on every adventure.',
          subheading: '1.43" HD AMOLED Retina • Stainless Steel 316L Bezel • Dual Satellite GPS',
          badge: '10-DAY BATTERY',
          ctaText: 'Shop Smartwatches →',
          ctaLink: '#products',
          imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
          bgGradient: 'from-[#F3E8FF] via-[#EFF6FF] to-[#ECFDF5]',
        },
        {
          id: 's3',
          tagline: 'FAST CHARGING TECH',
          heading: 'Ultra-fast power for all your devices.',
          subheading: '65W & 100W GaN Technology • Dynamic Temperature Shield • Multi-Port USB-C',
          badge: '100W PD FAST CHARGE',
          ctaText: 'Shop Chargers →',
          ctaLink: '#products',
          imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
          bgGradient: 'from-[#FEF3C7] via-[#EFF6FF] to-[#ECFDF5]',
        },
      ],
    },
  },

  // 2. Category Showcase
  {
    id: 'block-categories-1',
    type: 'categories',
    title: 'Top Category Showcases',
    enabled: true,
    config: {
      layout: 'grid-6',
      showCount: true,
      showIcons: true,
    },
  },

  // 4. Promotional Split Banners
  {
    id: 'block-promos-1',
    type: 'promo_banners',
    title: 'Promotional Split Banners',
    enabled: true,
    config: {
      columns: 4,
      banners: [
        {
          id: 'pb-1',
          title: 'GaN 65W & 100W Chargers',
          subtitle: 'Dual Type-C PD Ports Fast Charging',
          badgeText: 'SAVE 30%',
          ctaText: 'Shop Chargers',
          ctaLink: '#products',
          imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'pb-2',
          title: 'AMOLED Smartwatches',
          subtitle: 'Bluetooth Calls, GPS & 14-Day Battery',
          badgeText: 'SPECIAL PRICE',
          ctaText: 'Explore Wearables',
          ctaLink: '#products',
          imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'pb-3',
          title: 'Flagship ANC Earbuds',
          subtitle: 'Hybrid 28dB Noise Cancelling Audio',
          badgeText: 'FLAT 25% OFF',
          ctaText: 'View Deals',
          ctaLink: '#products',
          imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        },
        {
          id: 'pb-4',
          title: 'Ultra-Thin Power Banks',
          subtitle: '20,000mAh 100W PD Laptop Battery',
          badgeText: 'LIMITED SALE',
          ctaText: 'Order Now',
          ctaLink: '#products',
          imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80',
        },
      ],
    },
  },

  // 5. Dynamic Product Grid
  {
    id: 'block-products-1',
    type: 'product_grid',
    title: 'Dynamic Product Grid & SKU Picker',
    enabled: true,
    config: {
      collectionType: 'best_sellers',
      itemsCount: 8,
      manualSkus: ['TLX-QCY-T13-ANC', 'TLX-MIB-GSPRO', 'TLX-ANK-65W3P', 'TLX-BAS-BLADE100'],
      sectionTitle: 'Trending Gadgets & Top Sellers',
      filterTabsEnabled: true,
    },
  },

  // 6. Social Proof & Reviews
  {
    id: 'block-reviews-1',
    type: 'social_proof',
    title: 'Social Proof & Verified Reviews',
    enabled: true,
    config: {
      headline: 'Loved by Pakistani Tech Enthusiasts',
      subheadline: 'Real reviews from Karachi, Lahore, Islamabad, and across Pakistan',
    },
  },

  // 7. FAQ Accordion Block
  {
    id: 'block-faq-1',
    type: 'faq',
    title: 'Frequently Asked Questions',
    enabled: true,
    config: {
      title: 'Common Questions Regarding Ordering & Deliveries',
    },
  },
];
