import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Lock,
  Mail,
  X,
  ArrowRight,
} from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const {
    isAdminModalOpen,
    loginAdminCredentials,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAdminModalOpen) return null;

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    const res = await loginAdminCredentials(email, password);
    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative bg-white border border-gray-200 text-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 sm:p-8 z-10 overflow-hidden">

        {/* Close Button */}
        <button
          onClick={() => window.location.assign('/')}
          className="absolute top-5 right-5 p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 text-black flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-950">TeleX Admin</h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to manage the TeleX storefront
          </p>
        </div>

        {/* STEP 1: CREDENTIALS */}
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@telex.pk"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:border-black text-gray-900 font-mono"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:border-black text-gray-900 font-mono"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-lg bg-black hover:bg-gray-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>{isSubmitting ? 'Signing in…' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

        </form>

      </div>
    </div>
  );
};
