export type BuilderBlockType =
  | 'hero'
  | 'categories'
  | 'product_grid'
  | 'promo_banners'
  | 'social_proof'
  | 'faq';

// a. Hero Carousel Config
export interface HeroSlideItem {
  id: string;
  tagline: string;
  heading: string;
  subheading: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  videoUrl?: string;
  bgGradient: string;
}

export interface HeroCarouselConfig {
  autoplay: boolean;
  intervalSeconds: number;
  slides: HeroSlideItem[];
}

// c. Category Showcase Config
export interface CategoryShowcaseConfig {
  layout: 'grid-6' | 'grid-4' | 'horizontal-scroll';
  showCount: boolean;
  showIcons: boolean;
}

// d. Dynamic Product Grid Config
export interface DynamicProductGridConfig {
  collectionType: 'best_sellers' | 'new_arrivals' | 'manual_sku';
  itemsCount: number;
  manualSkus: string[]; // e.g. ["TLX-QCY-T13-ANC", "TLX-MIB-GSPRO"]
  sectionTitle: string;
  filterTabsEnabled: boolean;
}

// e. Promotional Split Banners Config
export interface PromoBannerItem {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  gradient: string;
}

export interface PromoSplitBannersConfig {
  columns: 1 | 2 | 3;
  banners: PromoBannerItem[];
}

// f. Social Proof & Reviews Config
export interface ReviewItem {
  id: string;
  name: string;
  city: string;
  rating: number;
  comment: string;
  productName: string;
  videoThumbnailUrl?: string;
  verified: boolean;
}

export interface SocialProofConfig {
  headline: string;
  subheadline: string;
  reviews: ReviewItem[];
}

// g. FAQ Accordion Block Config
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQAccordionConfig {
  title: string;
  faqs: FAQItem[];
}

// Union config
export type BlockConfig =
  | HeroCarouselConfig
  | CategoryShowcaseConfig
  | DynamicProductGridConfig
  | PromoSplitBannersConfig
  | SocialProofConfig
  | FAQAccordionConfig;

// Core Builder Section Item
export interface BuilderSection {
  id: string;
  type: BuilderBlockType;
  title: string;
  enabled: boolean;
  config: Record<string, any>;
}

export type HomepageLayoutConfig = BuilderSection[];
