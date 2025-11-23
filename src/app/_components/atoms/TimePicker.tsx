'use client';

import { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import Image from 'next/image';
import TimeIcon from '@/assets/svg/Time.svg';
import ArrowUpIcon from '@/assets/svg/ArrowUp.svg';
import ArrowDownIcon from '@/assets/svg/ArrowDown.svg';
import { BodySmall } from '../atoms/Typography';

export interface TimePickerProps {
  error?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minTime?: string;
  maxTime?: string;
}

// 6시부터 23시까지 30분 단위로 시간 옵션 생성
const generateTimeOptions = (minTime?: string, maxTime?: string) => {
  const options: Array<{ value: string; label: string }> = [];

  for (let hour = 6; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourStr = String(hour).padStart(2, '0');
      const minuteStr = String(minute).padStart(2, '0');
      const timeValue = `${hourStr}:${minuteStr}`;

      if (minTime && timeValue < minTime) {
        continue;
      }

      if (maxTime && timeValue > maxTime) {
        continue;
      }

      const timeLabel = `${hourStr}:${minuteStr}`;
      options.push({ value: timeValue, label: timeLabel });
    }
  }

  return options;
};

/**
 * 시간 선택을 위한 TimePicker 컴포넌트
 *
 * @description
 * - 6시부터 23시까지 30분 단위로 시간 선택 가능
 * - 드롭다운 형태로 시간 선택
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  ({ className, value, placeholder, disabled, error, onChange, minTime, maxTime }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => dropdownRef.current as HTMLDivElement, []);

    const timeOptions = generateTimeOptions(minTime, maxTime);

    const baseStyles =
      'w-full h-[48px] px-4 rounded-[8px] transition-all duration-200 outline-none text-[14px] leading-[140%] flex items-center cursor-pointer';

    const selectedOption = timeOptions.find(opt => opt.value === value);
    const hasValue = !!selectedOption;

    const getStateStyles = () => {
      if (disabled) {
        return 'bg-neutral-200/50 border border-neutral-200 text-neutral-500 cursor-not-allowed';
      }

      if (error) {
        return 'bg-neutral-100 border border-red-500 text-neutral-1000';
      }

      if (hasValue && !isOpen) {
        return 'bg-neutral-100 border border-neutral-1000 text-neutral-1000';
      }

      if (isOpen) {
        return 'bg-neutral-100 border border-neutral-1000 text-neutral-1000';
      }

      return 'bg-neutral-100 border border-neutral-300 text-neutral-500 hover:border-neutral-1000';
    };

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(prev => !prev);
      }
    };

    const handleSelect = (timeValue: string) => {
      onChange?.(timeValue);
      setIsOpen(false);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div ref={ref || dropdownRef} className={`relative w-full ${className}`}>
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`${baseStyles} ${getStateStyles()}`}
        >
          <Image
            src={TimeIcon}
            alt="시간"
            width={20}
            height={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          />
          {hasValue ? (
            <BodySmall className="text-neutral-1000 ml-8">{selectedOption?.label}</BodySmall>
          ) : (
            <BodySmall className="text-neutral-500 ml-8">
              {placeholder || '시간을 선택해주세요'}
            </BodySmall>
          )}
          <Image
            src={isOpen ? ArrowUpIcon : ArrowDownIcon}
            alt="Toggle dropdown"
            className="ml-auto transition-transform duration-200"
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute left-0 right-0 bg-neutral-100 rounded-[8px] shadow-[0_6px_15px_rgba(0,0,0,0.2)] overflow-hidden z-50 max-h-[200px] overflow-y-auto">
            {timeOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-3 text-left transition-colors flex items-center ${
                  option.value === value
                    ? 'bg-[#e8e8e8]/50'
                    : 'bg-neutral-100 hover:bg-[#e8e8e8]/50'
                }`}
              >
                <BodySmall className="text-neutral-1000 ml-8">{option.label}</BodySmall>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

TimePicker.displayName = 'TimePicker';
