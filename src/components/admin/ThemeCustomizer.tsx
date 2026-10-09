import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Palette, Type, Square, LayoutTemplate, RotateCcw, Check, Sparkles } from 'lucide-react';

export const ThemeCustomizer: React.FC = () => {
  const {
    theme,
    updateThemeColors,
    updateThemeTypography,
    updateThemeGeometry,
    updateProductCardStyle,
    resetThemeToDefault,
    addToast,
    addAuditLog,
  } = useStore();

  const handleColorChange = (key: keyof typeof theme.colors, value: string) => {
    updateThemeColors({ [key]: value });
    addAuditLog('Theme Color Modified', `Updated ${key} to ${value}`, 'Success');
  };

  const handleFontChange = (font: typeof theme.typography.fontFamily) => {
    updateThemeTypography(font);
    addAuditLog('Typography Changed', `Global storefront font set to ${font}`, 'Success');
    addToast('Typography Updated', `Storefront font family changed to ${font}`, 'success');
  };

  const handleGeometryChange = (preset: typeof theme.geometry.stylePreset) => {
    updateThemeGeometry(preset);
    addAuditLog('Geometry Updated', `Border radius preset changed to ${preset}`, 'Success');
    addToast('Geometry Updated', `Component geometry changed to ${preset}`, 'success');
  };

  const handleCardStyleChange = (style: typeof theme.productCardStyle) => {
    updateProductCardStyle(style);
    addAuditLog('Card Style Changed', `Product card style preset changed to ${style}`, 'Success');
    addToast('Product Card Style Changed', `Style applied: ${style}`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-gray-950">
              Theme & Styling Customizer
            </h2>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 text-gray-900 uppercase">
              Zero-Code Live Engine
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time Edge JSON styling injection: All changes reflect instantly on the storefront without code redeployment.
          </p>
        </div>

        <button
          onClick={resetThemeToDefault}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
          <span>Reset to TeleX Default</span>
        </button>
      </div>

      {/* 1. Brand Color Palettes */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-950">1. Global Brand Color Palettes</h3>
            <p className="text-xs text-gray-500">Live dynamic CSS variable color pickers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Primary Color */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-2">
            <label className="text-xs font-bold text-gray-700 block">Primary Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={theme.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono font-bold bg-white border border-gray-200 rounded-lg uppercase"
              />
            </div>
            <span className="text-[10px] text-gray-400 block">Buttons, badges, active accents</span>
          </div>

          {/* Secondary Color */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-2">
            <label className="text-xs font-bold text-gray-700 block">Secondary Dark Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={theme.colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono font-bold bg-white border border-gray-200 rounded-lg uppercase"
              />
            </div>
            <span className="text-[10px] text-gray-400 block">Headers, hero cards, dark mode</span>
          </div>

          {/* Accent Color */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-2">
            <label className="text-xs font-bold text-gray-700 block">Accent / Gold Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={theme.colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono font-bold bg-white border border-gray-200 rounded-lg uppercase"
              />
            </div>
            <span className="text-[10px] text-gray-400 block">Flash deal highlights, star ratings</span>
          </div>

          {/* Background Canvas */}
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-2">
            <label className="text-xs font-bold text-gray-700 block">Store Canvas Background</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={theme.colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={theme.colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-24 px-2 py-1 text-xs font-mono font-bold bg-white border border-gray-200 rounded-lg uppercase"
              />
            </div>
            <span className="text-[10px] text-gray-400 block">Base page canvas tone</span>
          </div>
        </div>

        {/* Quick Brand Preset Palettes */}
        <div className="pt-2">
          <label className="text-xs font-bold text-gray-700 block mb-2">
            One-Click Curated Brand Palettes:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {[
              { name: 'TeleX Monochrome', primary: '#000000', secondary: '#18181b', accent: '#71717a' },
              { name: 'Graphite', primary: '#27272a', secondary: '#09090b', accent: '#a1a1aa' },
              { name: 'High Contrast', primary: '#000000', secondary: '#111111', accent: '#52525b' },
              { name: 'Soft Neutral', primary: '#52525b', secondary: '#27272a', accent: '#a1a1aa' },
              { name: 'Paper & Ink', primary: '#18181b', secondary: '#09090b', accent: '#d4d4d8' },
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  updateThemeColors({
                    primary: preset.primary,
                    secondary: preset.secondary,
                    accent: preset.accent,
                  });
                  addToast('Palette Applied', `Activated ${preset.name}`, 'success');
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-xs font-semibold text-gray-800 transition shadow-xs"
              >
                <div className="flex -space-x-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                </div>
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Typography System */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-950">2. Typography System (Google Fonts)</h3>
            <p className="text-xs text-gray-500">Curated e-commerce typography pairings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'Outfit', label: 'Outfit (Modern Tech)', desc: 'Clean, futuristic, high readability' },
            { id: 'Inter', label: 'Inter (Enterprise)', desc: 'Clean, pixel-perfect, highly versatile' },
            { id: 'Poppins', label: 'Poppins (Geometric)', desc: 'Friendly, balanced, bold curves' },
            { id: 'Montserrat', label: 'Montserrat (Luxury)', desc: 'Sharp, premium fashion & high-end' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => handleFontChange(f.id as any)}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                theme.typography.fontFamily === f.id
                  ? 'border-gray-400 bg-gray-100 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-gray-900">{f.label}</span>
                {theme.typography.fontFamily === f.id && (
                  <Check className="w-4 h-4 text-gray-900" />
                )}
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Component Geometry & Border Radius */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
            <Square className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-950">3. Component Geometry & Corner Radius</h3>
            <p className="text-xs text-gray-500">Controls buttons, cards, badges, and modals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'sharp', radius: '0px', label: 'Sharp (0px)', desc: 'Brutalist, square corners' },
            { id: 'subtle', radius: '6px', label: 'Subtle (6px)', desc: 'Slightly smoothed edges' },
            { id: 'rounded', radius: '12px', label: 'Rounded (12px)', desc: 'TeleX default modern curves' },
            { id: 'pill', radius: '9999px', label: 'Full Pill (Pill)', desc: 'Fully circular bubbly controls' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => handleGeometryChange(g.id as any)}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                theme.geometry.stylePreset === g.id
                  ? 'border-gray-400 bg-gray-100 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-gray-900">{g.label}</span>
                {theme.geometry.stylePreset === g.id && (
                  <Check className="w-4 h-4 text-gray-900" />
                )}
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">{g.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Product Card Visual Style */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-950">4. Product Listing Card Visual Style</h3>
            <p className="text-xs text-gray-500">Choose how products appear across all catalog grids</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'shadow-hover', label: 'Shadow Hover (Default)', desc: 'Clean white with subtle lift on hover' },
            { id: 'bordered', label: 'Bordered Cards', desc: 'Distinct 2px border container with crisp separation' },
            { id: 'elevated', label: 'Elevated Cards', desc: 'Prominent 3D depth shadows and hover rise' },
            { id: 'minimal', label: 'Minimal Flat', desc: 'Borderless, whitespace-focused minimalist layout' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => handleCardStyleChange(c.id as any)}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                theme.productCardStyle === c.id
                  ? 'border-gray-400 bg-gray-100 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-gray-900">{c.label}</span>
                {theme.productCardStyle === c.id && (
                  <Check className="w-4 h-4 text-gray-900" />
                )}
              </div>
              <p className="text-[11px] text-gray-500 leading-snug">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
