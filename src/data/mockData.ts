import { Product, Category } from '../types/ecommerce';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './initialProducts';

export interface BrandData {
  id: string;
  name: string;
  logo: string;
  discountText: string;
}

export interface PromoBannerData {
  id: string;
  title: string;
  subtitle: string;
  discountText: string;
  btnText: string;
  btnLink: string;
  image: string;
  category: string;
}

export const CDN_MEDIA = {
  earbuds: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
  smartwatches: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80',
  chargers: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
  powerbanks: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=80',
  speakers: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80',
  cables: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
  hero: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&auto=format&fit=crop&q=80',
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-earbuds',
    name: 'Wireless Earbuds',
    slug: 'wireless-earbuds',
    iconName: 'Headphones',
    image: CDN_MEDIA.earbuds,
    productCount: 18,
    featured: true,
  },
  {
    id: 'cat-smartwatches',
    name: 'Smartwatches',
    slug: 'smartwatches',
    iconName: 'Watch',
    image: CDN_MEDIA.smartwatches,
    productCount: 14,
    featured: true,
  },
  {
    id: 'cat-chargers',
    name: 'GaN Chargers & Adapters',
    slug: 'chargers-adapters',
    iconName: 'Zap',
    image: CDN_MEDIA.chargers,
    productCount: 22,
    featured: true,
  },
  {
    id: 'cat-powerbanks',
    name: 'Fast Power Banks',
    slug: 'power-banks',
    iconName: 'BatteryCharging',
    image: CDN_MEDIA.powerbanks,
    productCount: 11,
    featured: true,
  },
  {
    id: 'cat-audio',
    name: 'Bluetooth Speakers',
    slug: 'bluetooth-speakers',
    iconName: 'Speaker',
    image: CDN_MEDIA.speakers,
    productCount: 9,
    featured: false,
  },
  {
    id: 'cat-cables',
    name: 'Braided Cables & Hubs',
    slug: 'cables-hubs',
    iconName: 'Cpu',
    image: CDN_MEDIA.cables,
    productCount: 16,
    featured: false,
  },
];

export const MOCK_BRANDS = [
  {
    id: 'b1',
    name: 'Anker',
    logo: 'ANKER',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Anker_logo.svg',
    discountText: 'FLAT 35% OFF',
  },
  {
    id: 'b2',
    name: 'QCY',
    logo: 'QCY',
    logoUrl: 'https://logo.clearbit.com/qcy.com',
    discountText: 'FLAT 25% OFF',
  },
  {
    id: 'b3',
    name: 'Baseus',
    logo: 'BASEUS',
    logoUrl: 'https://logo.clearbit.com/baseus.com',
    discountText: 'UP TO 30% OFF',
  },
  {
    id: 'b4',
    name: 'Mibro',
    logo: 'MIBRO',
    logoUrl: 'https://logo.clearbit.com/mibrofit.com',
    discountText: 'SAVE RS. 2,000',
  },
  {
    id: 'b5',
    name: 'SoundPEATS',
    logo: 'PEATS',
    logoUrl: 'https://logo.clearbit.com/soundpeats.com',
    discountText: 'MEGA DEALS',
  },
  {
    id: 'b6',
    name: 'Joyroom',
    logo: 'JOYROOM',
    logoUrl: 'https://logo.clearbit.com/joyroom.com',
    discountText: 'HOT SALE 26%',
  },
  {
    id: 'b7',
    name: 'Tronsmart',
    logo: 'TRONSMART',
    logoUrl: 'https://logo.clearbit.com/tronsmart.com',
    discountText: 'UP TO 20% OFF',
  },
];

export const MOCK_PROMO_BANNERS: PromoBannerData[] = [
  {
    id: 'pb-1',
    title: 'GaN 65W & 100W Chargers',
    subtitle: 'Dual Type-C PD Ports Fast Charging',
    discountText: 'SAVE 30%',
    btnText: 'Shop Chargers',
    btnLink: '#products',
    image: CDN_MEDIA.chargers,
    category: 'GaN Chargers & Adapters',
  },
  {
    id: 'pb-2',
    title: 'AMOLED Smartwatches',
    subtitle: 'Bluetooth Calls, GPS & 14-Day Battery',
    discountText: 'SPECIAL PRICE',
    btnText: 'Explore Wearables',
    btnLink: '#products',
    image: CDN_MEDIA.smartwatches,
    category: 'Smartwatches',
  },
  {
    id: 'pb-3',
    title: 'Flagship ANC Earbuds',
    subtitle: 'Hybrid 28dB Noise Cancelling Audio',
    discountText: 'FLAT 25% OFF',
    btnText: 'View Deals',
    btnLink: '#products',
    image: CDN_MEDIA.earbuds,
    category: 'Wireless Earbuds',
  },
  {
    id: 'pb-4',
    title: 'Ultra-Thin Power Banks',
    subtitle: '20,000mAh 100W PD Laptop Battery',
    discountText: 'LIMITED SALE',
    btnText: 'Order Now',
    btnLink: '#products',
    image: CDN_MEDIA.powerbanks,
    category: 'Fast Power Banks',
  },
];

export const MOCK_PRODUCTS: Product[] = INITIAL_PRODUCTS;

export default {
  categories: MOCK_CATEGORIES,
  products: MOCK_PRODUCTS,
  brands: MOCK_BRANDS,
  banners: MOCK_PROMO_BANNERS,
};
