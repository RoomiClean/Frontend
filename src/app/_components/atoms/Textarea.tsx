'use client';

import { forwardRef, useState, TextareaHTMLAttributes } from 'react';
import { BodySmall } from './Typography';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 에러 상태 여부 */
  error?: boolean;
  /** 최대 글자 수 제한 */
  maxLength?: number;
  /** 글자 수 표시 여부 */
  showCharCount?: boolean;
}

/**
 * 사용자 다중 텍스트 입력을 위한 Textarea 컴포넌트
 *
 * @description
 * - disabled, error, focus 상태에 따라 스타일 변경
 * - React Hook Form 등과 함께 ref 전달 가능
 * - `maxLength` 속성으로 글자 수 제한 가능
 * - `showCharCount` 속성으로 현재 글자 수 표시 가능
 *
 * @param {string} placeholder - 입력 필드 placeholder (기본값: "내용을 입력해주세요")
 * @param {boolean} disabled - 입력 비활성화 여부
 * @param {boolean} error - 에러 상태 여부
 * @param {number} maxLength - 최대 글자 수 제한
 * @param {boolean} showCharCount - 글자 수 표시 여부
 * @param {string} className - 추가 클래스명
 * @param {React.Ref<HTMLTextAreaElement>} ref - 외부에서 ref 전달 가능
 * @param {...any} props - Textarea HTML 속성 모두 전달 가능
 *
 */

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      value,
      placeholder = '내용을 입력해주세요',
      disabled,
      error,
      maxLength,
      showCharCount = true,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const baseStyles =
      'w-full px-4 py-[14px] rounded-lg transition-all duration-200 outline-none text-[14px] leading-[140%] placeholder:text-[14px] placeholder:leading-[140%] resize-none min-h-[120px]';

    const hasValue = value && String(value).trim().length > 0;
    const currentLength = value ? String(value).length : 0;

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

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      props.onChange?.(e);
    };

    const getCharCountColor = () => {
      if (maxLength && currentLength > maxLength) {
        return 'text-red-500';
      }
      if (maxLength && currentLength > maxLength * 0.8) {
        return 'text-orange-500';
      }
      return 'text-neutral-1000';
    };

    return (
      <div className={`w-full ${className}`}>
        <textarea
          ref={ref}
          value={value}
          disabled={disabled}
          placeholder={isFocused ? '' : placeholder}
          maxLength={maxLength}
          className={`${baseStyles} ${getStateStyles()} ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {showCharCount && (
          <BodySmall className={`text-right text-[12px] mt-1 ${getCharCountColor()}`}>
            {maxLength ? `${currentLength}/${maxLength}` : `${currentLength}자`}
          </BodySmall>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
