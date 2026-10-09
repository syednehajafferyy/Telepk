import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(query || 'Hi TeleX Team, I have a question about an order / product.');
    window.open(`https://wa.me/923008472910?text=${encoded}`, '_blank');
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 w-80 mb-3 animate-fade-in text-gray-800">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">TeleX Customer Desk</h4>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Online • Typically replies in 5m
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3 text-xs text-gray-600 bg-gray-50 rounded-xl p-2.5 my-3">
            Assalam-o-Alaikum! Welcome to TeleX Pakistan. Need help tracking an order, checking warranty, or selecting earbuds? Chat with us directly!
          </div>

          <form onSubmit={handleSend} className="space-y-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your question..."
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Start WhatsApp Chat (+92 300)</span>
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
        aria-expanded={isOpen}
        className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition"
        title="Chat on WhatsApp (+92 300 8472910)"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
};
