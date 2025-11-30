/**
 * API_BASE_URL 상수
- 개발 환경에서 프록시를 사용하는 경우 빈 문자열, 프로덕션에서는 실제 API URL
 */
export const API_BASE_URL =
  process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_PROXY === 'true'
    ? ''
    : process.env.NEXT_PUBLIC_API_URL || '';
export const API_TIMEOUT = 10000;
export const API_HEADERS = {
  'Content-Type': 'application/json',
};
