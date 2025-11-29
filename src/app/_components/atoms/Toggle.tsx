'use client';

import { useState } from 'react';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa6';

interface ToggleProps {
  /** 토글의 초기 상태 */
  checked?: boolean;
  /** 토글 상태 변경 핸들러 */
  onChange?: (checked: boolean) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 토글 스위치 컴포넌트
 *
 * @description
 * - on/off 상태를 나타내는 토글 스위치
 * - checked 상태에 따라 FaToggleOn/FaToggleOff 아이콘 표시
 * - disabled 상태 지원
 */
export default function Toggle({
  checked: controlledChecked,
  onChange,
  disabled = false,
  className = '',
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;

    const newChecked = !checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleToggle}
      className={`inline-flex items-center transition-colors duration-200 ease-in-out  ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
    >
      {checked ? (
        <FaToggleOn className="text-neutral-1000 text-4xl" />
      ) : (
        <FaToggleOff className="text-neutral-300 text-4xl" />
      )}
    </button>
  );
}
