import { z } from 'zod';

// Pakistani Mobile Phone Number Regex (+923XXXXXXXXX, 03XXXXXXXXX, or 923XXXXXXXXX)
export const PAKISTAN_PHONE_REGEX = /^(?:\+92|0092|92|0)?3[0-9]{9}$/;

export const normalizePakistaniPhone = (input: string): string => {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) {
    return `+${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `+92${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `+92${digits}`;
  }
  return input;
};

// 1. Dual-Input Customer Login Schema (Email OR Phone)
export const customerLoginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email or Phone Number is required')
    .refine((val) => {
      const isEmail = z.string().email().safeParse(val).success;
      const isPhone = PAKISTAN_PHONE_REGEX.test(val.replace(/\s+/g, ''));
      return isEmail || isPhone;
    }, 'Enter a valid Email or Pakistani Phone Number (+92 3XX XXXXXXX)'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CustomerLoginInput = z.infer<typeof customerLoginSchema>;

// 2. Customer 1-Click SMS OTP Request Schema
export const sendOtpSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => PAKISTAN_PHONE_REGEX.test(val.replace(/\s+/g, '')),
      'Enter a valid Pakistani mobile number (e.g. +92 300 1234567)'
    ),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;

// 3. Customer 1-Click SMS OTP Verification Schema
export const verifyOtpSchema = z.object({
  phone: z.string().min(1, 'Phone number is required'),
  code: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Code must contain only digits'),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

// 4. Customer Registration Schema (with optional Guest Checkout Sync)
export const customerRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .refine(
      (val) => PAKISTAN_PHONE_REGEX.test(val.replace(/\s+/g, '')),
      'Enter a valid Pakistani mobile number (+92 3XX XXXXXXX)'
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  guestOrderSync: z.boolean(),
});

export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;

// 5. Enterprise Admin Login - Step 1: Credentials
export const adminLoginStep1Schema = z.object({
  email: z.string().email('Valid staff email required (e.g. admin@telex.pk)'),
  password: z.string().min(8, 'Staff password must be at least 8 characters'),
});

export type AdminLoginStep1Input = z.infer<typeof adminLoginStep1Schema>;

// 6. Enterprise Admin Login - Step 2: 2FA TOTP Challenge
export const adminLoginStep2Schema = z.object({
  tempToken: z.string().min(1, 'Temporary verification token missing'),
  totpCode: z
    .string()
    .length(6, '2FA code must be 6 digits')
    .regex(/^\d{6}$/, 'Must be numeric 6-digit TOTP code'),
});

export type AdminLoginStep2Input = z.infer<typeof adminLoginStep2Schema>;
