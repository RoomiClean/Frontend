'use client';

import { Control, Controller, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Input } from '@/app/_components/atoms/Input';
import { Dropdown } from '@/app/_components/atoms/DropDown';
import { TitleDefault, TitleH4 } from '@/app/_components/atoms/Typography';
import type { RequestFormData } from '@/types/requestForm.types';
import { RATING_OPTIONS, CLEANER_EXPERIENCE_OPTIONS } from '@/constants/requestForm.constants';

interface CleanerFilterFormProps {
  control: Control<RequestFormData>;
  register: UseFormRegister<RequestFormData>;
  watch: UseFormWatch<RequestFormData>;
}

export const CleanerFilterForm = ({ control, register, watch }: CleanerFilterFormProps) => {
  const minExperience = watch('minExperience');

  return (
    <div className="flex flex-col gap-8">
      <TitleH4>청소자 조건 필터</TitleH4>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <TitleDefault>최소 평점 (5.0 만점)</TitleDefault>
          <Controller
            name="minRating"
            control={control}
            render={({ field }) => (
              <Dropdown
                options={RATING_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="최소 평점을 선택해주세요"
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-3">
          <TitleDefault>청소자 경력</TitleDefault>
          <Controller
            name="minExperience"
            control={control}
            render={({ field }) => (
              <>
                <Dropdown
                  options={CLEANER_EXPERIENCE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="최소 경력을 선택해주세요"
                />
                {minExperience === 'custom' && (
                  <Input
                    type="text"
                    placeholder="경력을 직접 입력해주세요"
                    {...register('minExperienceCustom')}
                  />
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};
