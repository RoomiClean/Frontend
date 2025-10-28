/**
 * 비즈니스 관련 상수 데이터
 */

import { DropdownOption } from '@/types/dropdown.types';

/**
 * 이메일 도메인 목록
 */
export const emailDomains: DropdownOption[] = [
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
export const provinces: DropdownOption[] = [
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
export const districts: DropdownOption[] = [
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
export const banks: DropdownOption[] = [
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
export const accommodationTypes: DropdownOption[] = [
  { value: 'house', label: '단독주택' },
  { value: 'duplex', label: '다가구주택' },
  { value: 'apartment', label: '아파트' },
  { value: 'row', label: '연립주택' },
  { value: 'multi', label: '다세대주택' },
];
