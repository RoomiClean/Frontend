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
  // 개발 환경에서 프록시 설정 (쿠키 도메인 문제 해결)
  async rewrites() {
    // 개발 환경에서만 프록시 사용
    if (process.env.NODE_ENV === 'development') {
      // 프로덕션 서버를 프록시 타겟으로 사용
      const apiTarget = process.env.NEXT_PUBLIC_API_URL;

      return [
        {
          source: '/api/:path*',
          destination: `${apiTarget}/api/:path*`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
