import { create } from 'zustand';
import { ThemeConfig, DEFAULT_THEME } from '../types/theme';

interface ThemeState {
  theme: ThemeConfig;
  previewTheme: ThemeConfig | null;
  activeTheme: () => ThemeConfig;
  setTheme: (updates: Partial<ThemeConfig>) => void;
  setPreviewTheme: (updates: Partial<ThemeConfig> | null) => void;
  resetTheme: () => void;
  initTheme: (serverConfig?: Partial<ThemeConfig> | null) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: DEFAULT_THEME,
  previewTheme: null,

  // Returns active theme (prioritizes live preview frame when active)
  activeTheme: () => {
    const { previewTheme, theme } = get();
    return previewTheme ? { ...theme, ...previewTheme } : theme;
  },

  // Updates and persists current theme
  setTheme: (updates: Partial<ThemeConfig>) => {
    set((state) => {
      const updatedTheme = { ...state.theme, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('telex_active_theme', JSON.stringify(updatedTheme));
      }
      return { theme: updatedTheme };
    });
  },

  // Updates preview theme for real-time live preview in Admin Panel
  setPreviewTheme: (updates: Partial<ThemeConfig> | null) => {
    set((state) => ({
      previewTheme: updates ? { ...(state.previewTheme || state.theme), ...updates } : null,
    }));
  },

  // Reset to brand default
  resetTheme: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('telex_active_theme');
    }
    set({ theme: DEFAULT_THEME, previewTheme: null });
  },

  // Hydrates theme from server database / Redis cache or fallback
  initTheme: (serverConfig?: Partial<ThemeConfig> | null) => {
    let saved: Partial<ThemeConfig> | null = null;
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('telex_active_theme');
        if (item) saved = JSON.parse(item);
      } catch (e) {
        // ignore storage parse errors
      }
    }

    const resolved = {
      ...DEFAULT_THEME,
      ...(serverConfig || {}),
      ...(saved || {}),
    };

    set({ theme: resolved });
  },
}));

/**
 * Public custom hook consuming Zustand for real-time storefront & admin customizers
 */
export const useThemeConfig = () => {
  const store = useThemeStore();
  const theme = store.activeTheme();

  return {
    theme,
    baseTheme: store.theme,
    previewTheme: store.previewTheme,
    setTheme: store.setTheme,
    setPreviewTheme: store.setPreviewTheme,
    resetTheme: store.resetTheme,
    initTheme: store.initTheme,
  };
};
