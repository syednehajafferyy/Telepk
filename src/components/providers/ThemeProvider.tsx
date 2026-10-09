import React, { useEffect, useLayoutEffect } from 'react';
import { useThemeConfig, useThemeStore } from '../../hooks/useThemeConfig';
import { ThemeConfig, DEFAULT_THEME } from '../../types/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<ThemeConfig> | null;
}

// Convert Hex color to HSL string if needed for flexible CSS transparency functions
function hexToHsl(hex: string): string {
  const sanitized = hex.replace('#', '');
  if (sanitized.length !== 6) return '240 5.9% 10%';

  const r = parseInt(sanitized.substring(0, 2), 16) / 255;
  const g = parseInt(sanitized.substring(2, 4), 16) / 255;
  const b = parseInt(sanitized.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Google Fonts mapping for dynamic client-side font injection
const GOOGLE_FONTS_MAP = {
  Inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  Poppins: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
  Montserrat: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme }) => {
  const { initTheme } = useThemeStore();
  const { theme } = useThemeConfig();

  // Initialize store with server-side / Redis initialTheme fallback on mount
  useEffect(() => {
    initTheme(initialTheme);
  }, [initialTheme, initTheme]);

  // Synchronize CSS variables with document root on every state change
  const applyVariables = (cfg: ThemeConfig) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Direct CSS Variable Injections as specified
    root.style.setProperty('--primary-color', cfg.primaryColor);
    root.style.setProperty('--primary-color-hsl', hexToHsl(cfg.primaryColor));
    root.style.setProperty('--secondary-color', cfg.secondaryColor);
    root.style.setProperty('--secondary-color-hsl', hexToHsl(cfg.secondaryColor));
    root.style.setProperty('--accent-color', cfg.accentColor);
    root.style.setProperty('--accent-color-hsl', hexToHsl(cfg.accentColor));
    root.style.setProperty('--bg-color', cfg.bgColor);
    root.style.setProperty('--card-bg-color', cfg.cardBgColor);
    root.style.setProperty('--text-color', cfg.textColor);
    root.style.setProperty('--border-radius', cfg.borderRadius);
    root.style.setProperty('--font-family', `'${cfg.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif`);

    // Dynamic Google Font Injection
    const fontUrl = GOOGLE_FONTS_MAP[cfg.fontFamily];
    if (fontUrl) {
      let fontLink = document.getElementById('telex-dynamic-font') as HTMLLinkElement | null;
      if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id = 'telex-dynamic-font';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
      if (fontLink.href !== fontUrl) {
        fontLink.href = fontUrl;
      }
    }
  };

  useLayoutEffect(() => {
    applyVariables(theme);
  }, [theme]);

  // Generate SSR inline style block to eliminate FOUC in Next.js 14 App Router
  const ssrStyle = `
    :root {
      --primary-color: ${theme.primaryColor};
      --primary-color-hsl: ${hexToHsl(theme.primaryColor)};
      --secondary-color: ${theme.secondaryColor};
      --secondary-color-hsl: ${hexToHsl(theme.secondaryColor)};
      --accent-color: ${theme.accentColor};
      --accent-color-hsl: ${hexToHsl(theme.accentColor)};
      --bg-color: ${theme.bgColor};
      --card-bg-color: ${theme.cardBgColor};
      --text-color: ${theme.textColor};
      --border-radius: ${theme.borderRadius};
      --font-family: '${theme.fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    body {
      background-color: var(--bg-color);
      color: var(--text-color);
      font-family: var(--font-family);
    }
  `;

  return (
    <>
      <style id="telex-ssr-theme-variables" dangerouslySetInnerHTML={{ __html: ssrStyle }} />
      {children}
    </>
  );
};
