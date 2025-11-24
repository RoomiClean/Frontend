'use client';

import {
  Control,
  Controller,
  UseFormWatch,
  UseFormSetValue,
  UseFormClearErrors,
} from 'react-hook-form';
import Image from 'next/image';
import { Textarea } from '@/app/_components/atoms/Textarea';
import { LabeledInput } from '@/app/_components/molecules/LabeledInput';
import { TitleDefault, TitleH4, BodySmall } from '@/app/_components/atoms/Typography';
import CameraIcon from '@/assets/svg/Camera.svg';
import type { RequestFormData } from '@/types/requestForm.types';

interface SpecialNotesFormProps {
  control: Control<RequestFormData>;
  watch: UseFormWatch<RequestFormData>;
  setValue: UseFormSetValue<RequestFormData>;
  clearErrors: UseFormClearErrors<RequestFormData>;
  uploadedPhotos: File[];
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
}

export const SpecialNotesForm = ({
  control,
  watch,
  setValue,
  clearErrors,
  uploadedPhotos,
  handlePhotoUpload,
  removePhoto,
}: SpecialNotesFormProps) => {
  const handleInputChange = (field: keyof RequestFormData, value: string) => {
    setValue(field, value);
    clearErrors(field);
  };

  return (
    <>
      <TitleH4>특이사항 입력</TitleH4>
      <div className="flex flex-col gap-6">
        {/* 참고 사진 업로드 */}
        <div className="flex flex-col gap-3">
          <TitleDefault>참고 사진 업로드</TitleDefault>
          <div className="flex flex-wrap gap-2">
            {uploadedPhotos.length < 5 && (
              <label className="w-[90px] h-[90px] border-[1px] border-neutral-300 flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <Image src={CameraIcon} alt="사진첨부" className="mb-[10px]" />
                <TitleDefault className="text-neutral-1000">사진첨부</TitleDefault>
              </label>
            )}
            {uploadedPhotos.map((file, index) => (
              <div key={index} className="relative w-[90px] h-[90px]">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`참고 사진 ${index + 1}`}
                  width={112}
                  height={112}
                  unoptimized
                  className="w-full h-full object-cover border border-neutral-200"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-1 w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center text-white hover:bg-neutral-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <BodySmall className="text-neutral-1000">
            사진은 최대 5장, 각각 5MB, 전체 50MB를 넘을 수 없습니다. (JPG, PNG, GIF 가능)
          </BodySmall>
        </div>

        {/* 텍스트 메모 */}
        <div className="flex flex-col gap-3">
          <TitleDefault>텍스트 메모</TitleDefault>
          <Textarea
            placeholder="청소자에게 남길 메모를 작성해주세요"
            className="h-[241px]"
            maxLength={500}
            showCharCount
            value={watch('textMemo') || ''}
            onChange={e => handleInputChange('textMemo', e.target.value)}
          />
        </div>

        {/* 비상 연락처 입력 */}
        <div>
          <Controller
            name="emergencyContact"
            control={control}
            render={({ field }) => (
              <LabeledInput
                label="비상 연락처 입력"
                type="tel"
                placeholder="비상 연락처를 입력해주세요(-제외)"
                value={field.value ?? ''}
                onChange={e => {
                  const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                  field.onChange(onlyNumbers);
                }}
                inputMode="numeric"
              />
            )}
          />
        </div>
      </div>
    </>
  );
};
