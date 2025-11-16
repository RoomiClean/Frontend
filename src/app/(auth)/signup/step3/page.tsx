'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '@/app/_components/atoms/Input';
import { Dropdown } from '@/app/_components/atoms/DropDown';
import Button from '@/app/_components/atoms/Button';
import {
  DisplayDefault,
  BodyDefault,
  BodySmall,
  Caption,
  TitleDefault,
  TitleH4,
  TitleSmall,
  DisplayH1,
} from '@/app/_components/atoms/Typography';
import StepIndicator from '@/app/_components/molecules/StepIndicator';
import { BANKS, ACCOMMODATION_TYPES } from '@/constants/business.constants';
import {
  MARKETING_CONSENT,
  PRIVACY_POLICY,
  SERVICE_TERMS,
  LOCATION_TERMS,
} from '@/constants/agreements.constants';
import { useAgreements } from '@/hooks/useAgreements';

interface FormData {
  bank: string;
  accountHolder: string;
  accountNumber: string;
  // 숙소 정보 (host)
  accommodationName: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  accessMethod: string;
  accommodationType: string;
  roomCount: string;
  bedCount: string;
  livingRoomCount: string;
  bathroomCount: string;
  area: string;
  maxOccupancy: string;
  equipmentStorage: string;
  trashDisposal: string;
  hostRequests: string;
}

export default function SignUpStep3Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberType = searchParams.get('type');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      bank: '',
      accountHolder: '',
      accountNumber: '',
      accommodationName: '',
      zipCode: '',
      address: '',
      detailAddress: '',
      accessMethod: '',
      accommodationType: '',
      roomCount: '',
      bedCount: '',
      livingRoomCount: '',
      bathroomCount: '',
      area: '',
      maxOccupancy: '',
      equipmentStorage: '',
      trashDisposal: '',
      hostRequests: '',
    },
    mode: 'onChange',
  });

  const [success, setSuccess] = useState<Record<string, boolean>>({});
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [accommodationPhotos, setAccommodationPhotos] = useState<File[]>([]);
  const { agreements, toggleAgreement, isRequiredMet } = useAgreements({
    required: ['service', 'privacy', 'location'],
  });
  // 개인정보 수집 및 이용 동의(은행/계좌 관련)는 약관의 '개인정보 처리방침'과 독립적으로 관리
  const [privacyCollectionConsent, setPrivacyCollectionConsent] = useState(false);
  const [openAgreement, setOpenAgreement] = useState<
    'service' | 'privacy' | 'location' | 'marketing' | 'privacyConsentBox' | null
  >(null);
  const agreementContentMap = {
    service: SERVICE_TERMS,
    privacy: PRIVACY_POLICY,
    location: LOCATION_TERMS,
    marketing: MARKETING_CONSENT,
  } as const;
  const agreementTitleMap = {
    service: '서비스 이용약관',
    privacy: '개인정보 처리방침',
    location: '위치정보 이용약관',
    marketing: '마케팅 정보 수신 동의',
    privacyConsentBox: '개인정보 수집 및 이용 동의',
  } as const;
  const selectedAgreementContent =
    openAgreement && openAgreement !== 'privacyConsentBox'
      ? agreementContentMap[openAgreement]
      : '';
  const formatAgreementContent = (content: string) => {
    const headingRegex = /^(서비스 이용약관|총칙|부칙|제\d+조)/;
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        if (headingRegex.test(line)) {
          return { id: `heading-${index}`, variant: 'heading' as const, text: line };
        }
        if (/^\d+\./.test(line)) {
          const prefix = line.match(/^\d+\./)?.[0] ?? '';
          const text = line.replace(/^\d+\.\s*/, '').trim();
          return { id: `list-${index}`, variant: 'list' as const, text, prefix };
        }
        if (/^[•-]/.test(line)) {
          const text = line.replace(/^[•-]\s*/, '').trim();
          return { id: `bullet-${index}`, variant: 'list' as const, text, prefix: '•' };
        }
        return { id: `paragraph-${index}`, variant: 'paragraph' as const, text: line };
      });
  };
  const agreementBlocks = useMemo(
    () => formatAgreementContent(selectedAgreementContent),
    [selectedAgreementContent],
  );
  const agreementTabOrder: Array<'service' | 'privacy' | 'location' | 'marketing'> = [
    'service',
    'privacy',
    'location',
    'marketing',
  ];
  const isAgreementChecked =
    openAgreement === 'privacyConsentBox'
      ? privacyCollectionConsent
      : openAgreement
        ? agreements[openAgreement]
        : false;

  useEffect(() => {
    if (!memberType) {
      router.push('/signup/step1');
    }
  }, [memberType, router]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setValue(field as any, value);
    clearErrors(field as any);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
      return isValidSize && isValidType;
    });

    if (validFiles.length !== newFiles.length) {
      alert('5MB 이하의 JPG, PNG, GIF 파일만 업로드 가능합니다.');
    }

    setAccommodationPhotos(prev => [...prev, ...validFiles].slice(0, 20)); // 최대 20장
  };

  const removePhoto = (index: number) => {
    setAccommodationPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const findZipCode = () => {
    // 우편번호 찾기 API 연동 (예시)
    window.open('https://postcode.map.daum.net/guide');
  };

  const verifyAccount = async () => {
    const accountNumber = watch('accountNumber');
    if (!accountNumber) {
      setError('accountNumber', { type: 'manual', message: '계좌번호를 입력해주세요' });
      return;
    }

    if (accountNumber.length < 10) {
      setError('accountNumber', { type: 'manual', message: '올바른 계좌번호가 아닙니다' });
      return;
    }

    setSuccess(prev => ({ ...prev, accountNumber: true }));
    setIsAccountVerified(true);
  };

  const onSubmit = (data: FormData) => {
    if (memberType === 'cleaner') {
      // cleaner 타입의 경우
      if (!isRequiredMet) {
        alert('필수 약관에 동의해주세요');
        return;
      }
      router.push('/signup/step4');
    } else if (memberType === 'host') {
      // host 타입의 경우
      if (!data.accommodationName) {
        setError('accommodationName', { type: 'required', message: '숙소명을 입력해주세요' });
        return;
      }
      if (!data.address) {
        setError('address', { type: 'required', message: '주소를 입력해주세요' });
        return;
      }
      if (!data.detailAddress) {
        setError('detailAddress', { type: 'required', message: '상세주소를 입력해주세요' });
        return;
      }
      if (!data.accessMethod) {
        setError('accessMethod', { type: 'required', message: '출입 방법을 입력해주세요' });
        return;
      }
      if (!data.accommodationType) {
        setError('accommodationType', { type: 'required', message: '숙소 유형을 선택해주세요' });
        return;
      }
      if (!data.roomCount || !data.bedCount || !data.livingRoomCount || !data.bathroomCount) {
        alert('숙소 구조를 모두 입력해주세요');
        return;
      }
      if (!data.area || !data.maxOccupancy) {
        alert('숙소 면적과 최대 수용 인원을 입력해주세요');
        return;
      }
      if (!data.equipmentStorage) {
        setError('equipmentStorage', {
          type: 'required',
          message: '비품 보관장소를 입력해주세요',
        });
        return;
      }
      if (!data.trashDisposal) {
        setError('trashDisposal', { type: 'required', message: '쓰레기 배출장소를 입력해주세요' });
        return;
      }
      if (!isRequiredMet) {
        alert('필수 약관에 동의해주세요');
        return;
      }
      router.push('/signup/step4');
    }
  };

  return (
    <>
      <div className="min-h-[calc(100dvh-68px)] py-8">
        <div className="flex flex-col items-center gap-16 w-full max-w-[472px] px-4 mx-auto">
          <DisplayH1>회원가입</DisplayH1>

          {/* Step 표시 */}
          <StepIndicator currentStep={2} />

          <div className="w-full space-y-8">
            {/* cleaner 타입일 때 은행 정보 */}
            {memberType === 'cleaner' && (
              <div className="space-y-4">
                <TitleDefault>은행 정보</TitleDefault>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Dropdown
                      options={BANKS}
                      value={watch('bank')}
                      onChange={value => handleInputChange('bank', value)}
                      placeholder="옵션 선택"
                      error={!!errors.bank?.message}
                    />
                    {errors.bank?.message && (
                      <Caption className="text-red-500">{errors.bank.message}</Caption>
                    )}
                  </div>

                  <div className="space-y-2">
                    <TitleDefault>예금주명</TitleDefault>
                    <Input
                      placeholder="예금주명을 입력해주세요"
                      {...register('accountHolder')}
                      error={!!errors.accountHolder?.message}
                    />
                    {errors.accountHolder?.message && (
                      <Caption className="text-red-500">{errors.accountHolder.message}</Caption>
                    )}
                  </div>

                  <div className="space-y-2">
                    <TitleDefault>계좌 번호</TitleDefault>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="계좌번호를 입력해주세요(-제외)"
                          {...register('accountNumber')}
                          inputMode="numeric"
                          value={watch('accountNumber') ?? ''}
                          onChange={e =>
                            setValue('accountNumber', e.target.value.replace(/\D/g, ''), {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          error={!!errors.accountNumber?.message}
                        />
                      </div>
                      <Button variant="primary" onClick={verifyAccount} className="!w-24">
                        계좌 인증
                      </Button>
                    </div>
                    {errors.accountNumber?.message && (
                      <Caption className="text-red-500">{errors.accountNumber.message}</Caption>
                    )}
                    {success.accountNumber && (
                      <Caption className="text-green-500">계좌가 인증되었습니다</Caption>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="privacy-consent"
                        checked={privacyCollectionConsent}
                        onChange={e => setPrivacyCollectionConsent(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="privacy-consent" className="text-sm text-neutral-1000">
                        개인정보 수집 및 이용 동의
                      </label>
                    </div>
                    <button type="button" onClick={() => setOpenAgreement('privacyConsentBox')}>
                      <BodySmall className="text-neutral-600">보기</BodySmall>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* host 타입일 때 숙소 정보 */}
            {memberType === 'host' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <TitleH4>숙소정보</TitleH4>
                  <div className="flex items-center gap-1">
                    <span className="text-red-500">*</span>
                    <TitleSmall>필수입력사항</TitleSmall>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* 숙소명 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      숙소명 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Input
                      placeholder="숙소명을 입력해주세요"
                      {...register('accommodationName')}
                      error={!!errors.accommodationName?.message}
                    />
                    {errors.accommodationName?.message && (
                      <Caption className="text-red-500">{errors.accommodationName.message}</Caption>
                    )}
                  </div>

                  {/* 주소 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      주소 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <div className="flex gap-2">
                      <Input
                        placeholder="우편번호"
                        {...register('zipCode')}
                        disabled
                        className="!w-24"
                      />
                      <Input
                        placeholder="주소"
                        {...register('address')}
                        error={!!errors.address?.message}
                        className="flex-1"
                      />
                      <Button variant="primary" onClick={findZipCode} className="!w-32">
                        우편번호 찾기
                      </Button>
                    </div>
                    <Input
                      placeholder="상세주소 입력"
                      {...register('detailAddress')}
                      error={!!errors.detailAddress?.message}
                    />
                    {errors.address?.message && (
                      <Caption className="text-red-500">{errors.address.message}</Caption>
                    )}
                    {errors.detailAddress?.message && (
                      <Caption className="text-red-500">{errors.detailAddress.message}</Caption>
                    )}
                  </div>

                  {/* 출입 방법 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      출입 방법 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Input
                      placeholder="비밀번호, 키박스 등 출입 방법을 입력해주세요"
                      {...register('accessMethod')}
                      error={!!errors.accessMethod?.message}
                    />
                    {errors.accessMethod?.message && (
                      <Caption className="text-red-500">{errors.accessMethod.message}</Caption>
                    )}
                  </div>

                  {/* 숙소 유형 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      숙소 유형 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Dropdown
                      options={ACCOMMODATION_TYPES}
                      value={watch('accommodationType')}
                      onChange={value => handleInputChange('accommodationType', value)}
                      placeholder="옵션 선택"
                      error={!!errors.accommodationType?.message}
                    />
                    {errors.accommodationType?.message && (
                      <Caption className="text-red-500">{errors.accommodationType.message}</Caption>
                    )}
                  </div>

                  {/* 숙소 구조 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      숙소 구조 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <TitleSmall className="text-neutral-600">방 개수</TitleSmall>
                        <Input
                          placeholder="0"
                          {...register('roomCount')}
                          type="number"
                          inputMode="numeric"
                        />
                      </div>
                      <div className="space-y-1">
                        <TitleSmall className="text-neutral-600">침대 개수</TitleSmall>
                        <Input
                          placeholder="0"
                          {...register('bedCount')}
                          type="number"
                          inputMode="numeric"
                        />
                      </div>
                      <div className="space-y-1">
                        <TitleSmall className="text-neutral-600">거실 개수</TitleSmall>
                        <Input
                          placeholder="0"
                          {...register('livingRoomCount')}
                          type="number"
                          inputMode="numeric"
                        />
                      </div>
                      <div className="space-y-1">
                        <TitleSmall className="text-neutral-600">화장실 개수</TitleSmall>
                        <Input
                          placeholder="0"
                          {...register('bathroomCount')}
                          type="number"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 숙소 면적/규모 및 최대 수용 인원 */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* 숙소 면적/규모 */}
                    <div className="space-y-2">
                      <TitleDefault>
                        숙소 면적/규모 <span className="text-red-500">*</span>
                      </TitleDefault>
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder=""
                          {...register('area')}
                          type="number"
                          inputMode="decimal"
                          error={!!errors.area?.message}
                        />
                        <span className="text-neutral-1000 whitespace-nowrap">평</span>
                      </div>
                    </div>

                    {/* 최대 수용 인원 */}
                    <div className="space-y-2">
                      <TitleDefault>최대 수용 인원</TitleDefault>
                      <div className="flex gap-2 items-center">
                        <Input
                          placeholder=""
                          {...register('maxOccupancy')}
                          type="number"
                          inputMode="numeric"
                          error={!!errors.maxOccupancy?.message}
                        />
                        <span className="text-neutral-1000 whitespace-nowrap">명</span>
                      </div>
                    </div>
                  </div>

                  {/* 숙소 사진 업로드 */}
                  <div className="space-y-2">
                    <TitleDefault>숙소 사진 업로드</TitleDefault>
                    <div className="grid grid-cols-4 gap-2">
                      {accommodationPhotos.map((file, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`숙소 사진 ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-neutral-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center text-white hover:bg-neutral-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {accommodationPhotos.length < 20 && (
                        <label className="aspect-square border-2 border-dashed border-neutral-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-neutral-1000">
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl">📷</span>
                            <span className="text-xs text-neutral-600">사진첨부</span>
                          </div>
                        </label>
                      )}
                    </div>
                    <Caption className="text-neutral-500">
                      사진은 최대 20장, 각각 5MB, 전체 100MB를 넘을 수 없습니다. (JPG, PNG, GIF
                      가능)
                    </Caption>
                  </div>

                  {/* 비품 보관장소 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      비품 보관장소 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Input
                      placeholder="청소 비품 보관장소를 입력해주세요"
                      {...register('equipmentStorage')}
                      error={!!errors.equipmentStorage?.message}
                    />
                    {errors.equipmentStorage?.message && (
                      <Caption className="text-red-500">{errors.equipmentStorage.message}</Caption>
                    )}
                  </div>

                  {/* 쓰레기 배출장소 */}
                  <div className="space-y-2">
                    <TitleDefault>
                      쓰레기 배출장소 <span className="text-red-500">*</span>
                    </TitleDefault>
                    <Input
                      placeholder="쓰레기 배출장소를 입력해주세요"
                      {...register('trashDisposal')}
                      error={!!errors.trashDisposal?.message}
                    />
                    {errors.trashDisposal?.message && (
                      <Caption className="text-red-500">{errors.trashDisposal.message}</Caption>
                    )}
                  </div>

                  {/* 호스트 요청사항 */}
                  <div className="space-y-2">
                    <TitleDefault>호스트 요청사항</TitleDefault>
                    <Input placeholder="요청사항을 입력해주세요" {...register('hostRequests')} />
                  </div>
                </div>
              </div>
            )}

            {/* 약관동의 */}
            <div className="space-y-4">
              <BodyDefault className="font-medium">약관동의</BodyDefault>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="all-agreement"
                    checked={agreements.all}
                    onChange={e => toggleAgreement('all', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="all-agreement" className="text-sm font-medium text-neutral-1000">
                    아래 내용에 모두 동의합니다
                  </label>
                </div>

                <div className="border-t border-neutral-200" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="service-agreement"
                        checked={agreements.service}
                        onChange={e => toggleAgreement('service', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="service-agreement" className="text-sm text-neutral-1000">
                        서비스 이용 약관(필수)
                      </label>
                    </div>
                    <button type="button" onClick={() => setOpenAgreement('service')}>
                      <BodySmall className="text-neutral-600">보기</BodySmall>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="privacy-agreement"
                        checked={agreements.privacy}
                        onChange={e => toggleAgreement('privacy', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="privacy-agreement" className="text-sm text-neutral-1000">
                        개인정보 처리방침(필수)
                      </label>
                    </div>
                    <button type="button" onClick={() => setOpenAgreement('privacy')}>
                      <BodySmall className="text-neutral-600">보기</BodySmall>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="location-agreement"
                        checked={agreements.location}
                        onChange={e => toggleAgreement('location', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="location-agreement" className="text-sm text-neutral-1000">
                        위치정보 이용약관(필수)
                      </label>
                    </div>
                    <button type="button" onClick={() => setOpenAgreement('location')}>
                      <BodySmall className="text-neutral-600">보기</BodySmall>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="marketing-agreement"
                        checked={agreements.marketing}
                        onChange={e => toggleAgreement('marketing', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="marketing-agreement" className="text-sm text-neutral-1000">
                        마케팅 정보 수신(선택)
                      </label>
                    </div>
                    <button type="button" onClick={() => setOpenAgreement('marketing')}>
                      <BodySmall className="text-neutral-600">보기</BodySmall>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 다음 단계 버튼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[400px]">
            <Button type="submit" variant="primary" className="w-full">
              회원가입 완료
            </Button>
          </form>
        </div>
      </div>
      {openAgreement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 px-4 py-8 backdrop-blur-sm"
          onClick={() => setOpenAgreement(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div>
                <TitleDefault className="text-neutral-1000">
                  {openAgreement
                    ? agreementTitleMap[
                        openAgreement as 'service' | 'privacy' | 'location' | 'marketing'
                      ]
                    : ''}
                </TitleDefault>
                <BodySmall className="text-neutral-500">
                  필요한 약관을 선택해서 자세한 내용을 확인하세요.
                </BodySmall>
              </div>
              <button
                type="button"
                onClick={() => setOpenAgreement(null)}
                aria-label="닫기"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-xl text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-700"
              >
                ×
              </button>
            </div>

            {openAgreement !== 'privacyConsentBox' && (
              <div className="flex flex-wrap gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-3">
                {agreementTabOrder.map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setOpenAgreement(tab)}
                    aria-pressed={openAgreement === tab}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                      openAgreement === tab
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-transparent bg-white text-neutral-600 hover:border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {agreementTitleMap[tab]}
                  </button>
                ))}
              </div>
            )}

            <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
              {openAgreement === 'privacyConsentBox' ? (
                <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                  <BodyDefault className="font-medium mb-3">개인정보 수집 및 이용 동의</BodyDefault>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>아래와 같은 목적으로 개인정보를 수집 및 이용합니다.</p>
                    <p>
                      <strong>수집 항목:</strong> 은행명, 계좌번호
                    </p>
                    <p>
                      <strong>수집 목적:</strong> 수익 정산
                    </p>
                    <p>
                      <strong>보유 기간:</strong> 정보 삭제 요청 또는 회원 탈퇴 시 파기
                    </p>
                    <p className="text-red-500">
                      동의를 거부할 수 있으나, 동의 거부 시 수익 정산 처리가 어렵습니다.
                    </p>
                  </div>
                </div>
              ) : agreementBlocks.length > 0 ? (
                <div className="space-y-3">
                  {agreementBlocks.map(block => {
                    if (block.variant === 'heading') {
                      return (
                        <TitleSmall key={block.id} className="text-neutral-900">
                          {block.text}
                        </TitleSmall>
                      );
                    }
                    if (block.variant === 'list') {
                      const anyBlock = block as any;
                      return (
                        <div
                          key={block.id}
                          className="flex items-start gap-2 text-sm text-neutral-700"
                        >
                          {anyBlock.prefix ? (
                            <span className="mt-0.5 font-semibold text-neutral-500">
                              {anyBlock.prefix}
                            </span>
                          ) : null}
                          <span className="leading-relaxed">{block.text}</span>
                        </div>
                      );
                    }
                    return (
                      <BodySmall key={block.id} className="text-neutral-800 leading-relaxed">
                        {block.text}
                      </BodySmall>
                    );
                  })}
                </div>
              ) : (
                <BodySmall className="text-neutral-500">
                  약관 내용을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
                </BodySmall>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-neutral-200 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-neutral-800">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={isAgreementChecked}
                  onChange={event => {
                    if (!openAgreement) return;
                    if (openAgreement === 'privacyConsentBox') {
                      setPrivacyCollectionConsent(event.target.checked);
                    } else {
                      toggleAgreement(openAgreement, event.target.checked);
                    }
                  }}
                />
                <span className="leading-tight">
                  {openAgreement ? agreementTitleMap[openAgreement] : ''} 에 동의합니다.
                </span>
              </label>
              <button
                type="button"
                onClick={() => {
                  if (!openAgreement) return;
                  if (openAgreement === 'privacyConsentBox') {
                    setPrivacyCollectionConsent(prev => !prev);
                  } else {
                    toggleAgreement(openAgreement, !isAgreementChecked);
                  }
                }}
                className={`rounded-lg px-6 py-2 text-sm font-semibold transition ${
                  isAgreementChecked
                    ? 'border border-neutral-300 text-neutral-700 hover:border-neutral-500'
                    : 'bg-neutral-900 text-white hover:bg-neutral-800'
                }`}
              >
                {isAgreementChecked ? '동의안함' : '동의하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
