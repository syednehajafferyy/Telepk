import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  Customer,
  Coupon,
  ThemeConfig,
  NavigationConfig,
  PageSection,
  AuditLog,
  OrderStatus,
} from '../types/ecommerce';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialProducts';
import { INITIAL_THEME, INITIAL_NAVIGATION } from '../data/initialTheme';
import { INITIAL_PAGE_SECTIONS } from '../data/initialSections';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // Navigation & Views
  activeView: 'storefront' | 'pdp' | 'checkout' | 'customer-dashboard' | 'admin-dashboard';
  setActiveView: (view: 'storefront' | 'pdp' | 'checkout' | 'customer-dashboard' | 'admin-dashboard') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  openProductBySlug: (slug: string) => void;
  selectedTrackingOrder: Order | null;
  setSelectedTrackingOrder: (order: Order | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Catalog & Inventory
  products: Product[];
  categories: Category[];
  addProduct: (prod: Product) => void;
  updateProduct: (prod: Product) => void;
  deleteProduct: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;

  // Cart & Drawer
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutAuthModalOpen: boolean;
  setIsCheckoutAuthModalOpen: (open: boolean) => void;
  addToCart: (product: Product, selectedColor?: string, selectedStorage?: string, selectedWarranty?: string, quantity?: number) => void;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotalCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders & Fulfillment
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

  // Customers & CRM
  customers: Customer[];
  addCustomer: (customer: Customer) => void;

  // Coupons & Promotions
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (id: string) => void;

  // Zero-Code Dynamic Layout & Theme
  theme: ThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<ThemeConfig>>;
  updateThemeColors: (colors: Partial<ThemeConfig['colors']>) => void;
  updateThemeTypography: (fontFamily: ThemeConfig['typography']['fontFamily']) => void;
  updateThemeGeometry: (preset: ThemeConfig['geometry']['stylePreset']) => void;
  updateProductCardStyle: (style: ThemeConfig['productCardStyle']) => void;
  resetThemeToDefault: () => void;

  // Page Builder Sections
  sections: PageSection[];
  updateSection: (id: string, updates: Partial<PageSection>) => void;
  reorderSections: (dragIndex: number, hoverIndex: number) => void;
  toggleSectionEnabled: (id: string) => void;

  // Navigation & Footer Config
  navigationConfig: NavigationConfig;
  setNavigationConfig: React.Dispatch<React.SetStateAction<NavigationConfig>>;

  // Security Audit Logs
  auditLogs: AuditLog[];
  refreshAuditLogs: () => Promise<void>;
  addAuditLog: (action: string, details: string, status?: 'Success' | 'Warning' | 'Blocked') => Promise<void>;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Toast Notifications
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Split-Screen / Live Preview toggle
  isLivePreviewMode: boolean;
  setIsLivePreviewMode: (val: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Views
  const [activeView, setActiveView] = useState<'storefront' | 'pdp' | 'checkout' | 'customer-dashboard' | 'admin-dashboard'>('storefront');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLivePreviewMode, setIsLivePreviewMode] = useState(false);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('telex_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('telex_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutAuthModalOpen, setIsCheckoutAuthModalOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('telex_wishlist');
    return saved ? JSON.parse(saved) : ['prod-mibro-gs-pro'];
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('telex_orders');
    if (!saved) return [];

    const sampleOrderIds = new Set(['ord-1001', 'ord-1002', 'ord-1003', 'ord-1004']);
    return (JSON.parse(saved) as Order[]).filter((order) => !sampleOrderIds.has(order.id));
  });

  // Customers State
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('telex_customers');
    if (!saved) return [];
    const sampleIds = new Set(['cust-101', 'cust-102', 'cust-103', 'cust-104', 'cust-105']);
    return (JSON.parse(saved) as Customer[]).filter((customer) => !sampleIds.has(customer.id));
  });

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('telex_coupons');
    if (!saved) return [];
    const sampleIds = new Set(['coup-1', 'coup-2', 'coup-3', 'coup-4']);
    return (JSON.parse(saved) as Coupon[]).filter((coupon) => !sampleIds.has(coupon.id));
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Theme & Layout State
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('telex_theme');
    return saved ? JSON.parse(saved) : INITIAL_THEME;
  });

  const [sections, setSections] = useState<PageSection[]>(() => {
    const saved = localStorage.getItem('telex_sections');
    return saved ? JSON.parse(saved) : INITIAL_PAGE_SECTIONS;
  });

  const [navigationConfig, setNavigationConfig] = useState<NavigationConfig>(() => {
    const saved = localStorage.getItem('telex_navigation');
    return saved ? JSON.parse(saved) : INITIAL_NAVIGATION;
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const refreshAuditLogs = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/auth/audit-logs', { credentials: 'same-origin' });
      if (!response.ok) return;
      const result = await response.json() as { logs?: AuditLog[] };
      setAuditLogs(result.logs || []);
    } catch {
      return;
    }
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Real-Time CSS Variable Injection on document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-hover', theme.colors.primaryHover);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-card', theme.colors.card);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--radius-base', theme.geometry.borderRadius);
    root.style.setProperty('--font-family', `'${theme.typography.fontFamily}', sans-serif`);
    root.style.setProperty('--font-heading', `'${theme.typography.fontFamily}', sans-serif`);

    localStorage.setItem('telex_theme', JSON.stringify(theme));
  }, [theme]);

  // Persist storage updates
  useEffect(() => {
    localStorage.setItem('telex_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('telex_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('telex_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('telex_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('telex_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('telex_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('telex_sections', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('telex_navigation', JSON.stringify(navigationConfig));
  }, [navigationConfig]);

  useEffect(() => {
    localStorage.removeItem('telex_audit_logs');
    void refreshAuditLogs();
  }, [refreshAuditLogs]);

  // Toast Helpers
  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Open Product by Slug
  const openProductBySlug = (slug: string) => {
    const prod = products.find((p) => p.slug === slug);
    if (prod) {
      setSelectedProduct(prod);
      setActiveView('pdp');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (
    product: Product,
    selectedColor?: string,
    selectedStorage?: string,
    selectedWarranty?: string,
    quantity = 1
  ) => {
    // calculate variant price
    let finalPrice = product.price;
    if (selectedColor && product.variants) {
      const match = product.variants.find((v) => v.colorName === selectedColor);
      if (match) finalPrice += match.priceDelta;
    }

    const cartItemId = `${product.id}-${selectedColor || 'def'}-${selectedStorage || 'def'}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            id: cartItemId,
            productId: product.id,
            title: product.name,
            price: finalPrice,
            originalPrice: product.originalPrice,
            image: product.images[0] || '',
            quantity,
            selectedColor,
            selectedStorage,
            selectedWarranty,
          },
        ];
      }
    });

    addToast('Added to Cart', `${product.name} (${quantity}x) added to your cart`, 'success');
    setIsCartOpen(true);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    addToast('Item Removed', 'The item was removed from your cart', 'info');
  };

  const clearCart = () => setCart([]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from Wishlist', prod ? prod.name : '', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Added to Wishlist ❤️', prod ? prod.name : '', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders
  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'timeline' | 'trackingNumber'>): Order => {
    const orderNum = `TLX-PK-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingCode = `TCS-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      trackingNumber: trackingCode,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          title: 'Order Placed',
          description: `Order ${orderNum} confirmed via ${orderData.paymentMethod.toUpperCase()}`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          title: 'Processing at Karachi Hub',
          description: 'Quality check and retail seal verification',
          timestamp: 'Pending',
          completed: false,
        },
        {
          title: 'Dispatched via TCS Express',
          description: `Tracking Consignment: ${trackingCode}`,
          timestamp: 'Pending',
          completed: false,
        },
        {
          title: 'Delivered',
          description: 'Doorstep Cash Collection and Handover',
          timestamp: 'Pending',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    addAuditLog('New Order Placed', `Order ${orderNum} placed by ${orderData.customerName} (Total: Rs. ${orderData.total.toLocaleString()})`, 'Success');

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = [...ord.timeline];
          if (status === 'Shipped') {
            updatedTimeline[1] = { ...updatedTimeline[1], completed: true, timestamp: 'Today' };
            updatedTimeline[2] = { ...updatedTimeline[2], completed: true, current: true, timestamp: 'Today' };
          } else if (status === 'Delivered') {
            updatedTimeline.forEach((step) => ({ ...step, completed: true }));
            updatedTimeline[3] = { ...updatedTimeline[3], completed: true, current: true, timestamp: 'Today' };
          }

          return {
            ...ord,
            orderStatus: status,
            trackingNumber: trackingNumber || ord.trackingNumber,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
    addToast('Order Updated', `Status updated to ${status}`, 'success');
    addAuditLog('Order Status Changed', `Order ${orderId} marked as ${status}`, 'Success');
  };

  // Catalog Methods
  const addProduct = (prod: Product) => {
    setProducts((prev) => [prod, ...prev]);
    addToast('Product Added', `${prod.name} has been added to catalog`, 'success');
    addAuditLog('Product Created', `Added product: ${prod.name} (SKU: ${prod.sku})`, 'Success');
  };

  const updateProduct = (prod: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
    addToast('Product Updated', `${prod.name} changes saved`, 'success');
    addAuditLog('Product Updated', `Updated product details for ${prod.name}`, 'Success');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product Deleted', prod ? prod.name : '', 'info');
    addAuditLog('Product Deleted', `Deleted product ID: ${id}`, 'Warning');
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
    addToast('Stock Adjusted', `Inventory count updated to ${newStock}`, 'success');
  };

  // Customers
  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => [customer, ...prev]);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const match = coupons.find((c) => c.code === cleanCode && c.active);

    if (!match) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    if (cartSubtotal < match.minSpend) {
      return {
        success: false,
        message: `Coupon requires a minimum order of Rs. ${match.minSpend.toLocaleString()}`,
      };
    }

    setAppliedCoupon(match);
    addToast('Coupon Applied! 🎉', match.description, 'success');
    return { success: true, message: 'Coupon applied successfully' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon Removed', '', 'info');
  };

  const createCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    addToast('Coupon Created', `Code ${coupon.code} is now active`, 'success');
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  // Theme Customizer Actions
  const updateThemeColors = (colors: Partial<ThemeConfig['colors']>) => {
    setTheme((prev) => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));
  };

  const updateThemeTypography = (fontFamily: ThemeConfig['typography']['fontFamily']) => {
    setTheme((prev) => ({
      ...prev,
      typography: { ...prev.typography, fontFamily },
    }));
  };

  const updateThemeGeometry = (preset: ThemeConfig['geometry']['stylePreset']) => {
    const radiusMap = {
      sharp: '0px' as const,
      subtle: '6px' as const,
      rounded: '12px' as const,
      pill: '9999px' as const,
    };
    setTheme((prev) => ({
      ...prev,
      geometry: {
        stylePreset: preset,
        borderRadius: radiusMap[preset],
      },
    }));
  };

  const updateProductCardStyle = (style: ThemeConfig['productCardStyle']) => {
    setTheme((prev) => ({
      ...prev,
      productCardStyle: style,
    }));
  };

  const resetThemeToDefault = () => {
    setTheme(INITIAL_THEME);
    addToast('Theme Reset', 'Reverted to default TeleX.pk brand styling', 'info');
  };

  // Sections Engine
  const updateSection = (id: string, updates: Partial<PageSection>) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
    );
  };

  const reorderSections = (dragIndex: number, hoverIndex: number) => {
    setSections((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(dragIndex, 1);
      copy.splice(hoverIndex, 0, removed);
      return copy.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    });
  };

  const toggleSectionEnabled = (id: string) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, enabled: !sec.enabled } : sec))
    );
  };

  // Audit Logs
  const addAuditLog = async (
    action: string,
    details: string,
    status: 'Success' | 'Warning' | 'Blocked' = 'Success'
  ) => {
    try {
      const response = await fetch('/api/admin/auth/audit-logs', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, details, status }),
      });
      if (!response.ok) return;
      const result = await response.json() as { log?: AuditLog };
      if (result.log) setAuditLogs((prev) => [result.log!, ...prev].slice(0, 500));
    } catch {
      return;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        openProductBySlug,
        selectedTrackingOrder,
        setSelectedTrackingOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,
        cart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutAuthModalOpen,
        setIsCheckoutAuthModalOpen,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotalCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        customers,
        addCustomer,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        createCoupon,
        toggleCouponStatus,
        theme,
        setTheme,
        updateThemeColors,
        updateThemeTypography,
        updateThemeGeometry,
        updateProductCardStyle,
        resetThemeToDefault,
        sections,
        updateSection,
        reorderSections,
        toggleSectionEnabled,
        navigationConfig,
        setNavigationConfig,
        auditLogs,
        refreshAuditLogs,
        addAuditLog,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        addToast,
        removeToast,
        isLivePreviewMode,
        setIsLivePreviewMode,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
