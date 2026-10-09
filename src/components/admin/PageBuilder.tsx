import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { PageSection } from '../../types/ecommerce';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit3,
  Check,
  Plus,
  Trash2,
  Sparkles,
  GripVertical,
} from 'lucide-react';

export const PageBuilder: React.FC = () => {
  const {
    sections,
    updateSection,
    reorderSections,
    toggleSectionEnabled,
    addToast,
    addAuditLog,
  } = useStore();

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderSections(index, index - 1);
      addToast('Section Moved Up', '', 'info');
      addAuditLog('Section Reordered', `Moved section ${sections[index].title} up`, 'Success');
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < sections.length - 1) {
      reorderSections(index, index + 1);
      addToast('Section Moved Down', '', 'info');
      addAuditLog('Section Reordered', `Moved section ${sections[index].title} down`, 'Success');
    }
  };

  const handleToggle = (id: string, title: string, currentEnabled: boolean) => {
    toggleSectionEnabled(id);
    addToast(
      currentEnabled ? 'Section Hidden' : 'Section Enabled',
      `${title} is now ${currentEnabled ? 'hidden' : 'visible'} on storefront`,
      'info'
    );
    addAuditLog('Section Visibility Toggled', `${title} set to ${!currentEnabled}`, 'Success');
  };

  const editingSection = sections.find((s) => s.id === editingSectionId);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-950">
              Page Builder & Dynamic Sections
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-900 uppercase">
              Drag & Reorder
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Store managers have 100% control over the homepage structure. Rearrange or toggle any block in real time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sections List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider px-2">
            <span>Section Hierarchy ({sections.length} Blocks)</span>
            <span>Controls</span>
          </div>

          <div className="space-y-2.5">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  section.enabled
                    ? editingSectionId === section.id
                      ? 'border-gray-400 bg-gray-100 shadow-sm'
                      : 'border-gray-200/90 bg-white shadow-xs hover:border-gray-300'
                    : 'border-gray-200 bg-gray-50/70 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center text-gray-400">
                    <span className="font-mono text-xs font-bold text-gray-400 w-5">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {section.title}
                      </h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                        {section.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {section.subtitle || 'Configurable homepage block'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Move Up */}
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveUp(idx)}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:pointer-events-none transition"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down */}
                  <button
                    disabled={idx === sections.length - 1}
                    onClick={() => handleMoveDown(idx)}
                    className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:pointer-events-none transition"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit Config */}
                  <button
                    onClick={() => setEditingSectionId(editingSectionId === section.id ? null : section.id)}
                    className={`p-1.5 rounded-lg border transition ${
                      editingSectionId === section.id
                        ? 'border-gray-400 bg-black text-white'
                        : 'border-gray-200 hover:bg-gray-100 text-gray-600'
                    }`}
                    title="Edit Settings"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => handleToggle(section.id, section.title, section.enabled)}
                    className={`p-1.5 rounded-lg border transition ${
                      section.enabled
                        ? 'border-gray-200 bg-gray-100 text-gray-900'
                        : 'border-gray-200 text-gray-400 hover:text-gray-700'
                    }`}
                    title={section.enabled ? 'Click to Hide' : 'Click to Show'}
                  >
                    {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Config Editor (5 cols) */}
        <div className="lg:col-span-5">
          {editingSection ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900">
                    Live Section Settings
                  </span>
                  <h3 className="text-sm font-bold text-gray-950 mt-0.5">
                    {editingSection.title}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingSectionId(null)}
                  className="text-xs text-gray-400 hover:text-gray-700"
                >
                  Close
                </button>
              </div>

              {/* General Title & Subtitle */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Display Title
                  </label>
                  <input
                    type="text"
                    value={editingSection.title}
                    onChange={(e) => updateSection(editingSection.id, { title: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Subheading / Tagline
                  </label>
                  <input
                    type="text"
                    value={editingSection.subtitle || ''}
                    onChange={(e) => updateSection(editingSection.id, { subtitle: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-200"
                  />
                </div>
              </div>

              {/* Type-Specific Settings */}
              {editingSection.type === 'flash_deals' && (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900">Flash Sale Configuration</h4>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Sale Headline</label>
                    <input
                      type="text"
                      value={editingSection.settings.dealTitle || ''}
                      onChange={(e) =>
                        updateSection(editingSection.id, {
                          settings: { ...editingSection.settings, dealTitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Timer Hours</label>
                      <input
                        type="number"
                        value={editingSection.settings.timerHours || 12}
                        onChange={(e) =>
                          updateSection(editingSection.id, {
                            settings: { ...editingSection.settings, timerHours: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Show Claim Bar</label>
                      <select
                        value={editingSection.settings.showProgressBar ? 'yes' : 'no'}
                        onChange={(e) =>
                          updateSection(editingSection.id, {
                            settings: { ...editingSection.settings, showProgressBar: e.target.value === 'yes' },
                          })
                        }
                        className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                      >
                        <option value="yes">Enabled (Show 82% Claimed)</option>
                        <option value="no">Disabled</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {editingSection.type === 'hero' && (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-900">Hero Carousel Slides</h4>
                  <p className="text-[11px] text-gray-500">
                    Active slides count: {editingSection.settings.slides?.length || 0}. Autoplay is enabled.
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {editingSection.settings.slides?.map((slide: any, sIdx: number) => (
                      <div key={slide.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                        <span className="font-bold text-gray-800">Slide {sIdx + 1}: {slide.heading}</span>
                        <p className="text-[11px] text-gray-400 truncate">{slide.subheading}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => {
                    addToast('Configuration Saved', 'Storefront updated automatically', 'success');
                    setEditingSectionId(null);
                  }}
                  className="w-full py-2.5 bg-gray-950 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow"
                >
                  Save & Apply Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-3xl p-8 border border-dashed border-gray-200 text-center text-gray-400 text-xs">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-gray-600">Select any section on the left to edit its parameters.</p>
              <p className="mt-1">Changes sync live to your storefront in real time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
