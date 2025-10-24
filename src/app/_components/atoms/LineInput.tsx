'use client';

import { forwardRef, useState, InputHTMLAttributes } from 'react';

export interface LineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 에러 상태 여부 */
  error?: boolean;
}

/**
 * 유저 정보 찾기 텍스트 입력을 위한 LineInput 컴포넌트
 *
 * @description
 * - disabled, error, focus 상태에 따라 스타일 변경
 * - React Hook Form 등과 함께 ref 전달 가능
 */
export const LineInput = forwardRef<HTMLInputElement, LineInputProps>(
  (
    {
      className = '',
      value = '',
      placeholder,
      disabled,
      error,
      onFocus,
      onBlur,
      onChange,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseStyles =
      'w-full py-[14px] border-b transition-all duration-200 outline-none text-[14px] leading-[140%] placeholder:text-[14px] placeholder:leading-[140%]';

    const hasValue = value !== undefined && String(value).trim().length > 0;

    const getStateStyles = () => {
      if (disabled) {
        return 'bg-neutral-100 border-neutral-200 text-neutral-500 placeholder-neutral-500 cursor-not-allowed';
      }

      if (error) {
        return 'bg-neutral-100 border-red-500 text-neutral-1000 placeholder-neutral-500';
      }

      if (isFocused) {
        return 'bg-neutral-100 border-neutral-1000 text-neutral-1000 placeholder-neutral-500';
      }

      if (hasValue) {
        return 'bg-neutral-100 border-neutral-1000 text-neutral-1000';
      }

      return 'bg-neutral-100 border-neutral-500 text-neutral-500 placeholder-neutral-500 hover:border-neutral-1000';
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
    };

    return (
      <div className={`relative w-full ${className}`}>
        <input
          ref={ref}
          value={value}
          disabled={disabled}
          placeholder={isFocused ? '' : placeholder}
          className={`${baseStyles} ${getStateStyles()}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
      </div>
    );
  },
);

LineInput.displayName = 'LineInput';
