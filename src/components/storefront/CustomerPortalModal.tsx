import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Phone,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CustomerPortalModal: React.FC = () => {
  const {
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    customerModalTab,
    setCustomerModalTab,
    loginCustomerWithPassword,
    sendCustomerEmailOtp,
    verifyCustomerEmailOtp,
    registerCustomer,
  } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sign up fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('+92 300 ');
  const [regPass, setRegPass] = useState('');
  const [signupStep, setSignupStep] = useState<'details' | 'verify-email'>('details');
  const [signupCode, setSignupCode] = useState('');
  const [signupSubmitting, setSignupSubmitting] = useState(false);

  if (!isCustomerModalOpen) return null;

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = loginCustomerWithPassword(identifier, password);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSignupSubmitting(true);
    const res = await sendCustomerEmailOtp(regEmail);
    setSignupSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }
    setSignupStep('verify-email');
  };

  const handleVerifySignupEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSignupSubmitting(true);
    const verification = await verifyCustomerEmailOtp(regEmail, signupCode);
    setSignupSubmitting(false);
    if (!verification.success) {
      setErrorMsg(verification.message);
      return;
    }

    const registration = registerCustomer(regName, regEmail, regPhone, regPass);
    if (!registration.success) setErrorMsg(registration.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-gray-100 z-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsCustomerModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div
            style={{ backgroundColor: 'var(--color-primary)' }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto shadow-lg shadow-indigo-500/20 mb-3"
          >
            TX
          </div>
          <h2 className="text-2xl font-black text-gray-950">
            {customerModalTab === 'signup' && signupStep === 'verify-email'
              ? 'Verify your email'
              : customerModalTab === 'signup'
              ? 'Join TeleX Pakistan'
              : 'Welcome to TeleX'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {customerModalTab === 'signup' && signupStep === 'verify-email'
              ? `Enter the code sent to ${regEmail}`
              : 'Access your orders, track parcels, and enjoy member benefits'}
          </p>
        </div>

        {/* Tab switch between Sign In and Sign Up */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button
              onClick={() => {
                setCustomerModalTab('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                customerModalTab === 'signin'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setCustomerModalTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                customerModalTab === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Create Account
            </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {customerModalTab === 'signin' && (
          <form onSubmit={handlePasswordLogin} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="shopper@telex.pk or +92 300..."
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700">Password</label>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  className="w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-indigo-500/20 transition"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
          </form>
        )}

        {/* TAB 2: CREATE ACCOUNT */}
        {customerModalTab === 'signup' && (
          signupStep === 'verify-email' ? (
            <form onSubmit={handleVerifySignupEmail} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email verification code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={signupCode}
                  onChange={(e) => setSignupCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit code"
                  className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1362D7] focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={signupSubmitting}
                style={{ backgroundColor: 'var(--color-primary)' }}
                className="w-full py-3 rounded-xl text-white font-bold text-xs disabled:opacity-60"
              >
                {signupSubmitting ? 'Verifying…' : 'Verify email and create account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignupStep('details');
                  setSignupCode('');
                  setErrorMsg('');
                }}
                className="w-full text-xs text-gray-500 hover:text-gray-900"
              >
                Back to account details
              </button>
            </form>
          ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Saad Rehan"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="saad@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Mobile Number (+92)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white font-mono"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={signupSubmitting}
              style={{ backgroundColor: 'var(--color-primary)' }}
              className="w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-indigo-500/20 transition mt-2 disabled:opacity-60"
            >
              <span>{signupSubmitting ? 'Sending code…' : 'Send email verification code'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          )
        )}

      </div>
    </div>
  );
};
