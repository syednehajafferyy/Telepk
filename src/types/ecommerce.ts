export type ProductVariant = {
  id: string;
  colorName: string;
  colorHex: string;
  storage?: string;
  warranty?: string;
  priceDelta: number;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  description: string;
  rating: number;
  reviewCount: number;
  isFlashDeal?: boolean;
  flashDiscountPercent?: number;
  tags: string[];
  variants: ProductVariant[];
  specs: Record<string, string>;
  features: string[];
  sku: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  image: string;
  productCount: number;
  featured?: boolean;
};

export type CartItem = {
  id: string;
  productId: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
  selectedWarranty?: string;
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';

export type OrderTimelineStep = {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cod' | 'card' | 'jazzcash' | 'easypaisa';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  trackingNumber: string;
  courier: 'TCS Express' | 'Trax Logistics' | 'Leopards Courier' | 'M&P Express';
  createdAt: string;
  estimatedDelivery: string;
  notes?: string;
  timeline: OrderTimelineStep[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  totalSpent: number;
  ordersCount: number;
  registeredAt: string;
  lastOrderDate: string;
  tags: ('VIP Shopper' | 'Frequent Buyer' | 'Tech Enthusiast' | 'New Customer')[];
  defaultAddress: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend: number;
  freeShipping?: boolean;
  active: boolean;
  expiresAt: string;
  usageCount: number;
};

export type ThemeColors = {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
};

export type ThemeConfig = {
  colors: ThemeColors;
  typography: {
    fontFamily: 'Inter' | 'Poppins' | 'Outfit' | 'Montserrat';
    headingWeight: '500' | '600' | '700' | '800';
    bodyWeight: '400' | '500';
  };
  geometry: {
    borderRadius: '0px' | '6px' | '12px' | '9999px';
    stylePreset: 'sharp' | 'subtle' | 'rounded' | 'pill';
  };
  productCardStyle: 'minimal' | 'bordered' | 'shadow-hover' | 'elevated';
};

export type HeroSlide = {
  id: string;
  tagline: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  image: string;
  bgColor: string;
  badgeColor: string;
};

export type SectionType = 
  | 'hero' 
  | 'flash_deals' 
  | 'categories' 
  | 'promo_banners' 
  | 'product_grid' 
  | 'trust_badges' 
  | 'testimonials' 
  | 'faq';

export type PageSection = {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  settings: Record<string, any>;
};

export type NavigationConfig = {
  announcement: {
    enabled: boolean;
    text: string;
    linkText: string;
    linkUrl: string;
    bgColor: string;
    textColor: string;
    speedSeconds: number;
  };
  header: {
    layout: 'left-logo' | 'centered-logo' | 'sticky' | 'glassmorphism';
    showCategoryDropdown: boolean;
    showHotBadges: boolean;
  };
  footer: {
    copyright: string;
    aboutText: string;
    showNewsletter: boolean;
    showPaymentIcons: boolean;
    showSocialLinks: boolean;
  };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
};

export type AuditLog = {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'Success' | 'Warning' | 'Blocked';
};

export type CustomerUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: {
    id: string;
    label: string;
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    isDefault: boolean;
  }[];
  wishlist: string[];
};
