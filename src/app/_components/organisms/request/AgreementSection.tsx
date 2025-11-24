'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BodySmall, Caption } from '@/app/_components/atoms/Typography';
import type { RequestFormData } from '@/types/requestForm.types';

interface AgreementSectionProps {
  register: UseFormRegister<RequestFormData>;
  errors: FieldErrors<RequestFormData>;
}

export const AgreementSection = ({ register }: AgreementSectionProps) => {
  return (
    <div className="space-y-2 mb-[36px]">
      <label className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('serviceAgreement', { required: '약관에 동의해주세요' })}
            className="w-4 h-4"
          />
          <BodySmall className="text-neutral-900">청소 서비스 중개 및 결제 약관 (필수)</BodySmall>
        </div>
        <button type="button" className="text-neutral-600">
          <BodySmall>보기</BodySmall>
        </button>
      </label>
      <label className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('entryAgreement', { required: '약관에 동의해주세요' })}
            className="w-4 h-4"
          />
          <BodySmall className="text-neutral-900">청소자 입실 권한 부여 동의 (필수)</BodySmall>
        </div>
        <button type="button" className="text-neutral-600">
          <BodySmall>보기</BodySmall>
        </button>
      </label>
    </div>
  );
};
