import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquare, Layout, FileText, Check } from 'lucide-react';

export const NavFooterBuilder: React.FC = () => {
  const { navigationConfig, setNavigationConfig, addToast, addAuditLog } = useStore();

  const handleAnnouncementToggle = () => {
    const updated = {
      ...navigationConfig,
      announcement: {
        ...navigationConfig.announcement,
        enabled: !navigationConfig.announcement.enabled,
      },
    };
    setNavigationConfig(updated);
    addToast('Announcement Bar Updated', '', 'info');
  };

  const handleAnnouncementText = (text: string) => {
    setNavigationConfig({
      ...navigationConfig,
      announcement: {
        ...navigationConfig.announcement,
        text,
      },
    });
  };

  const handleHeaderLayout = (layout: typeof navigationConfig.header.layout) => {
    setNavigationConfig({
      ...navigationConfig,
      header: {
        ...navigationConfig.header,
        layout,
      },
    });
    addToast('Header Layout Changed', `Set to ${layout}`, 'success');
    addAuditLog('Header Layout Modified', `Layout updated to ${layout}`, 'Success');
  };

  const handleFooterCopyright = (copyright: string) => {
    setNavigationConfig({
      ...navigationConfig,
      footer: {
        ...navigationConfig.footer,
        copyright,
      },
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="pb-6 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-black text-gray-950">
          Navigation & Header/Footer Configurator
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Customize global announcement banners, header layout models, and 4-column footer details.
        </p>
      </div>

      {/* 1. Announcement Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-950">Top Announcement Bar</h3>
              <p className="text-xs text-gray-500">Marquee or promotional headline bar</p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
            <span>Enabled:</span>
            <input
              type="checkbox"
              checked={navigationConfig.announcement.enabled}
              onChange={handleAnnouncementToggle}
              className="w-4 h-4 rounded text-gray-900 focus:ring-gray-400"
            />
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Banner Text Message
            </label>
            <input
              type="text"
              value={navigationConfig.announcement.text}
              onChange={(e) => handleAnnouncementText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Link Action Label
              </label>
              <input
                type="text"
                value={navigationConfig.announcement.linkText}
                onChange={(e) =>
                  setNavigationConfig({
                    ...navigationConfig,
                    announcement: { ...navigationConfig.announcement, linkText: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Background Color Hex
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={navigationConfig.announcement.bgColor}
                  onChange={(e) =>
                    setNavigationConfig({
                      ...navigationConfig,
                      announcement: { ...navigationConfig.announcement, bgColor: e.target.value },
                    })
                  }
                  className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={navigationConfig.announcement.bgColor}
                  onChange={(e) =>
                    setNavigationConfig({
                      ...navigationConfig,
                      announcement: { ...navigationConfig.announcement, bgColor: e.target.value },
                    })
                  }
                  className="w-28 px-3 py-1.5 text-xs font-mono uppercase bg-gray-50 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Header Layout Model */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-950">Storefront Header Layout Model</h3>
            <p className="text-xs text-gray-500">Choose between sticky, left logo, and glassmorphism styles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'sticky', label: 'Sticky Header (Standard)', desc: 'Clean white sticky navigation with shadow on scroll' },
            { id: 'glassmorphism', label: 'Glassmorphism Backdrop', desc: 'Frosted blur translucent panel with modern edge' },
            { id: 'left-logo', label: 'Left Logo Compact', desc: 'Ultra-compact minimal header for high density browsing' },
          ].map((h) => (
            <button
              key={h.id}
              onClick={() => handleHeaderLayout(h.id as any)}
              className={`p-4 rounded-2xl border-2 text-left transition ${
                navigationConfig.header.layout === h.id
                  ? 'border-gray-400 bg-gray-100 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-black text-gray-900">{h.label}</span>
                {navigationConfig.header.layout === h.id && (
                  <Check className="w-4 h-4 text-gray-900" />
                )}
              </div>
              <p className="text-[11px] text-gray-500">{h.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Footer Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
          <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-950">Footer Configuration</h3>
            <p className="text-xs text-gray-500">Legal copyright, store description, and payment gateway badges</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Storefront Copyright Notice
            </label>
            <input
              type="text"
              value={navigationConfig.footer.copyright}
              onChange={(e) => handleFooterCopyright(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              About Text (Column 1)
            </label>
            <textarea
              rows={2}
              value={navigationConfig.footer.aboutText}
              onChange={(e) =>
                setNavigationConfig({
                  ...navigationConfig,
                  footer: { ...navigationConfig.footer, aboutText: e.target.value },
                })
              }
              className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
