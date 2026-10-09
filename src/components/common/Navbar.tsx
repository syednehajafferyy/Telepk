import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  PhoneCall,
  ChevronDown,
  Layers,
  ArrowRight,
  Sparkles,
  Grid,
  LogOut,
  Package,
  MapPin,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    products,
    categories,
    cartTotalCount,
    cartSubtotal,
    setIsCartOpen,
    wishlist,
    setActiveView,
    activeView,
    openProductBySlug,
    selectedCategory,
    setSelectedCategory,
    navigationConfig,
  } = useStore();

  const {
    session,
    status,
    customer,
    setIsCustomerModalOpen,
    logoutCustomer,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headerLayout = navigationConfig?.header?.layout || 'sticky';
  const isAuthenticated = status === 'authenticated' && Boolean(session?.user);
  const currentUser = session?.user;

  return (
    <header
      className="w-full z-40 sticky top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all duration-300"
    >
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Categories Trigger */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setActiveView('storefront');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-left group min-h-[44px] py-1 cursor-pointer shrink-0"
            title="TeleX Official Gadgets"
          >
            <img
              src="/images/telex-logo.svg"
              alt="TeleX Official Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </button>

          {/* Categories Dropdown Menu (Desktop) */}
          <div ref={categoryMenuRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="min-h-[42px] px-4 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-[#1362D7] hover:bg-slate-50 transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5 text-[#1362D7]" />
              <span>Browse Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Featured Product Categories
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setActiveView('storefront');
                    setIsCategoryMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50/70 hover:text-[#1362D7] transition min-h-[44px] cursor-pointer"
                >
                  <span>All Catalog Gadgets</span>
                  <span className="text-[10px] text-slate-400 font-mono">{products.length} Products</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setActiveView('storefront');
                      setIsCategoryMenuOpen(false);
                      const grid = document.getElementById('product-grid');
                      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-blue-50/70 hover:text-[#1362D7] transition min-h-[44px] cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{cat.productCount} items</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Search Autocomplete with Instant Results */}
        <div ref={searchRef} className="flex-1 max-w-md relative hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search earbuds, smartwatches, 65W chargers..."
              className="w-full min-h-[42px] pl-10 pr-12 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#1362D7] rounded-full outline-none transition-all shadow-2xs placeholder-slate-400 font-medium text-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
              <div className="p-2.5 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-bold bg-gray-50/70">
                <span>Matching Gadgets ({searchResults.length})</span>
                <span className="text-[10px] text-gray-400 font-mono">Press Esc to close</span>
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        openProductBySlug(prod.slug);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-3 flex items-center gap-3 hover:bg-indigo-50/40 cursor-pointer transition min-h-[48px]"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-12 object-cover rounded-xl bg-gray-100 shrink-0 border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">
                          {prod.brand}
                        </span>
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {prod.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-extrabold text-gray-950">
                            Rs. {prod.price.toLocaleString()}
                          </span>
                          {prod.originalPrice > prod.price && (
                            <span className="text-[11px] text-gray-400 line-through">
                              Rs. {prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-gray-500">
                  No products found matching "{searchQuery}". Try "QCY", "Mibro", or "Anker".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation Controls: Wishlist, Cart Drawer Trigger, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist Link - 48px touch target */}
          <button
            type="button"
            onClick={() => {
              if (isAuthenticated) {
                setActiveView('customer-dashboard');
              } else {
                setIsCustomerModalOpen(true);
              }
            }}
            className="relative min-w-[48px] min-h-[48px] rounded-2xl hover:bg-gray-100 text-gray-700 transition flex items-center justify-center cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger - 48px touch target */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 transition font-medium min-h-[48px] cursor-pointer"
            title="Open Cart Drawer"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-800" />
              {cartTotalCount > 0 && (
                <span
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="absolute -top-2.5 -right-2.5 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white"
                >
                  {cartTotalCount}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-[10px] text-gray-500 block leading-tight font-semibold">My Cart</span>
              <span className="text-xs font-black text-gray-900 block leading-tight">
                Rs. {cartSubtotal.toLocaleString()}
              </span>
            </div>
          </button>

          {/* DYNAMIC HEADER AUTH STATE (Requirement 1) */}
          {isAuthenticated && currentUser ? (
            /* 1. Authenticated State: User Avatar, Initials, and Interactive Dropdown */
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="min-h-[48px] flex items-center gap-2 p-1.5 pl-2.5 rounded-2xl border border-gray-200 hover:border-gray-300 bg-white transition cursor-pointer"
                title="Account Menu"
              >
                <div
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="w-7 h-7 rounded-xl text-white font-black text-xs flex items-center justify-center uppercase shadow-xs"
                >
                  {currentUser.name.slice(0, 1)}
                </div>
                <span className="text-xs font-bold text-gray-800 hidden md:inline truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 hidden md:inline transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-950 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-gray-500 truncate font-mono mt-0.5">{currentUser.phone || currentUser.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('customer-dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <Package className="w-4 h-4 text-indigo-500" />
                    <span>My Orders & Timeline</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('customer-dashboard');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Delivery Addresses</span>
                  </button>

                  <div className="pt-1 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => {
                        logoutCustomer();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 2. Default State (Unauthenticated / Guest): Sleek TeleX Royal Blue Pill Button */
            <button
              type="button"
              onClick={() => setIsCustomerModalOpen(true)}
              className="bg-[#1362D7] hover:bg-[#0d4ca8] text-white rounded-full px-5 py-2 text-xs font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer border border-transparent hover:shadow-md active:scale-98 min-h-[40px]"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Mobile Menu Hamburger - 48px touch target */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="min-w-[48px] min-h-[48px] rounded-2xl hover:bg-gray-100 text-gray-700 lg:hidden flex items-center justify-center cursor-pointer"
            title="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-4 animate-fade-in shadow-xl">
          {/* Mobile Auth Status Banner */}
          {isAuthenticated && currentUser ? (
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center uppercase shrink-0"
                >
                  {currentUser.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono truncate">{currentUser.phone || currentUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logoutCustomer();
                  setIsMobileMenuOpen(false);
                }}
                className="text-[11px] font-bold text-rose-600 hover:underline p-1 shrink-0"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsCustomerModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white rounded-2xl font-bold text-xs shadow-sm cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}

          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full min-h-[48px] pl-10 pr-3 py-2 text-xs bg-gray-100 rounded-2xl outline-none border border-transparent focus:border-indigo-500 font-medium"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Categories List */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">
              Browse Categories
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setActiveView('storefront');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center justify-between min-h-[48px]"
            >
              <span>All Products</span>
              <span className="text-[11px] text-gray-400 font-mono">{products.length}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.name);
                  setActiveView('storefront');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 flex items-center justify-between min-h-[48px]"
              >
                <span>{c.name}</span>
                <span className="text-[11px] text-gray-400 font-mono">{c.productCount}</span>
              </button>
            ))}
          </div>

        </div>
      )}
    </header>
  );
};
