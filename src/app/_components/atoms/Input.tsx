'use client';

import { forwardRef, useState, InputHTMLAttributes } from 'react';
import Image from 'next/image';
import InvisibleIcon from '@/assets/svg/EyeInvisible.svg';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 에러 상태 여부 */
  error?: boolean;
  invisible?: boolean;
}

/**
 * 사용자 텍스트 입력을 위한 Input 컴포넌트
 *
 * @description
 * - disabled, error, focus 상태에 따라 스타일 변경
 * - React Hook Form 등과 함께 ref 전달 가능
 * - `invisible` 속성으로 text type 토글 가능
 *
 * @param {string} placeholder - 입력 필드 placeholder
 * @param {boolean} disabled - 입력 비활성화 여부
 * @param {boolean} error - 에러 상태 여부
 * @param {boolean} invisible - true일 경우 오른쪽 아이콘 클릭으로 입력값 표시/숨김 가능
 * @param {string} className - 추가 클래스명
 * @param {React.Ref<HTMLInputElement>} ref - 외부에서 ref 전달 가능
 * @param {...any} props - Input HTML 속성 모두 전달 가능
 *
 */

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, placeholder, disabled, error, type = 'text', invisible, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const baseStyles =
      'w-full px-4 py-[14px] rounded-lg transition-all duration-200 outline-none text-[14px] leading-[120%] placeholder:text-[14px] placeholder:leading-[120%]';

    const hasValue = value && String(value).trim().length > 0;

    const getStateStyles = () => {
      if (disabled) {
        return 'bg-neutral-200/50 border border-neutral-200 text-neutral-500 placeholder-neutral-500 cursor-not-allowed';
      }

      if (error) {
        return 'bg-neutral-100 border border-red-500 text-neutral-1000 placeholder-neutral-500';
      }

      if (hasValue && !isFocused) {
        return 'bg-neutral-100 border border-neutral-1000 text-neutral-1000';
      }

      if (isFocused) {
        return 'bg-neutral-100 border border-neutral-1000 text-neutral-1000 placeholder-neutral-500';
      }

      return 'bg-neutral-100 border border-neutral-300 text-neutral-500 placeholder-neutral-500 hover:border-neutral-1000';
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const inputType = invisible ? (!showPassword ? 'text' : 'password') : type;

    return (
      <div className={`relative w-full ${className}`}>
        <input
          ref={ref}
          value={value}
          disabled={disabled}
          placeholder={isFocused ? '' : placeholder}
          type={inputType}
          className={`${baseStyles} ${getStateStyles()} ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {invisible && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute top-1/2 right-4 -translate-y-1/2"
          >
            <Image src={InvisibleIcon} alt="Toggle password visibility" />
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
