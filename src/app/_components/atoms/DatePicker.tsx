'use client';

import { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import CalendarIcon from '@/assets/svg/Calendar.svg';
import { BodySmall } from '../atoms/Typography';

export interface DatePickerProps {
  error?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 날짜 선택을 위한 DatePicker 컴포넌트
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, value, placeholder, disabled, error, onChange }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

    const getTodayDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const minDate = getTodayDate();

    const baseStyles =
      'w-full h-[48px] px-4 rounded-[8px] transition-all duration-200 outline-none text-[14px] leading-[140%] flex items-center cursor-pointer';

    const hasValue = value && String(value).trim().length > 0;

    const getStateStyles = () => {
      if (disabled) {
        return 'bg-neutral-200/50 border border-neutral-200 text-neutral-500 cursor-not-allowed';
      }

      if (error) {
        return 'bg-neutral-100 border border-red-500 text-neutral-1000';
      }

      if (hasValue && !isFocused) {
        return 'bg-neutral-100 border border-neutral-1000 text-neutral-1000';
      }

      if (isFocused) {
        return 'bg-neutral-100 border border-neutral-1000 text-neutral-1000';
      }

      return 'bg-neutral-100 border border-neutral-300 text-neutral-500 hover:border-neutral-1000';
    };

    // 날짜 포맷팅 (YYYY-MM-DD -> YYYY. MM. DD.)
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const [year, month, day] = dateString.split('-');
      return `${year}. ${month}. ${day}.`;
    };

    const handleDivClick = (e: React.MouseEvent<HTMLInputElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      if (inputRef.current) {
        try {
          // 모바일에서는 직접 클릭이 더 잘 작동함
          if ('showPicker' in HTMLInputElement.prototype) {
            inputRef.current.showPicker?.();
          } else {
            // showPicker가 지원되지 않는 경우 input에 focus
            inputRef.current.focus();
          }
          setIsFocused(true);
        } catch {
          // showPicker가 지원되지 않는 경우 input에 focus
          inputRef.current.focus();
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);
      setIsFocused(false);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <div className={`relative w-full ${className}`}>
        {/* 표시용 div */}
        <div className={`${baseStyles} ${getStateStyles()}`}>
          <Image
            src={CalendarIcon}
            alt="달력"
            width={20}
            height={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          />
          {hasValue ? (
            <BodySmall className="text-neutral-1000 ml-8">{formatDate(value!)}</BodySmall>
          ) : (
            <BodySmall className="text-neutral-500 ml-8">
              {placeholder || '날짜를 선택해주세요'}
            </BodySmall>
          )}
        </div>

        {/* 투명한 input (picker 호출용) - 모바일에서도 작동하도록 전체 영역을 덮음 */}
        <input
          ref={inputRef}
          type="date"
          value={value || ''}
          min={minDate}
          onChange={handleChange}
          onBlur={handleBlur}
          onClick={handleDivClick}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          tabIndex={0}
        />
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
