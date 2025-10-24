import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  /** true일 때 버튼이 hover 상태와 동일한 스타일로 표시됨 */
  active?: boolean;
}

/**
 * 기본 버튼 컴포넌트
 *
 * @description
 * - 기본적으로 흰색 배경에 파란색 테두리를 가진 버튼입니다.
 * - 마우스를 올리면 (hover) 배경색이 파란색으로 바뀌고 텍스트가 흰색으로 변경됩니다.
 * - `active` prop이 true일 경우, hover 상태와 동일한 스타일이 항상 적용됩니다.
 *
 * @example
 * ```tsx
 * <Button>기본 버튼</Button>
 * <Button active>활성화된 버튼</Button>
 * ```
 */
export default function Button({ children, className = '', active }: ButtonProps) {
  const baseStyles =
    'w-full py-[14px] rounded-[8px] font-medium transition-colors duration-200 border border-primary-400';

  const variantStyles = active
    ? 'bg-primary-400 text-white'
    : 'bg-white text-primary-400 hover:bg-primary-400 hover:text-white';

  return <button className={`${baseStyles} ${variantStyles} ${className}`}>{children}</button>;
}
