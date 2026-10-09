import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQSectionProps {
  settings: {
    faqs: {
      q: string;
      a: string;
    }[];
  };
}

export const FAQSection: React.FC<FAQSectionProps> = ({ settings }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!settings?.faqs || settings.faqs.length === 0) return null;

  return (
    <section id="faq" className="my-10 sm:my-14 scroll-mt-24">
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-10 shadow-sm max-w-4xl mx-auto">
        <div className="text-center max-w-md mx-auto mb-8">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1362D7] flex items-center justify-center mx-auto mb-2">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Instant answers regarding ordering, warranties, and Cash on Delivery
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {settings.faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#1362D7] transition">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-50 text-slate-500 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 bg-blue-50 text-[#1362D7]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-3 pl-1 leading-relaxed animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
