import React from 'react';
import { Headphones, Zap, BatteryCharging, Shield, Radio } from 'lucide-react';

interface BenefitItem {
  id: string;
  title: string;
  subtext: string;
  icon: React.ReactNode;
  bg: string;
}

const BENEFITS: BenefitItem[] = [
  {
    id: 'b1',
    title: 'Hi-Res Audio',
    subtext: 'aptX Lossless',
    icon: <Headphones className="w-8 h-8 text-emerald-700" />,
    bg: 'bg-[#ECFDF5]',
  },
  {
    id: 'b2',
    title: 'GaN 65W',
    subtext: 'Fast Charge',
    icon: <Zap className="w-8 h-8 text-amber-700" />,
    bg: 'bg-[#FEF3C7]',
  },
  {
    id: 'b3',
    title: '30H Battery',
    subtext: 'Ultra Playback',
    icon: <BatteryCharging className="w-8 h-8 text-blue-700" />,
    bg: 'bg-[#EFF6FF]',
  },
  {
    id: 'b4',
    title: 'IPX7 Rating',
    subtext: 'Waterproof',
    icon: <Shield className="w-8 h-8 text-purple-700" />,
    bg: 'bg-[#F3E8FF]',
  },
  {
    id: 'b5',
    title: 'Wireless Charge',
    subtext: 'Qi Certified',
    icon: <Radio className="w-8 h-8 text-teal-700" />,
    bg: 'bg-[#E0F2FE]',
  },
];

export const TechSpecsRow: React.FC = () => {
  return (
    <section className="my-14 text-center">
      {/* Centered editorial headline */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
        Huge Performance <span className="italic font-serif font-normal text-[#1362D7]">inside</span> our verified tech
      </h2>

      {/* 5 Circular Feature Stages */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
        {BENEFITS.map((item) => (
          <div key={item.id} className="flex flex-col items-center text-center group cursor-pointer">
            {/* Stage: w-24 h-24 rounded-full flex items-center justify-center shadow-sm p-4 mx-auto mb-2 */}
            <div className={`w-24 h-24 rounded-full ${item.bg} flex items-center justify-center shadow-sm p-4 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 border border-slate-100`}>
              {item.icon}
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {item.title}
            </h3>
            <span className="text-xs text-slate-500 font-medium mt-0.5">
              {item.subtext}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechSpecsRow;
