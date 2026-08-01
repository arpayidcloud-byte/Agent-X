import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output so the app can run in a minimal container (see Dockerfile.web).
  output: 'standalone',
};

export default nextConfig;
