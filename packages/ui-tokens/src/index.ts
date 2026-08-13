export const palette = {
  surface: {
    0: '#000000',
    1: '#08080c',
    2: '#0f0f16',
    3: '#18181f',
    4: '#23232e',
    5: '#2e2e3a',
  },
  accent: {
    100: '#c7d2fe', 200: '#a5b4fc', 300: '#818cf8',
    400: '#6366f1', 500: '#4f46e5', 600: '#4338ca', 700: '#3730a3',
  },
  secondary: {
    300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb',
  },
  semantic: {
    success: '#34d399', warning: '#fbbf24', danger: '#f87171', info: '#60a5fa',
  },
} as const;

export type TokenKey = 'surface' | 'accent' | 'secondary' | 'semantic';
