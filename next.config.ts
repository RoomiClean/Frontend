import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // 빌드 시 ESLint 무시 (배포 테스트용)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 에러 무시 (배포 테스트용)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
