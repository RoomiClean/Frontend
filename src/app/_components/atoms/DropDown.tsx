'use client';
import { forwardRef, useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import ArrowUpIcon from '@/assets/svg/ArrowUp.svg';
import ArrowDownIcon from '@/assets/svg/ArrowDown.svg';
import { BodySmall } from './Typography';
import type { DropdownOption, DropdownProps } from '@/types/dropdown.types';

export type { DropdownOption, DropdownProps };

/**
 * 드롭다운 선택 컴포넌트
 *
 * @description
 * - Input 컴포넌트를 기반으로 한 드롭다운
 * - disabled, error, open 상태에 따라 스타일 변경
 */

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    { options, value, onChange, placeholder = '옵션을 선택해주세요', disabled, error, className },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const baseStyles =
      'w-full px-4 py-[14px] rounded-[10px] transition-all duration-200 outline-none text-[14px] leading-[140%] cursor-pointer flex items-center justify-between box-border';

    const selectedOption = options.find(opt => opt.value === value);
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

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
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
        {/* 드롭다운 버튼 */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`${baseStyles} ${getStateStyles()}`}
        >
          <BodySmall className={hasValue ? 'text-neutral-1000' : 'text-neutral-500'}>
            {selectedOption?.label || placeholder}
          </BodySmall>
          <Image
            src={isOpen ? ArrowUpIcon : ArrowDownIcon}
            alt="Toggle dropdown"
            className="transition-transform duration-200"
          />
        </button>

        {/* 드롭다운 메뉴 */}
        {isOpen && !disabled && (
          <div className="absolute left-0 right-0 bg-neutral-100 rounded-[8px] shadow-[0_6px_15px_rgba(0,0,0,0.2)] overflow-hidden z-50 max-h-[200px] overflow-y-auto">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-3 text-left transition-colors ${
                  option.value === value
                    ? 'bg-[#e8e8e8]/50'
                    : 'bg-neutral-100 hover:bg-[#e8e8e8]/50'
                }`}
              >
                <BodySmall className="text-neutral-1000">{option.label}</BodySmall>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

Dropdown.displayName = 'Dropdown';
