import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, Headphones, Mail, Phone, MapPin, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setActiveView, addToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addToast('Subscribed!', 'You will receive exclusive VIP gadget offers', 'success');
      setEmail('');
    }
  };

  return (
    /* Background: bg-[#1C1917] text-slate-300 rounded-t-[36px] p-12 mt-16 */
    <footer className="bg-[#1C1917] text-slate-300 rounded-t-[36px] p-8 sm:p-14 mt-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto">
        {/* Core Value Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1362D7]" />
            <div>
              <h5 className="text-xs font-bold text-white leading-tight">100% Genuine</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">Verified Hardware</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-[#1362D7]" />
            <div>
              <h5 className="text-xs font-bold text-white leading-tight">Cash on Delivery</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">Nationwide TCS / Trax</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-[#1362D7]" />
            <div>
              <h5 className="text-xs font-bold text-white leading-tight">7-Day Warranty</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">Hassle-Free Replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Headphones className="w-5 h-5 text-[#1362D7]" />
            <div>
              <h5 className="text-xs font-bold text-white leading-tight">WhatsApp Support</h5>
              <p className="text-[11px] text-stone-400 mt-0.5">Direct Help Desk</p>
            </div>
          </div>
        </div>

        {/* Multi-column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12 border-b border-stone-800">
          {/* Column 1: Brand Logo & About */}
          <div className="space-y-4">
            <div className="text-[#1362D7] font-bold text-2xl tracking-tight">
              TeleX <span className="text-white font-normal italic">store</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-xs">
              Pakistan's premier direct-to-consumer tech retailer. Engineering verified wireless audio, smart wearables, and GaN fast chargers.
            </p>
            <div className="space-y-2 text-xs text-stone-400 pt-1">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#1362D7]" />
                <span>+92 300 8472910</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#1362D7]" />
                <span>support@telex.pk</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1362D7]" />
                <span>Shahrah-e-Faisal, Karachi</span>
              </p>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              {[
                'Wireless Earbuds',
                'Smartwatches',
                'GaN Chargers & Adapters',
                'Fast Power Banks',
                'Bluetooth Speakers',
                'Braided Cables & Hubs',
              ].map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(item);
                      setActiveView('storefront');
                      window.scrollTo({ top: 600, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveView('customer-dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Consignment (TCS / Trax)
                </button>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  7-Day Replacement Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Warranty Claim Process
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Cash on Delivery Terms
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-xs text-stone-400">
              Subscribe for secret discount codes and new hardware launches.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="flex-1 px-3 py-2 text-xs bg-stone-900 border border-stone-700 rounded-xl text-white outline-none focus:border-[#1362D7]"
              />
              <button
                type="submit"
                className="bg-[#1362D7] hover:bg-[#0E4FAF] text-white font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center sm:text-left text-xs text-stone-500">
          <p>© 2026 TeleX Pakistan (Pvt.) Ltd. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
