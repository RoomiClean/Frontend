import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  /** true일 때 버튼이 hover 상태와 동일한 스타일로 표시됨 */
  active?: boolean;
  /** 버튼 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 버튼 타입 */
  type?: 'button' | 'submit' | 'reset';
  /** 버튼 종류 */
  variant?: 'primary' | 'secondary';
  /** 버튼 비활성화 여부 */
  disabled?: boolean;
}

/**
 * 기본 버튼 컴포넌트
 *
 * @description
 * - variant(primary, secondary)에 따라 스타일이 달라집니다.
 *
 * @example
 * ```tsx
 * <Button variant="primary">아이디 중복확인</Button>
 *  <Button variant="primary" disabled>아이디 중복확인</Button>
 * <Button variant="secondary" active>인증번호 받기</Button>
 * ```
 */
export default function Button({
  children,
  className = '',
  active,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    'w-full py-[14px] flex items-center justify-center rounded-[8px] font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

  const variantStyles =
    variant === 'primary'
      ? active
        ? 'bg-primary-400 text-neutral-100 border border-primary-400'
        : 'bg-neutral-100 text-primary-400 border border-primary-400 hover:shadow-[0_6px_15px_rgba(0,0,0,0.2)]'
      : active
        ? 'bg-neutral-100 text-primary-400 border border-primary-400'
        : 'bg-neutral-100 text-neutral-1000 border border-neutral-1000 hover:shadow-[0_6px_15px_rgba(0,0,0,0.2)]';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
