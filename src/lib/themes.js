export const THEMES = {
  navy: {
    id: 'navy',
    name: 'Midnight',
    preview: ['#1a1a2e', '#4ade80', '#ffffff'],
    vars: {
      '--theme-primary': '#0f0f1a',
      '--theme-primary-light': '#1a1a2e',
      '--theme-accent': '#4ade80',
      '--theme-accent-secondary': '#38bdf8',
      '--theme-hero-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
      '--theme-text-on-primary': '#ffffff',
      '--theme-text-muted': 'rgba(255,255,255,0.5)',
      '--theme-fab-bg': 'linear-gradient(135deg, #1a1a2e, #16213e)',
      '--theme-tab-active': '#4ade80',
      '--theme-card-bg': 'rgba(255,255,255,0.07)',
    },
  },
  gold: {
    id: 'gold',
    name: 'Royal Gold',
    preview: ['#1a1200', '#c9a84c', '#fffbea'],
    vars: {
      '--theme-primary': '#1a1200',
      '--theme-primary-light': '#2d2000',
      '--theme-accent': '#c9a84c',
      '--theme-accent-secondary': '#f0d080',
      '--theme-hero-gradient': 'linear-gradient(135deg, #1a1200 0%, #2d2000 50%, #4a3500 100%)',
      '--theme-text-on-primary': '#fffbea',
      '--theme-text-muted': 'rgba(255,251,234,0.6)',
      '--theme-fab-bg': '#c9a84c',
      '--theme-tab-active': '#c9a84c',
      '--theme-card-bg': 'rgba(201,168,76,0.1)',
    },
  },
  pastel: {
    id: 'pastel',
    name: 'Cloud',
    preview: ['#e0f2fe', '#f9a8d4', '#1e3a5f'],
    vars: {
      '--theme-primary': '#e0f2fe',
      '--theme-primary-light': '#bae6fd',
      '--theme-accent': '#f9a8d4',
      '--theme-accent-secondary': '#c4b5fd',
      '--theme-hero-gradient': 'linear-gradient(135deg, #bae6fd 0%, #e0f2fe 60%, #fce7f3 100%)',
      '--theme-text-on-primary': '#1e3a5f',
      '--theme-text-muted': 'rgba(30,58,95,0.6)',
      '--theme-fab-bg': '#f9a8d4',
      '--theme-tab-active': '#f9a8d4',
      '--theme-card-bg': 'rgba(255,255,255,0.5)',
    },
  },
  dark: {
    id: 'dark',
    name: 'Obsidian',
    preview: ['#0a0a0a', '#a78bfa', '#ffffff'],
    vars: {
      '--theme-primary': '#0a0a0a',
      '--theme-primary-light': '#111111',
      '--theme-accent': '#a78bfa',
      '--theme-accent-secondary': '#818cf8',
      '--theme-hero-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #111111 60%, #1a0a2e 100%)',
      '--theme-text-on-primary': '#ffffff',
      '--theme-text-muted': 'rgba(255,255,255,0.5)',
      '--theme-fab-bg': '#a78bfa',
      '--theme-tab-active': '#a78bfa',
      '--theme-card-bg': 'rgba(255,255,255,0.06)',
    },
  },
}

export function applyTheme(themeId) {
  const theme = THEMES[themeId] || THEMES.navy
  Object.entries(theme.vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value)
  })
  document.documentElement.style.setProperty('color-scheme', themeId === 'pastel' ? 'light' : 'dark')
  return theme
}
