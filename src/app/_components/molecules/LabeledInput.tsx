'use client';
import React from 'react';
import { Label } from '../atoms/Label';
import { Input, InputProps } from '../atoms/Input';

interface LabeledInputProps extends InputProps {
  label: string;
  required?: boolean;
}

/**
 * 라벨 + Input 컴포넌트
 *
 * @description
 * - `required`가 true일 경우 라벨 옆에 * 표시 (필수입력 사항)
 *
 * @param {string} label - Input 위에 표시될 라벨 텍스트
 * @param {boolean} [required] - 필수 입력 여부, true면 라벨 옆에 * 표시
 *
 */
export const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ label, required, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-[12px] w-full">
        <Label>
          {label} {required && <span className="text-red-100">*</span>}
        </Label>
        <Input ref={ref} className={className} {...props} />
      </div>
    );
  },
);

LabeledInput.displayName = 'LabeledInput';
