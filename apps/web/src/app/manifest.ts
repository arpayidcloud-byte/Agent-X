import type { MetadataRoute } from 'next';

// PWA manifest — makes the app installable on phones/desktops (Add to
// Home Screen). Theme matches the slate-950 shell.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AgentX — Enterprise AI Agent Platform',
    short_name: 'AgentX',
    description: 'Tasks, multi-agent teams, and analytics for your AI agents.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
