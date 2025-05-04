import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { Context, PropsWithChildren } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeValueObject = {
  [K in string]: string;
};

type ThemeContextValue<T extends Theme> = null | {
  themes: T[];
  theme?: T;
  forcedTheme?: T;
  setTheme: (theme: T) => void;
};
type ThemeAttribute = `data-${string}` | 'class';

type ThemeProviderProps<T extends Theme> = {
  /** List of all available theme names */
  themes?: T[];
  /** Forced theme name for the current page */
  forcedTheme?: T;
  /** Whether to switch between dark and light themes based on prefers-color-scheme */
  enableSystem?: boolean;
  /** Disable all CSS transitions when switching themes */
  disableTransitionOnChange?: boolean;
  /** Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons */
  enableColorScheme?: boolean;
  /** Key used to store theme setting in localStorage */
  storageKey?: string;
  /** Default theme name (for v0.0.12 and lower the default was light). If `enableSystem` is false, the default theme is light */
  defaultTheme?: T;
  /** HTML attribute modified based on the active theme. Accepts `class`, `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.), or an array which could include both */
  attribute?: ThemeAttribute | ThemeAttribute[];
  /** Mapping of theme name to HTML attribute value. Object where key is the theme name and value is the attribute value */
  value?: ThemeValueObject;
  /** Nonce string to pass to the inline script for CSP headers */
  nonce?: string;
};

const disableAnimation = () => {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}',
    ),
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

function createThemeContextValue<T extends Theme>({
  themes,
  theme,
  forcedTheme,
  setTheme,
}: NonNullable<ThemeContextValue<T>>) {
  return {
    themes,
    theme,
    forcedTheme,
    setTheme,
  };
}

function createThemeContext<T extends Theme>() {
  return createContext<ThemeContextValue<T>>(null);
}

function createThemeProvider<T extends Theme>({
  context,
  themes,
  media,
}: {
  context: Context<ThemeContextValue<T>>;
  themes: T[];
  media: string;
}) {
  const isServer = typeof window === 'undefined';
  const colorSchemes = ['light', 'dark'];

  const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent): T => {
    const event = e ?? window.matchMedia(media);
    const isDark = event.matches;
    const systemTheme = isDark ? 'dark' : 'light';
    return systemTheme as T;
  };

  const getTheme = (key: string, fallback?: T) => {
    if (isServer) return undefined;
    let theme: string | undefined;
    try {
      theme = localStorage.getItem(key) || undefined;
    } catch {
      // Unsupported
    }
    return (theme || fallback) as T;
  };

  function ThemeScript({
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    themes,
    nonce,
  }: Omit<ThemeProviderProps<T>, 'children'> & { defaultTheme: string }) {
    const scriptArgs = JSON.stringify([
      attribute,
      storageKey,
      defaultTheme,
      forcedTheme,
      themes,
      value,
      enableSystem,
      enableColorScheme,
    ]).slice(1, -1);

    return (
      <script
        suppressHydrationWarning
        nonce={typeof window === 'undefined' ? nonce : ''}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Needed to inject script before hydration
        dangerouslySetInnerHTML={{
          __html: `(${ThemeHydratorScript.toString()})(${scriptArgs})`,
        }}
      />
    );
  }

  function ThemeResolver({
    forcedTheme,
    disableTransitionOnChange = false,
    enableSystem = true,
    enableColorScheme = true,
    storageKey = 'theme',
    defaultTheme = (enableSystem ? 'system' : 'light') as T,
    attribute = 'data-theme',
    value,
    nonce,
    children,
  }: PropsWithChildren<Omit<ThemeProviderProps<T>, 'themes'>>) {
    const [theme, setThemeState] = useState<T | undefined>(() =>
      getTheme(storageKey, defaultTheme),
    );
    const attrs = !value ? Object.values(themes) : Object.values(value);

    const isTheme = (theme: unknown): theme is T => {
      return typeof theme === 'string' && (themes as string[]).includes(theme);
    };

    const applyTheme = useCallback((theme?: T) => {
      let resolved = theme;
      if (!resolved) return;

      // If theme is system, resolve it before setting theme
      if (theme === 'system' && enableSystem) {
        resolved = getSystemTheme();
      }

      const name = value ? value[resolved] : resolved;
      const enable = disableTransitionOnChange ? disableAnimation() : null;
      const doc = document.documentElement;

      const handleAttribute = (attr: ThemeAttribute) => {
        if (attr === 'class') {
          doc.classList.remove(...attrs);
          if (name) doc.classList.add(name);
        } else if (attr.startsWith('data-')) {
          if (name) {
            doc.setAttribute(attr, name);
          } else {
            doc.removeAttribute(attr);
          }
        }
      };

      if (Array.isArray(attribute)) {
        attribute.forEach(handleAttribute);
      } else {
        handleAttribute(attribute);
      }

      if (enableColorScheme) {
        const fallback = colorSchemes.includes(defaultTheme)
          ? defaultTheme
          : null;

        const colorScheme = colorSchemes.includes(resolved)
          ? resolved
          : fallback;

        doc.style.colorScheme = colorScheme || '';
      }

      enable?.();
    }, []);

    // Set theme state and save to local storage
    const setTheme = useCallback(
      (value: T | ((theme?: T) => T)) => {
        const newTheme = typeof value === 'function' ? value(theme) : value;
        setThemeState(newTheme);

        // Save to storage
        try {
          localStorage.setItem(storageKey, newTheme);
        } catch {
          // Unsupported
        }
      },
      [theme],
    );

    const handleMediaQuery = useCallback(
      (event: MediaQueryListEvent | MediaQueryList) => {
        const resolved = getSystemTheme(event);

        if (resolved === 'system' && enableSystem && !forcedTheme) {
          applyTheme(resolved);
        }
      },
      [theme, forcedTheme],
    );

    useEffect(() => {
      const matched = window.matchMedia(media);

      // Intentionally use deprecated listener methods to support iOS & old browsers
      matched.addListener(handleMediaQuery);
      handleMediaQuery(matched);

      return () => matched.removeListener(handleMediaQuery);
    }, [handleMediaQuery]);

    useEffect(() => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key !== storageKey) {
          return;
        }

        // If default theme set, use it if localstorage === null (happens on local storage manual deletion)
        const theme = event.newValue || defaultTheme;
        if (!isTheme(theme)) {
          return;
        }
        setTheme(theme);
      };

      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }, [setTheme]);

    useEffect(() => {
      applyTheme(forcedTheme ?? theme);
    }, [forcedTheme, theme]);

    const contextValue = createThemeContextValue({
      themes,
      forcedTheme,
      theme,
      setTheme,
    });

    return (
      <context.Provider value={contextValue}>
        <ThemeScript
          {...{
            forcedTheme,
            storageKey,
            attribute,
            enableSystem,
            enableColorScheme,
            defaultTheme,
            value,
            themes,
            nonce,
          }}
        />
        {children}
      </context.Provider>
    );
  }

  return ({ children, ...props }: PropsWithChildren<ThemeProviderProps<T>>) => {
    // Ignore nested context providers, just passthrough children
    // This helps where it's easier to be able to spam ThemeProvider everywhere.
    const parentContext = useContext(context);
    if (parentContext) {
      return children;
    }

    return <ThemeResolver {...props}>{children}</ThemeResolver>;
  };
}

function createThemeHook<T extends Theme>(
  context: Context<ThemeContextValue<T>>,
) {
  return () => {
    const themeContext = useContext(context);
    if (!themeContext) {
      throw new Error('useTheme can only be used within a Theme Provider');
    }
    return themeContext;
  };
}

export function createThemeSystem<T extends Theme>(
  options: {
    themes?: T[];
    media?: string;
  } = {},
) {
  const themes = options.themes || (['light', 'dark', 'system'] as T[]);
  const media = options.media || '(prefers-color-scheme: dark)';
  const context = createThemeContext();
  const Provider = createThemeProvider({ context, themes, media });
  const useTheme = createThemeHook(context);

  return {
    Provider,
    useTheme,
  };
}

export const ThemeHydratorScript: (...args: any[]) => void = (
  attribute: string,
  storageKey: string,
  defaultTheme: string,
  forcedTheme: string,
  themes: string[],
  value: Record<string, string>,
  enableSystem?: boolean,
  enableColorScheme?: boolean,
) => {
  const el = document.documentElement;
  const systemThemes = ['light', 'dark'];
  const isClass = attribute === 'class';
  function mapClasses() {
    if (!isClass || !value) {
      return themes;
    }
    return themes.map((item) => value[item] || item);
  }

  function updateDOM(theme: string) {
    const classes = mapClasses();

    if (isClass) {
      el.classList.remove(...classes);
      el.classList.add(theme);
    } else {
      el.setAttribute(attribute, theme);
    }

    setColorScheme(theme);
  }

  function setColorScheme(theme: string) {
    if (enableColorScheme && systemThemes.includes(theme)) {
      el.style.colorScheme = theme;
    }
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  if (forcedTheme) {
    updateDOM(forcedTheme);
  } else {
    try {
      const themeName = localStorage.getItem(storageKey) || defaultTheme;
      const isSystem = enableSystem && themeName === 'system';
      const theme = isSystem ? getSystemTheme() : themeName;
      updateDOM(theme);
    } catch {
      //
    }
  }
};

export const Theme = createThemeSystem();
