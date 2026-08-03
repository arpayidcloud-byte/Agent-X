import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output so the app can run in a minimal container (see Dockerfile.admin).
  output: 'standalone',
};

export default nextConfig;
