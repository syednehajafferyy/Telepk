import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { ToastContainer } from './components/common/Toast';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { DynamicPageRenderer } from './components/storefront/DynamicPageRenderer';
import { ProductDetailPage } from './components/storefront/ProductDetailPage';
import { CheckoutPage } from './components/storefront/CheckoutPage';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CustomerPortalModal } from './components/storefront/CustomerPortalModal';
import { CheckoutAuthModal } from './components/storefront/CheckoutAuthModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { ThemeProvider } from './components/providers/ThemeProvider';

const AppContent: React.FC = () => {
  const { activeView, setActiveView } = useStore();
  const { isAdminLoggedIn, isAdminSessionLoading, setIsAdminModalOpen } = useAuth();
  const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';

  useEffect(() => {
    if (!isAdminRoute || isAdminSessionLoading) return;
    if (isAdminLoggedIn) {
      setActiveView('admin-dashboard');
    } else {
      setIsAdminModalOpen(true);
    }
  }, [isAdminRoute, isAdminLoggedIn, isAdminSessionLoading, setActiveView, setIsAdminModalOpen]);

  if (isAdminRoute) {
    if (isAdminSessionLoading) {
      return <div className="min-h-screen bg-slate-50" />;
    }

    if (isAdminLoggedIn) {
      return (
        <>
          <AdminLayout />
          <ToastContainer />
        </>
      );
    }

    return (
      <>
        <div className="min-h-screen bg-slate-950" />
        <AdminLoginModal />
        <ToastContainer />
      </>
    );
  }

  // If in admin view and authenticated, render full admin command center
  if (activeView === 'admin-dashboard') {
    if (isAdminLoggedIn) {
      return (
        <>
          <AdminLayout />
          <ToastContainer />
        </>
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)] transition-colors duration-200">
      {/* Main Sticky Header */}
      <Navbar />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeView === 'storefront' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DynamicPageRenderer />
          </div>
        )}

        {activeView === 'pdp' && <ProductDetailPage />}

        {activeView === 'checkout' && <CheckoutPage />}

        {activeView === 'customer-dashboard' && <CustomerDashboard />}
      </main>

      {/* 4-Column Footer */}
      <Footer />

      {/* Floating Utilities & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <CustomerPortalModal />
      <CheckoutAuthModal />
      <AdminLoginModal />
      <WhatsAppButton />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
