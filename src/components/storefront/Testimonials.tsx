import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  comment: string;
  rating: number;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    name: 'Hamza Farooq',
    handle: '@hamza_tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    comment: 'Received my QCY T13 ANC 2 pods via TCS in 24 hours. The sound stage and active noise cancellation are unbelievable for this price.',
    rating: 5.0,
  },
  {
    id: 't2',
    name: 'Dr. Ayesha Malik',
    handle: '@ayesha_m',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    comment: 'Mibro Watch GS Pro screen is crystal clear under bright sunlight in Islamabad. Battery lasts 14+ days easily. Outstanding support!',
    rating: 5.0,
  },
  {
    id: 't3',
    name: 'Muhammad Daniyal',
    handle: '@daniyal_dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    comment: 'Anker 65W GaN charger charges my MacBook Pro and iPhone simultaneously with zero overheating. TeleX is my go-to tech store in Pakistan.',
    rating: 5.0,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="my-12">
      {/* Container: bg-[#FDF2F8] rounded-[36px] p-10 my-12 */}
      <div className="bg-[#FDF2F8] rounded-[36px] p-8 sm:p-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 mb-1 block">
            Verified Customer Reviews
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our customers love <span className="italic font-serif font-normal text-pink-600">us</span>
          </h2>
        </div>

        {/* Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100/50 flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-pink-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {rev.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {rev.handle}
                    </span>
                  </div>
                </div>

                {/* 5-star rating pill */}
                <div className="bg-amber-50 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-200/60">
                  <span>5.0</span>
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
