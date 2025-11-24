'use client';

import { useForm } from 'react-hook-form';
import { RequestTemplate } from '@/app/_components/templates/RequestTemplate';
import { BasicRulesForm } from '@/app/_components/organisms/request/BasicRulesForm';
import { CleanerFilterForm } from '@/app/_components/organisms/request/CleanerFilterForm';
import { SpecialNotesForm } from '@/app/_components/organisms/request/SpecialNotesForm';
import { PaymentSection } from '@/app/_components/organisms/request/PaymentSection';
import { AgreementSection } from '@/app/_components/organisms/request/AgreementSection';
import Button from '@/app/_components/atoms/Button';
import { DisplayH3, TitleDefault } from '@/app/_components/atoms/Typography';
import type { RequestFormData } from '@/types/requestForm.types';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { DropdownOption } from '@/types/dropdown.types';

export default function AutomaticRequestPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<RequestFormData>({
    defaultValues: {
      accommodationId: '',
      cleaningType: 'basic',
      laundryItems: {},
      isAutomatic: true,
      triggerType: 'immediate',
      triggerHours: '',
      requestPeriodStart: '',
      requestPeriodEnd: '',
      completionTimeType: 'auto',
      completionTime: '',
      minRating: '',
      minExperience: '',
      minExperienceCustom: '',
      referencePhotos: [],
      textMemo: '',
      emergencyContact: '',
      serviceAgreement: false,
      entryAgreement: false,
    },
    mode: 'onChange',
  });

  const {
    files: uploadedPhotos,
    uploadFile: handlePhotoUpload,
    removeFile: removePhoto,
  } = useFileUpload({
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    onError: (message: string) => {
      if (typeof window !== 'undefined') {
        alert(message);
      }
    },
  });

  const accommodationOptions: DropdownOption[] = [
    { value: '1', label: '외대 앞 에어비앤비' },
    { value: '2', label: '강남구 숙소' },
    { value: '3', label: '홍대 근처 숙소' },
  ];

  const onSubmit = (data: RequestFormData) => {
    console.log('Automatic request submitted:', data);
  };

  const isFormValid = () => {
    const accommodationId = watch('accommodationId');
    const triggerType = watch('triggerType');
    const triggerHours = watch('triggerHours');
    const requestPeriodStart = watch('requestPeriodStart');
    const requestPeriodEnd = watch('requestPeriodEnd');
    const cleaningType = watch('cleaningType');
    const laundryItems = watch('laundryItems');
    const serviceAgreement = watch('serviceAgreement');
    const entryAgreement = watch('entryAgreement');

    // 기본 필수 항목
    if (!accommodationId || !triggerType || !requestPeriodStart || !requestPeriodEnd) {
      return false;
    }

    // 트리거 시간 검증 (hours-after 또는 hours-before 선택 시)
    if ((triggerType === 'hours-after' || triggerType === 'hours-before') && !triggerHours) {
      return false;
    }

    // 약관 동의
    if (!serviceAgreement || !entryAgreement) {
      return false;
    }

    // 세탁물 수량 검증 (기본 청소 + 세탁 선택 시)
    if (cleaningType === 'basic-laundry') {
      if (!laundryItems || typeof laundryItems !== 'object') {
        return false;
      }
      const hasLaundryItems = Object.values(laundryItems).some(value => value > 0);
      if (!hasLaundryItems) {
        return false;
      }
    }

    return isValid && Object.keys(errors).length === 0;
  };

  return (
    <RequestTemplate>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-[472px] mx-auto flex flex-col"
      >
        {/* 제목 */}
        <div className="space-y-2 mb-16">
          <DisplayH3 className="text-neutral-1000">자동 청소 요청</DisplayH3>
          <TitleDefault className="text-neutral-800">
            아래 정보를 입력하고 청소 요청을 진행해보세요.
          </TitleDefault>
        </div>

        {/* 기본 규칙 설정 */}
        <div className="flex flex-col gap-8">
          <BasicRulesForm
            isAutomatic={true}
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            accommodationOptions={accommodationOptions}
          />

          {/* 청소자 조건 필터 */}
          <CleanerFilterForm control={control} register={register} watch={watch} />

          {/* 특이사항 입력 */}
          <SpecialNotesForm
            control={control}
            watch={watch}
            setValue={setValue}
            clearErrors={clearErrors}
            uploadedPhotos={uploadedPhotos}
            handlePhotoUpload={handlePhotoUpload}
            removePhoto={removePhoto}
          />
        </div>

        {/* 결제 예상 금액 */}
        <PaymentSection isAutomatic={true} />

        {/* 약관 동의 */}
        <AgreementSection register={register} errors={errors} />

        {/* 제출 버튼 */}
        <Button
          type="submit"
          variant="primary"
          active={isFormValid()}
          disabled={!isFormValid()}
          className="w-full"
        >
          요청하기
        </Button>
      </form>
    </RequestTemplate>
  );
}
