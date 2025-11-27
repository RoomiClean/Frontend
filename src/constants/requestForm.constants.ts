import type { DropdownOption } from '@/types/dropdown.types';

// 세탁물 종류 목록
export const LAUNDRY_TYPES = [
  { id: 'duvet-cover', label: '이불 커버' },
  { id: 'mattress-cover', label: '매트리스 커버' },
  { id: 'pad-cover', label: '패드 커버' },
  { id: 'quilted-duvet', label: '차렵 이불' },
  { id: 'general-towel', label: '일반 타월' },
  { id: 'bath-towel', label: '배스 타월' },
  { id: 'doormat', label: '발매트' },
  { id: 'pillow-cover', label: '베개 커버' },
  { id: 'cushion-cover', label: '쿠션 커버' },
  { id: 'hand-towel', label: '손타월 & 행주' },
];

// 평점 옵션 (0.0부터 5.0까지 0.5단위)
export const RATING_OPTIONS: DropdownOption[] = Array.from({ length: 11 }, (_, i) => {
  const rating = (i * 0.5).toFixed(1);
  return { value: rating, label: `${rating}점` };
});

// 청소자 경력 옵션
export const CLEANER_EXPERIENCE_OPTIONS: DropdownOption[] = [
  { value: 'none', label: '경력 무관' },
  { value: '3months', label: '3개월 이상' },
  { value: '6months', label: '6개월 이상' },
  { value: '1year', label: '1년 이상' },
  { value: '3years', label: '3년 이상' },
  { value: 'custom', label: '직접 입력' },
];

