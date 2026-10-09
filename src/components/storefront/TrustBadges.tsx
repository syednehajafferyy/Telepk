import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';

interface TrustBadgesProps {
  settings: {
    items: {
      title: string;
      desc: string;
      icon: string;
    }[];
  };
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ settings }) => {
  if (!settings?.items) return null;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#1362D7]" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-[#65C42C]" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-[#1893B8]" />;
      default:
        return <Zap className="w-5 h-5 text-[#1362D7]" />;
    }
  };

  return (
    <section className="my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {settings.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-gray-200 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              {renderIcon(item.icon)}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                {item.title}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
