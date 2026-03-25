export type Theme = 'light' | 'dark';

const THEME_KEY = 'lshop_theme';

const isTheme = (value: string | null): value is Theme => {
  return value === 'light' || value === 'dark';
};

const getPreferredTheme = (): Theme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const getTheme = (): Theme => {
  const theme: string | null = document.documentElement.dataset.theme || null;

  if (isTheme(theme)) {
    return theme;
  }

  const storedTheme = localStorage.getItem(THEME_KEY);
  return isTheme(storedTheme) ? storedTheme : getPreferredTheme();
};

export const applyTheme = (theme: Theme, emitEvent = true): void => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem(THEME_KEY, theme);

  if (emitEvent) {
    window.dispatchEvent(new CustomEvent('theme:changed'));
  }
};

export const initTheme = (): void => {
  applyTheme(getTheme(), false);
};

export const toggleTheme = (): void => {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
};
