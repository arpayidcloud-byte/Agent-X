import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output so the app can run in a minimal container (see Dockerfile.web).
  output: 'standalone',
  // Admin UI moved to the dedicated panel subdomain (panel.id-tech.cloud).
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: 'https://panel.id-tech.cloud/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
