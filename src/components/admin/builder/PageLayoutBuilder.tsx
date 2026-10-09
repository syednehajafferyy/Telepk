'use client';

import React, { useState, useEffect } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  BuilderSection,
  HomepageLayoutConfig,
  BuilderBlockType,
} from '../../../types/builder';
import { DEFAULT_HOMEPAGE_LAYOUT } from '../../../data/defaultBuilderLayout';
import { BlockEditor } from './BlockEditor';
import { LiveStorefrontPreview } from './LiveStorefrontPreview';
import { useStore } from '../../../context/StoreContext';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Grid,
  ShoppingBag,
  Columns,
  MessageSquare,
  HelpCircle,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export const PageLayoutBuilder: React.FC = () => {
  const { addToast, addAuditLog, setActiveView } = useStore();

  // Primary Layout State
  const [sections, setSections] = useState<HomepageLayoutConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('telex_homepage_layout');
      if (saved) {
        try {
          const savedLayout = JSON.parse(saved) as HomepageLayoutConfig;
          return savedLayout.filter((section) => String(section.type) !== 'flash_sale');
        } catch (e) {
          console.error('Failed to parse saved homepage layout', e);
        }
      }
    }
    return DEFAULT_HOMEPAGE_LAYOUT;
  });

  // Selected Block for Inspector Form Editing
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Add Block Dropdown State
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  // Persistence State
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'unsaved'>('synced');

  // Sync to localStorage as backup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('telex_homepage_layout', JSON.stringify(sections));
    }
  }, [sections]);

  // Handle Drag & Drop Block Reordering
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
    setSyncStatus('unsaved');

    addToast(
      'Block Order Updated',
      `Moved "${reorderedItem.title}" to position #${result.destination.index + 1}`,
      'info'
    );
    addAuditLog(
      'Builder Block Reordered',
      `Section ${reorderedItem.title} reordered from index ${result.source.index} to ${result.destination.index}`,
      'Success'
    );
  };

  // Toggle Visibility (Show/Hide)
  const handleToggleVisibility = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextState = !s.enabled;
          addToast(
            nextState ? 'Block Visible' : 'Block Hidden',
            `"${s.title}" is now ${nextState ? 'shown on' : 'hidden from'} storefront`,
            'info'
          );
          return { ...s, enabled: nextState };
        }
        return s;
      })
    );
    setSyncStatus('unsaved');
  };

  // Duplicate Block
  const handleDuplicateBlock = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const targetIdx = sections.findIndex((s) => s.id === id);
    if (targetIdx === -1) return;

    const target = sections[targetIdx];
    const duplicated: BuilderSection = {
      ...target,
      id: `block-${target.type}-${Date.now()}`,
      title: `${target.title} (Copy)`,
      config: JSON.parse(JSON.stringify(target.config)),
    };

    const updated = [...sections];
    updated.splice(targetIdx + 1, 0, duplicated);
    setSections(updated);
    setSelectedBlockId(duplicated.id);
    setSyncStatus('unsaved');

    addToast('Block Duplicated', `Created copy of "${target.title}"`, 'success');
  };

  // Delete Block
  const handleDeleteBlock = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (sections.length <= 1) {
      addToast('Cannot Delete', 'At least 1 homepage block must remain', 'warning');
      return;
    }
    const target = sections.find((s) => s.id === id);
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
    setSyncStatus('unsaved');

    addToast('Block Deleted', `Removed "${target?.title || 'Block'}"`, 'info');
  };

  // Update Config from BlockEditor
  const handleUpdateBlockConfig = (updatedConfig: Record<string, any>) => {
    if (!selectedBlockId) return;
    setSections((prev) =>
      prev.map((s) => (s.id === selectedBlockId ? { ...s, config: updatedConfig } : s))
    );
    setSyncStatus('unsaved');
  };

  // Add New Block Factory
  const handleAddNewBlock = (type: BuilderBlockType) => {
    setIsAddMenuOpen(false);

    let newSection: BuilderSection;
    const timestamp = Date.now();

    switch (type) {
      case 'hero':
        newSection = {
          id: `block-hero-${timestamp}`,
          type: 'hero',
          title: 'Special Promotion Hero Banner',
          enabled: true,
          config: {
            autoplay: true,
            intervalSeconds: 6,
            slides: [
              {
                id: `s-${timestamp}`,
                tagline: 'EXCLUSIVE RELEASE',
                heading: 'All-New SoundCore Liberty 4',
                subheading: 'Premium Hi-Res Audio with CloudComfort Ear Tips',
                badge: 'OFFICIAL 1-YEAR WARRANTY',
                ctaText: 'Explore Now',
                ctaLink: '#products',
                imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&auto=format&fit=crop&q=80',
                videoUrl: '',
                bgGradient: 'from-gray-100 to-white',
              },
            ],
          },
        };
        break;
      case 'categories':
        newSection = {
          id: `block-cat-${timestamp}`,
          type: 'categories',
          title: 'Browse Popular Categories',
          enabled: true,
          config: {
            layout: 'grid-6',
            showCount: true,
            showIcons: true,
          },
        };
        break;
      case 'product_grid':
        newSection = {
          id: `block-grid-${timestamp}`,
          type: 'product_grid',
          title: 'Curated Hot Products Grid',
          enabled: true,
          config: {
            collectionType: 'best_sellers',
            itemsCount: 8,
            manualSkus: ['TLX-QCY-T13-ANC', 'TLX-MIB-GSPRO'],
            sectionTitle: 'Top Rated Tech Gadgets',
            filterTabsEnabled: true,
          },
        };
        break;
      case 'promo_banners':
        newSection = {
          id: `block-promo-${timestamp}`,
          type: 'promo_banners',
          title: 'Dual Promotional Split Banners',
          enabled: true,
          config: {
            columns: 2,
            banners: [
              {
                id: `pb-${timestamp}-1`,
                title: 'High-Power GaN Laptop Adapters',
                subtitle: 'Dual Type-C PD Ports with Surge Shield',
                badgeText: 'Starting Rs. 3,999',
                ctaText: 'View Chargers',
                ctaLink: '#products',
                imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
                gradient: 'from-gray-100 to-white',
              },
              {
                id: `pb-${timestamp}-2`,
                title: 'Rugged AMOLED Smartwatches',
                subtitle: 'GPS navigation, 14-day battery, Bluetooth calling',
                badgeText: 'Weekend Special',
                ctaText: 'View Watches',
                ctaLink: '#products',
                imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
                gradient: 'from-gray-100 to-white',
              },
            ],
          },
        };
        break;
      case 'social_proof':
        newSection = {
          id: `block-proof-${timestamp}`,
          type: 'social_proof',
          title: 'Customer Feedback & Reviews',
          enabled: true,
          config: {
            headline: 'Trusted by 50,000+ Customers Across Pakistan',
            subheadline: 'Real reviews from Karachi, Lahore, Islamabad, and beyond',
            reviews: [
              {
                id: `rev-${timestamp}-1`,
                name: 'Saad Rafiq',
                city: 'Lahore, Gulberg',
                rating: 5,
                productName: 'QCY T13 ANC Earbuds',
                comment: 'Prompt delivery via TCS COD. Sound quality exceeded expectations!',
                verified: true,
              },
            ],
          },
        };
        break;
      case 'faq':
        newSection = {
          id: `block-faq-${timestamp}`,
          type: 'faq',
          title: 'Help & Delivery FAQs',
          enabled: true,
          config: {
            title: 'Frequently Asked Questions',
            faqs: [
              {
                id: `faq-${timestamp}-1`,
                question: 'What payment methods do you accept?',
                answer: 'We accept 100% Cash on Delivery (COD) as well as direct Bank Transfer and Nayapay / Sadapay.',
              },
            ],
          },
        };
        break;
    }

    setSections((prev) => [...prev, newSection]);
    setSelectedBlockId(newSection.id);
    setSyncStatus('unsaved');
    addToast('New Block Added', `Added ${newSection.title}`, 'success');
  };

  // Reset to Default Template
  const handleResetDefaults = () => {
    if (confirm('Reset homepage layout to the factory TeleX default layout? Any unsaved edits will be discarded.')) {
      setSections(DEFAULT_HOMEPAGE_LAYOUT);
      setSelectedBlockId(null);
      setSyncStatus('unsaved');
      addToast('Reset to Defaults', 'TeleX default layout restored', 'info');
    }
  };

  // Save the editable layout in this browser until persistent storage is configured.
  const handleSaveLayout = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('telex_homepage_layout', JSON.stringify(sections));
      setSyncStatus('synced');
      setLastSavedTime(new Date().toLocaleTimeString());
      addToast('Layout saved', 'Saved in this browser.', 'success');
      addAuditLog('Homepage Layout Saved', `Saved ${sections.length} blocks in this browser`, 'Success');
    } catch (err: any) {
      console.error('Save Layout error:', err);
      addToast('Save failed', 'Could not save the layout in this browser.', 'warning');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedBlockId);

  // Helper for block icons
  const getBlockIcon = (type: BuilderBlockType) => {
    switch (type) {
      case 'hero':
        return <Sparkles className="w-4 h-4 text-gray-600" />;
      case 'categories':
        return <Grid className="w-4 h-4 text-gray-600" />;
      case 'product_grid':
        return <ShoppingBag className="w-4 h-4 text-gray-600" />;
      case 'promo_banners':
        return <Columns className="w-4 h-4 text-gray-600" />;
      case 'social_proof':
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
      case 'faq':
        return <HelpCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-gray-900">
      {/* ---------------- Top Global Builder Action Bar ---------------- */}
      <div className="border-b border-gray-200 pb-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
              Page Layout Builder
            </h1>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 font-semibold">
              /admin/builder
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                syncStatus === 'synced'
                  ? 'bg-gray-100 text-gray-700 border border-gray-200'
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  syncStatus === 'synced' ? 'bg-black' : 'bg-gray-400'
                }`}
              />
              {syncStatus === 'synced' ? 'Saved in this browser' : 'Unsaved changes'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Reorder homepage sections and preview the current storefront layout.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Reset Template */}
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold transition flex items-center gap-1.5"
            title="Restore Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          {/* View Live Storefront */}
          <button
            type="button"
            onClick={() => setActiveView('storefront')}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Store</span>
          </button>

          {/* Save & Purge Redis Server Action */}
          <button
            type="button"
            onClick={handleSaveLayout}
            disabled={isSaving}
            className="px-5 py-2 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-semibold transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save layout</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ---------------- Main 2-Panel Side-by-Side Canvas ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT PANEL: Controls & Drag Reorder (5 cols) ================= */}
        <div className="lg:col-span-5 space-y-4">
          {/* Header of Left Panel */}
          <div className="bg-white p-4 rounded-3xl border border-gray-200/90 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-gray-950 flex items-center gap-2">
                <span>Layout Hierarchy</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {sections.length} Blocks
                </span>
              </h2>
              <span className="text-[11px] text-gray-500">Drag handle to reorder live</span>
            </div>

            {/* Add Block Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                className="px-3 py-1.5 rounded-xl bg-black hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Block</span>
              </button>

              {isAddMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-200 shadow-2xl p-2 z-30 space-y-1 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Choose Block Template
                  </div>
                  <button
                    onClick={() => handleAddNewBlock('hero')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition text-left"
                  >
                    <Sparkles className="w-4 h-4 text-gray-600" />
                    <span>Hero Carousel Banner</span>
                  </button>
                  <button
                    onClick={() => handleAddNewBlock('categories')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition text-left"
                  >
                    <Grid className="w-4 h-4 text-gray-600" />
                    <span>Category Showcase</span>
                  </button>
                  <button
                    onClick={() => handleAddNewBlock('product_grid')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition text-left"
                  >
                    <ShoppingBag className="w-4 h-4 text-gray-600" />
                    <span>Dynamic Product Grid (SKUs)</span>
                  </button>
                  <button
                    onClick={() => handleAddNewBlock('promo_banners')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition text-left"
                  >
                    <Columns className="w-4 h-4 text-gray-600" />
                    <span>Promotional Split Banners</span>
                  </button>
                  <button
                    onClick={() => handleAddNewBlock('social_proof')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition text-left"
                  >
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span>Social Proof & Reviews</span>
                  </button>
                  <button
                    onClick={() => handleAddNewBlock('faq')}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition text-left"
                  >
                    <HelpCircle className="w-4 h-4 text-gray-600" />
                    <span>FAQ Accordion Block</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Draggable Blocks List Container */}
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="builder-sections">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-2.5 p-1 rounded-2xl transition-colors ${
                    snapshot.isDraggingOver ? 'bg-gray-100' : ''
                  }`}
                >
                  {sections.map((section, index) => {
                    const isSelected = selectedBlockId === section.id;

                    return (
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              snapshot.isDragging
                                ? 'shadow-2xl ring-2 ring-gray-400 bg-white scale-[1.02] z-40'
                                : isSelected
                                ? 'border-gray-400 bg-gray-100 shadow-md'
                                : section.enabled
                                ? 'border-gray-200/90 bg-white hover:border-gray-300 shadow-xs'
                                : 'border-gray-200 bg-gray-50/80 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              {/* Left: Drag Handle, Icon, and Info */}
                              <div
                                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                                onClick={() =>
                                  setSelectedBlockId(
                                    selectedBlockId === section.id ? null : section.id
                                  )
                                }
                              >
                                {/* Grip Handle */}
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-gray-400 hover:text-gray-700 cursor-grab active:cursor-grabbing p-1 -ml-1"
                                  title="Drag to Reorder"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>

                                {/* Block Icon */}
                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                  {getBlockIcon(section.type)}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-xs font-bold text-gray-900 truncate">
                                      {section.title}
                                    </h3>
                                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0">
                                      {section.type}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-gray-400 font-mono block truncate">
                                    Pos #{index + 1} • {section.enabled ? 'Visible' : 'Hidden'}
                                  </span>
                                </div>
                              </div>

                              {/* Right: Actions (Toggle, Duplicate, Delete) */}
                              <div className="flex items-center gap-1 shrink-0">
                                {/* Toggle Visibility Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleVisibility(section.id, e)}
                                  className={`p-1.5 rounded-lg border transition ${
                                    section.enabled
                                      ? 'border-gray-200 bg-gray-100 text-gray-900 hover:bg-gray-100'
                                      : 'border-gray-200 text-gray-400 hover:text-gray-700'
                                  }`}
                                  title={section.enabled ? 'Click to Hide Block' : 'Click to Show Block'}
                                >
                                  {section.enabled ? (
                                    <Eye className="w-3.5 h-3.5" />
                                  ) : (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Duplicate Block Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleDuplicateBlock(section.id, e)}
                                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition"
                                  title="Duplicate Block"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                {/* Delete Block Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteBlock(section.id, e)}
                                  className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                                  title="Delete Block"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Inspector Form Controls for the Active Selected Block */}
          {selectedSection ? (
            <div className="pt-2">
              <BlockEditor
                section={selectedSection}
                onUpdate={handleUpdateBlockConfig}
                onClose={() => setSelectedBlockId(null)}
              />
            </div>
          ) : (
            <div className="p-6 bg-white rounded-3xl border border-dashed border-gray-200 text-center text-gray-400 space-y-1.5">
              <Sliders className="w-6 h-6 mx-auto opacity-40 text-gray-500" />
              <p className="text-xs font-bold text-gray-700">Click any block to open its live Inspector</p>
              <p className="text-[11px] text-gray-400">
                Configure banners, timers, collections, and copy with real-time feedback.
              </p>
            </div>
          )}
        </div>

        {/* ================= RIGHT PANEL: Live Side-by-Side Storefront Preview (7 cols) ================= */}
        <div className="lg:col-span-7 sticky top-20">
          <LiveStorefrontPreview
            layout={sections}
            activeBlockId={selectedBlockId}
            onSelectBlock={(id) => setSelectedBlockId(id)}
          />
        </div>
      </div>
    </div>
  );
};
