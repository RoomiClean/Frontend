/**
 * 드롭다운 관련 타입 정의
 */

/**
 * 드롭다운 옵션 인터페이스
 */
export interface DropdownOption {
  value: string;
  label: string;
}

/**
 * 드롭다운 Props 인터페이스
 */
export interface DropdownProps {
  /** 드롭다운 옵션 목록 */
  options: DropdownOption[];
  /** 현재 선택된 값 */
  value?: string;
  /** 값 변경 핸들러 */
  onChange?: (value: string) => void;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 에러 상태 여부 */
  error?: boolean;
  /** 추가 클래스명 */
  className?: string;
}
