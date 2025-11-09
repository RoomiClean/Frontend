/**
 * 비즈니스 관련 상수 데이터
 */

import { DropdownOption } from '@/types/dropdown.types';

/**
 * 이메일 도메인 목록
 */
export const EMAIL_DOMAINS: DropdownOption[] = [
  { value: 'naver.com', label: 'naver.com' },
  { value: 'gmail.com', label: 'gmail.com' },
  { value: 'daum.net', label: 'daum.net' },
  { value: 'icloud.com', label: 'icloud.com' },
  { value: 'hanmail.net', label: 'hanmail.net' },
  { value: 'nate.com', label: 'nate.com' },
  { value: 'yahoo.com', label: 'yahoo.com' },
  { value: 'custom', label: '직접 입력' },
];

/**
 * 시/도 목록
 */
export const PROVINCES: DropdownOption[] = [
  { value: 'seoul', label: '서울특별시' },
  { value: 'gyeonggi', label: '경기도' },
  { value: 'busan', label: '부산광역시' },
  { value: 'incheon', label: '인천광역시' },
  { value: 'daegu', label: '대구광역시' },
  { value: 'daejeon', label: '대전광역시' },
  { value: 'gwangju', label: '광주광역시' },
  { value: 'ulsan', label: '울산광역시' },
  { value: 'sejong', label: '세종특별자치시' },
];

/**
 * 시/구/군 목록 (서울시 기준)
 */
export const DISTRICTS: DropdownOption[] = [
  { value: 'gangnam', label: '강남구' },
  { value: 'gangdong', label: '강동구' },
  { value: 'gangbuk', label: '강북구' },
  { value: 'gangseo', label: '강서구' },
  { value: 'gwanak', label: '관악구' },
  { value: 'gwangjin', label: '광진구' },
  { value: 'guro', label: '구로구' },
  { value: 'geumcheon', label: '금천구' },
  { value: 'nowon', label: '노원구' },
  { value: 'dobong', label: '도봉구' },
  { value: 'dongdaemun', label: '동대문구' },
  { value: 'dongjak', label: '동작구' },
  { value: 'mapo', label: '마포구' },
  { value: 'seodaemun', label: '서대문구' },
  { value: 'seocho', label: '서초구' },
  { value: 'seongdong', label: '성동구' },
  { value: 'seongbuk', label: '성북구' },
  { value: 'songpa', label: '송파구' },
  { value: 'yangcheon', label: '양천구' },
  { value: 'yeongdeungpo', label: '영등포구' },
  { value: 'yongsan', label: '용산구' },
  { value: 'eunpyeong', label: '은평구' },
  { value: 'jongno', label: '종로구' },
  { value: 'jung', label: '중구' },
  { value: 'jungnang', label: '중랑구' },
];

/**
 * 은행 목록
 */
export const BANKS: DropdownOption[] = [
  { value: 'kb', label: '국민은행' },
  { value: 'shinhan', label: '신한은행' },
  { value: 'woori', label: '우리은행' },
  { value: 'hana', label: '하나은행' },
  { value: 'nh', label: '농협은행' },
  { value: 'ibk', label: '기업은행' },
  { value: 'kdb', label: '산업은행' },
  { value: 'keb', label: '외환은행' },
];

/**
 * 숙소 유형 목록
 */
export const ACCOMMODATION_TYPES: DropdownOption[] = [
  { value: 'house', label: '단독주택' },
  { value: 'duplex', label: '다가구주택' },
  { value: 'apartment', label: '아파트' },
  { value: 'row', label: '연립주택' },
  { value: 'multi', label: '다세대주택' },
];

/**
 * 숙소 유형 매핑
 */
export const ACCOMMODATION_TYPE_LABELS: { [key: string]: string } = {
  APARTMENT: '아파트',
  VILLA: '빌라',
  OFFICETEL: '오피스텔',
  HOUSE: '주택',
  ETC: '다가구 주택',
};

/**
 * iCal 동기화 주기 옵션 (시간 단위)
 */
export const ICAL_SYNC_PERIOD_OPTIONS: DropdownOption[] = [
  { label: '1시간', value: '1' },
  { label: '3시간', value: '3' },
  { label: '6시간', value: '6' },
  { label: '12시간', value: '12' },
  { label: '24시간', value: '24' },
];
