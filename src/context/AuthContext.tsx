import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CustomerUser, AdminUser } from '../types/ecommerce';
import { useStore } from './StoreContext';

interface CustomerAuthResponse {
  success: boolean;
  message: string;
}

interface AdminAuthResponse {
  success: boolean;
  message: string;
}

export interface SessionData {
  user: CustomerUser;
}

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

interface AuthContextType {
  // Dynamic Session State (NextAuth Compatible)
  session: SessionData | null;
  status: AuthStatus;

  // Customer Auth
  customer: CustomerUser | null;
  isCustomerLoggedIn: boolean;
  isCustomerModalOpen: boolean;
  setIsCustomerModalOpen: (open: boolean) => void;
  customerModalTab: 'signin' | 'signup';
  setCustomerModalTab: (tab: 'signin' | 'signup') => void;
  loginCustomerWithPassword: (identifier: string, pass: string) => CustomerAuthResponse;
  sendCustomerEmailOtp: (email: string) => Promise<CustomerAuthResponse>;
  verifyCustomerEmailOtp: (email: string, code: string) => Promise<CustomerAuthResponse>;
  registerCustomer: (name: string, email: string, phone: string, pass: string) => CustomerAuthResponse;
  logoutCustomer: () => void;

  // Admin Auth & Security Engine
  admin: AdminUser | null;
  isAdminSessionLoading: boolean;
  isAdminLoggedIn: boolean;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  loginAdminCredentials: (email: string, pass: string) => Promise<AdminAuthResponse>;
  logoutAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addToast, addAuditLog, addCustomer } = useStore();

  // ---------------- Customer State: Defaults to NULL (Unauthenticated / Guest) ----------------
  const [customer, setCustomer] = useState<CustomerUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('telex_customer_auth');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Purge any legacy dummy demo profiles (e.g. "Muhammad Bilal Khan" / "cust-demo")
          if (
            parsed?.id === 'cust-demo' ||
            parsed?.name === 'Muhammad Bilal Khan' ||
            parsed?.email === 'bilal.khan92@gmail.com'
          ) {
            localStorage.removeItem('telex_customer_auth');
            return null;
          }
          return parsed;
        } catch {
          localStorage.removeItem('telex_customer_auth');
          return null;
        }
      }
    }
    return null;
  });

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerModalTab, setCustomerModalTab] = useState<'signin' | 'signup'>('signin');
  const verifiedCustomerEmails = useRef(new Set<string>());

  // Dynamic Session Computation (Defaults to status === "unauthenticated")
  const session: SessionData | null = customer ? { user: customer } : null;
  const status: AuthStatus = customer ? 'authenticated' : 'unauthenticated';
  const isCustomerLoggedIn = Boolean(customer);

  // ---------------- Admin State & Security ----------------
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isAdminSessionLoading, setIsAdminSessionLoading] = useState(true);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Persist auth states
  useEffect(() => {
    if (customer) {
      localStorage.setItem('telex_customer_auth', JSON.stringify(customer));
    } else {
      localStorage.removeItem('telex_customer_auth');
    }
  }, [customer]);

  useEffect(() => {
    localStorage.removeItem('telex_admin_auth');
    fetch('/api/admin/auth/session', { credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ admin?: { email: string; name: string } }>;
      })
      .then((result) => {
        if (!result?.admin) return;
        setAdmin({
          id: result.admin.email,
          name: result.admin.name,
          email: result.admin.email,
          lastLogin: new Date().toISOString(),
        });
      })
      .catch(() => undefined)
      .finally(() => setIsAdminSessionLoading(false));
  }, []);

  // ---------------- Customer Auth Methods ----------------
  const loginCustomerWithPassword = (identifier: string, pass: string): CustomerAuthResponse => {
    if (!identifier || !pass) {
      return { success: false, message: 'Please enter your email/phone and password' };
    }

    const cleanName = identifier.includes('@')
      ? identifier.split('@')[0].replace(/[._-]/g, ' ')
      : 'TeleX Shopper';

    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      email: identifier.includes('@') ? identifier : `${identifier.replace(/\D/g, '')}@telex.pk`,
      phone: identifier.includes('@') ? '+92 300 1234567' : identifier,
      wishlist: [],
      addresses: [
        {
          id: 'addr-main',
          label: 'Primary Delivery Address',
          recipientName: cleanName,
          phone: identifier.includes('@') ? '+92 300 1234567' : identifier,
          address: 'Main Boulevard, Gulberg III',
          city: 'Lahore',
          province: 'Punjab',
          isDefault: true,
        },
      ],
    };

    setCustomer(newUser);
    setIsCustomerModalOpen(false);
    addToast('Welcome Back!', `Signed in as ${newUser.name}`, 'success');
    return { success: true, message: 'Login successful' };
  };

  const sendCustomerEmailOtp = async (email: string): Promise<CustomerAuthResponse> => {
    try {
      const response = await fetch('/api/auth/email-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      return { success: response.ok, message: result.message || 'Could not send the email code.' };
    } catch {
      return { success: false, message: 'Email verification service is unavailable. Please try again later.' };
    }
  };

  const verifyCustomerEmailOtp = async (email: string, code: string): Promise<CustomerAuthResponse> => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const response = await fetch('/api/auth/email-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, code }),
      });
      const result = await response.json();
      if (!response.ok) {
        return { success: false, message: result.message || 'Email verification failed.' };
      }
      verifiedCustomerEmails.current.add(normalizedEmail);
      return { success: true, message: result.message || 'Email verified.' };
    } catch {
      return { success: false, message: 'Email verification service is unavailable. Please try again later.' };
    }
  };

  const registerCustomer = (name: string, email: string, phone: string, pass: string): CustomerAuthResponse => {
    if (!name || !email || !phone || !pass) {
      return { success: false, message: 'Please complete all required fields' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!verifiedCustomerEmails.current.has(normalizedEmail)) {
      return { success: false, message: 'Verify your email before creating an account.' };
    }

    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name,
      email: normalizedEmail,
      phone,
      wishlist: [],
      addresses: [],
    };

    addCustomer({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      city: '',
      province: '',
      totalSpent: 0,
      ordersCount: 0,
      registeredAt: new Date().toISOString().slice(0, 10),
      lastOrderDate: '',
      tags: ['New Customer'],
      defaultAddress: '',
    });

    setCustomer(newUser);
    setIsCustomerModalOpen(false);
    verifiedCustomerEmails.current.delete(normalizedEmail);
    addToast('Account Created!', `Welcome to TeleX, ${name}`, 'success');
    return { success: true, message: 'Registration complete' };
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('telex_customer_auth');
    addToast('Signed Out', 'You have been logged out of your account.', 'info');
  };

  // ---------------- Admin Auth Methods & Security ----------------
  const loginAdminCredentials = async (email: string, pass: string): Promise<AdminAuthResponse> => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const result = await response.json() as {
        message?: string;
        admin?: { email: string; name: string };
      };

      if (!response.ok || !result.admin) {
        return { success: false, message: result.message || 'Sign in failed.' };
      }

      const adminProfile: AdminUser = {
        id: result.admin.email,
        name: result.admin.name,
        email: result.admin.email,
        lastLogin: new Date().toISOString(),
      };
      setAdmin(adminProfile);
      setIsAdminModalOpen(false);
      addToast('Admin Authenticated', `Welcome, ${adminProfile.name}`, 'success');
      addAuditLog('Admin Login Successful', `Email: ${email}`, 'Success');
      return { success: true, message: 'Authentication successful' };
    } catch {
      return { success: false, message: 'Admin sign-in service is unavailable. Please try again later.' };
    }
  };

  const logoutAdmin = async () => {
    await addAuditLog('Admin Logged Out', 'Administrator signed out', 'Success');
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } finally {
    setAdmin(null);
    addToast('Admin Signed Out', 'Session terminated securely', 'info');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        status,
        customer,
        isCustomerLoggedIn,
        isCustomerModalOpen,
        setIsCustomerModalOpen,
        customerModalTab,
        setCustomerModalTab,
        loginCustomerWithPassword,
        sendCustomerEmailOtp,
        verifyCustomerEmailOtp,
        registerCustomer,
        logoutCustomer,

        admin,
        isAdminSessionLoading,
        isAdminLoggedIn: Boolean(admin),
        isAdminModalOpen,
        setIsAdminModalOpen,
        loginAdminCredentials,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * NextAuth.js compatible useSession hook
 * Defaults strictly to status === "unauthenticated" for guests
 */
export function useSession() {
  const auth = useAuth();
  return {
    data: auth.session,
    status: auth.status,
  };
}
