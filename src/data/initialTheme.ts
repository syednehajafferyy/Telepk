import { ThemeConfig, NavigationConfig } from '../types/ecommerce';

export const INITIAL_THEME: ThemeConfig = {
  colors: {
    primary: '#1362D7', // Primary Brand Color (Royal Blue)
    primaryHover: '#0E4FAF',
    secondary: '#1893B8', // Supporting Secondary (Teal/Cyan)
    accent: '#65C42C', // Accent / Highlights (Lime Green)
    background: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
  },
  typography: {
    fontFamily: 'Outfit',
    headingWeight: '700',
    bodyWeight: '400',
  },
  geometry: {
    borderRadius: '12px',
    stylePreset: 'rounded',
  },
  productCardStyle: 'shadow-hover',
};

export const INITIAL_NAVIGATION: NavigationConfig = {
  announcement: {
    enabled: true,
    text: 'FLASH SALE: Free Express TCS Shipping Across Pakistan on Orders Over Rs. 2,500! Use Code: FREESHIP',
    linkText: 'Claim Free Shipping',
    linkUrl: '#flash-deals',
    bgColor: '#1362D7',
    textColor: '#ffffff',
    speedSeconds: 15,
  },
  header: {
    layout: 'sticky',
    showCategoryDropdown: true,
    showHotBadges: true,
  },
  footer: {
    copyright: '© 2026 TeleX Pakistan (Pvt.) Ltd. All Rights Reserved. Empowering smart lifestyles.',
    aboutText: 'TeleX.pk is Pakistan’s leading direct-to-consumer destination for 100% genuine smart gadgets, wireless audio, GaN chargers, and mobile accessories. Guaranteed authentic products with official warranties.',
    showNewsletter: true,
    showPaymentIcons: true,
    showSocialLinks: true,
  },
};
