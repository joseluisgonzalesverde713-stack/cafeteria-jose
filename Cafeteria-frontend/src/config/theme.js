export const THEMES = {
  naranja: {
    label: 'Naranja',
    accent: '#ea580c',
    strong: '#c2410c',
    dark: '#7c2d12',
    soft: '#fff7ed',
    ring: '#fed7aa',
  },
  verde: {
    label: 'Verde',
    accent: '#059669',
    strong: '#047857',
    dark: '#064e3b',
    soft: '#ecfdf5',
    ring: '#a7f3d0',
  },
  azul: {
    label: 'Azul',
    accent: '#0284c7',
    strong: '#0369a1',
    dark: '#0c4a6e',
    soft: '#f0f9ff',
    ring: '#bae6fd',
  },
  rosa: {
    label: 'Rosa',
    accent: '#e11d48',
    strong: '#be123c',
    dark: '#881337',
    soft: '#fff1f2',
    ring: '#fecdd3',
  },
  cafe: {
    label: 'Café',
    accent: '#8a5a34',
    strong: '#6f4526',
    dark: '#3f2415',
    soft: '#faf6f2',
    ring: '#e0cdbb',
  },
  navidad: {
    label: 'Navidad',
    accent: '#b91c1c',
    strong: '#991b1b',
    dark: '#7f1d1d',
    soft: '#fef7f0',
    ring: '#86efac',
  },
}

export const DEFAULT_THEME = 'navidad'

export function getTheme(key) {
  return THEMES[key] ?? THEMES[DEFAULT_THEME]
}
