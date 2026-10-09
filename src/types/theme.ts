export type ThemeFont = 'Inter' | 'Poppins' | 'Montserrat';
export type ThemeBorderRadius = '0px' | '4px' | '12px' | '9999px';

export interface ThemeConfig {
  primaryColor: string;     // e.g. "#4F46E5"
  secondaryColor: string;   // e.g. "#0F172A"
  accentColor: string;      // e.g. "#F59E0B"
  bgColor: string;          // e.g. "#F8FAFC"
  cardBgColor: string;      // e.g. "#FFFFFF"
  textColor: string;        // e.g. "#0F172A"
  borderRadius: ThemeBorderRadius; // 0px, 4px, 12px, 9999px
  fontFamily: ThemeFont;    // Inter, Poppins, Montserrat
}

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#4F46E5',
  secondaryColor: '#0F172A',
  accentColor: '#F59E0B',
  bgColor: '#F8FAFC',
  cardBgColor: '#FFFFFF',
  textColor: '#0F172A',
  borderRadius: '12px',
  fontFamily: 'Poppins',
};
