import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { ThemeCustomizer } from './ThemeCustomizer';
import { PageBuilder } from './PageBuilder';
import { PageLayoutBuilder } from './builder/PageLayoutBuilder';
import { NavFooterBuilder } from './NavFooterBuilder';
import { CatalogManager } from './CatalogManager';
import { OrderManager } from './OrderManager';
import { CustomerManager } from './CustomerManager';
import { PromotionEngine } from './PromotionEngine';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { AuditLogsViewer } from './AuditLogsViewer';
import { DynamicPageRenderer } from '../storefront/DynamicPageRenderer';
import {
  Palette,
  Layers,
  Layout,
  Package,
  ShoppingBag,
  Users,
  Tag,
  TrendingUp,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Monitor,
  Smartphone,
  Eye,
  ArrowRight,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { logoutAdmin } = useAuth();
  const { isLivePreviewMode, setIsLivePreviewMode } = useStore();

  const [activeTab, setActiveTab] = useState<
    'theme' | 'pages' | 'nav' | 'catalog' | 'orders' | 'crm' | 'promos' | 'analytics' | 'logs'
  >('orders');

  const menuItems = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'catalog', label: 'Inventory', icon: Package },
    { id: 'theme', label: 'Theme & Skin Engine', icon: Palette },
    { id: 'pages', label: 'Page Builder Sections', icon: Layers },
    { id: 'nav', label: 'Header & Navigation', icon: Layout },
    { id: 'crm', label: 'Customer CRM', icon: Users },
    { id: 'promos', label: 'Promotions & Coupons', icon: Tag },
    { id: 'analytics', label: 'Revenue Analytics', icon: TrendingUp },
    { id: 'logs', label: 'Security Audit Logs', icon: ShieldCheck },
  ];

  const accessibleItems = menuItems;

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-slate-800 flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand & Gateway */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center text-white font-extrabold text-sm">
              TX
            </div>
            <div>
              <span className="font-black text-base text-slate-900 tracking-tight">
                Tele<span className="text-black">X</span> CMS
              </span>
              <span className="text-[10px] font-mono text-slate-500 block -mt-1">
                Zero-Code Admin Engine
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Preview Switcher */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
          <button
            onClick={() => setIsLivePreviewMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              !isLivePreviewMode
                ? 'bg-white text-black shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Dashboard</span>
          </button>
          <button
            onClick={() => setIsLivePreviewMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              isLivePreviewMode
                ? 'bg-white text-black shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Split-Screen Live Preview</span>
          </button>
        </div>

        {/* Storefront and sign-out actions */}
        <div className="flex items-center gap-3">
          {/* Jump to Live Storefront */}
          <button
            onClick={() => window.location.assign('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition border border-slate-200"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Logout */}
          <button
            onClick={async () => {
              await logoutAdmin();
              window.location.assign('/');
            }}
            className="p-2 rounded-lg text-slate-500 hover:text-gray-900 hover:bg-gray-100 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Admin Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 block">
              Admin Modules
            </span>
            {accessibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

        </aside>

        {/* Center / Split View Container */}
        <main className="flex-1 overflow-y-auto bg-[#f5f7f8] p-4 sm:p-6 lg:p-8 flex gap-6">
          {/* Active Settings Panel */}
          <div
            className={`transition-all duration-300 ${
              isLivePreviewMode ? 'w-1/2 overflow-y-auto pr-2' : 'w-full max-w-6xl mx-auto'
            }`}
          >
            {activeTab === 'theme' && <ThemeCustomizer />}
            {activeTab === 'pages' && <PageLayoutBuilder />}
            {activeTab === 'nav' && <NavFooterBuilder />}
            {activeTab === 'catalog' && <CatalogManager />}
            {activeTab === 'orders' && <OrderManager />}
            {activeTab === 'crm' && <CustomerManager />}
            {activeTab === 'promos' && <PromotionEngine />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'logs' && <AuditLogsViewer />}
          </div>

          {/* Split-Screen Real-Time Storefront Preview */}
          {isLivePreviewMode && (
            <div className="w-1/2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto max-h-[85vh] p-4 text-gray-900">
              <div className="sticky top-0 bg-white/95 backdrop-blur-md pb-2 mb-3 border-b border-gray-100 flex items-center justify-between text-xs font-bold">
                <span className="text-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-200 animate-ping" />
                  Live Storefront Synchronization
                </span>
                <span className="text-gray-400 text-[10px]">Real-Time CSS & JSON Rendering</span>
              </div>
              <DynamicPageRenderer />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
