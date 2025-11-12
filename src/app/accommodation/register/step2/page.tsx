'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/app/_components/atoms/Input';
import { Dropdown } from '@/app/_components/atoms/DropDown';
import Button from '@/app/_components/atoms/Button';
import {
  BodyDefault,
  Caption,
  TitleDefault,
  TitleH4,
  TitleSmall,
  DisplayH1,
} from '@/app/_components/atoms/Typography';
import { ACCOMMODATION_TYPES } from '@/constants/business.constants';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useAgreements } from '@/hooks/useAgreements';
import { useAccountVerification } from '@/hooks/useAccountVerification';

declare global {
  interface Window {
    daum?: {
      Postcode: new (config: { oncomplete: (data: any) => void }) => { open: () => void };
    };
  }
}

interface FormData {
  bank: string;
  accountHolder: string;
  accountNumber: string;
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

export default function RegisterAccommodationStep2Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    setFocus,
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

  const [isPostcodeLoaded, setIsPostcodeLoaded] = useState(false);

  useEffect(() => {
    if (window.daum?.Postcode) {
      setIsPostcodeLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => setIsPostcodeLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const {
    ref: zipCodeRef,
    onBlur: zipCodeOnBlur,
    ...zipCodeRest
  } = register('zipCode', {
    required: '우편번호를 입력해주세요',
  });
  const {
    ref: addressRef,
    onBlur: addressOnBlur,
    ...addressRest
  } = register('address', {
    required: '주소를 입력해주세요',
  });
  const zipCodeValue = watch('zipCode');
  const addressValue = watch('address');
  const accommodationNameValue = watch('accommodationName');
  const detailAddressValue = watch('detailAddress');
  const accessMethodValue = watch('accessMethod');
  const roomCountValue = watch('roomCount');
  const bedCountValue = watch('bedCount');
  const livingRoomCountValue = watch('livingRoomCount');
  const bathroomCountValue = watch('bathroomCount');
  const areaValue = watch('area');
  const maxOccupancyValue = watch('maxOccupancy');
  const equipmentStorageValue = watch('equipmentStorage');
  const trashDisposalValue = watch('trashDisposal');
  const hostRequestsValue = watch('hostRequests');
  const [isAddressSelected, setIsAddressSelected] = useState(false);

  useEffect(() => {
    setIsAddressSelected(!!addressValue?.trim());
  }, [addressValue]);

  // 커스텀 훅 사용
  const {
    files: accommodationPhotos,
    uploadFile: handleFileUpload,
    removeFile: removePhoto,
  } = useFileUpload({
    maxFiles: 20,
    maxSize: 5 * 1024 * 1024,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    onError: alert,
  });

  const { agreements, toggleAgreement, isRequiredMet } = useAgreements({
    required: ['service', 'privacy', 'location'],
  });

  const { isVerified: isAccountVerified, verifyAccount } = useAccountVerification();

  const findZipCode = () => {
    if (!isPostcodeLoaded || !window.daum?.Postcode) {
      alert('우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: data => {
        setValue('zipCode', data.zonecode, { shouldValidate: true, shouldDirty: true });
        setValue('address', data.roadAddress || data.jibunAddress, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setFocus('detailAddress');
      },
    }).open();
  };

  const handleVerifyAccount = async () => {
    const accountNumber = watch('accountNumber');
    const bank = watch('bank');
    await verifyAccount(accountNumber, bank);
  };

  const onSubmit = (data: FormData) => {
    if (!isRequiredMet) {
      alert('필수 약관에 동의해주세요');
      return;
    }

    // TODO: API 호출
    console.log('Submitted data:', { ...data, accommodationPhotos, agreements });

    // 완료 페이지로 이동 또는 목록으로 이동
    router.push('/accommodation/register/done');
  };

  return (
    <div className="min-h-[calc(100dvh-68px)] py-8">
      <div className="flex flex-col items-center gap-16 w-full max-w-[472px] px-4 mx-auto">
        <DisplayH1>숙소 신규 등록하기</DisplayH1>

        <div className="w-full space-y-8">
          {/* 숙소정보 */}
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
                  {...register('accommodationName', {
                    required: '숙소명을 입력해주세요',
                  })}
                  error={!!errors.accommodationName?.message}
                  value={accommodationNameValue ?? ''}
                />
                {errors.accommodationName?.message && (
                  <Caption className="text-red-500">{errors.accommodationName.message}</Caption>
                )}
              </div>

              {/* 주소 */}
              <div className="space-y-3">
                <TitleDefault>
                  주소 <span className="text-red-500">*</span>
                </TitleDefault>
                <div className="flex gap-2">
                  <Input
                    placeholder="우편번호"
                    ref={zipCodeRef}
                    {...zipCodeRest}
                    onBlur={e => {
                      zipCodeOnBlur?.(e);
                      if (!e.target.value.trim()) {
                        setValue('zipCode', '');
                      }
                    }}
                    value={zipCodeValue}
                    error={!!errors.zipCode?.message}
                    className="flex-1"
                    readOnly={isAddressSelected}
                    disabled={!isAddressSelected}
                  />
                  <Button
                    variant="primary"
                    onClick={findZipCode}
                    className="!w-32 !h-12 flex items-center justify-center"
                  >
                    우편번호 찾기
                  </Button>
                </div>
                {errors.zipCode?.message && (
                  <Caption className="text-red-500">{errors.zipCode.message}</Caption>
                )}
                <Input
                  placeholder="주소"
                  ref={addressRef}
                  {...addressRest}
                  onBlur={e => {
                    addressOnBlur?.(e);
                    if (!e.target.value.trim()) {
                      setValue('address', '');
                    }
                  }}
                  value={addressValue}
                  error={!!errors.address?.message}
                  readOnly={isAddressSelected}
                  disabled={!isAddressSelected}
                />
                {errors.address?.message && (
                  <Caption className="text-red-500">{errors.address.message}</Caption>
                )}
                <Input
                  placeholder="상세주소 입력"
                  {...register('detailAddress', {
                    required: '상세주소를 입력해주세요',
                  })}
                  error={!!errors.detailAddress?.message}
                  value={detailAddressValue ?? ''}
                />
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
                  {...register('accessMethod', {
                    required: '출입 방법을 입력해주세요',
                  })}
                  error={!!errors.accessMethod?.message}
                  value={accessMethodValue ?? ''}
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
                <Controller
                  name="accommodationType"
                  control={control}
                  rules={{ required: '숙소 유형을 선택해주세요' }}
                  render={({ field }) => (
                    <Dropdown
                      options={ACCOMMODATION_TYPES}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="옵션 선택"
                      error={!!errors.accommodationType?.message}
                    />
                  )}
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
                      {...register('roomCount', {
                        required: '방 개수를 입력해주세요',
                        pattern: {
                          value: /^\d+$/,
                          message: '숫자만 입력 가능합니다',
                        },
                      })}
                      type="number"
                      value={roomCountValue ?? ''}
                    />
                    {errors.roomCount?.message && (
                      <Caption className="text-red-500 text-xs">{errors.roomCount.message}</Caption>
                    )}
                  </div>
                  <div className="space-y-1">
                    <TitleSmall className="text-neutral-600">침대 개수</TitleSmall>
                    <Input
                      placeholder="0"
                      {...register('bedCount', {
                        required: '침대 개수를 입력해주세요',
                        pattern: {
                          value: /^\d+$/,
                          message: '숫자만 입력 가능합니다',
                        },
                      })}
                      type="number"
                      value={bedCountValue ?? ''}
                    />
                    {errors.bedCount?.message && (
                      <Caption className="text-red-500 text-xs">{errors.bedCount.message}</Caption>
                    )}
                  </div>
                  <div className="space-y-1">
                    <TitleSmall className="text-neutral-600">거실 개수</TitleSmall>
                    <Input
                      placeholder="0"
                      {...register('livingRoomCount', {
                        required: '거실 개수를 입력해주세요',
                        pattern: {
                          value: /^\d+$/,
                          message: '숫자만 입력 가능합니다',
                        },
                      })}
                      type="number"
                      value={livingRoomCountValue ?? ''}
                    />
                    {errors.livingRoomCount?.message && (
                      <Caption className="text-red-500 text-xs">
                        {errors.livingRoomCount.message}
                      </Caption>
                    )}
                  </div>
                  <div className="space-y-1">
                    <TitleSmall className="text-neutral-600">화장실 개수</TitleSmall>
                    <Input
                      placeholder="0"
                      {...register('bathroomCount', {
                        required: '화장실 개수를 입력해주세요',
                        pattern: {
                          value: /^\d+$/,
                          message: '숫자만 입력 가능합니다',
                        },
                      })}
                      type="number"
                      value={bathroomCountValue ?? ''}
                    />
                    {errors.bathroomCount?.message && (
                      <Caption className="text-red-500 text-xs">
                        {errors.bathroomCount.message}
                      </Caption>
                    )}
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
                      {...register('area', {
                        required: '숙소 면적을 입력해주세요',
                        pattern: {
                          value: /^\d+(\.\d+)?$/,
                          message: '올바른 숫자를 입력해주세요',
                        },
                      })}
                      type="number"
                      error={!!errors.area?.message}
                      value={areaValue ?? ''}
                    />
                    <span className="text-neutral-1000 whitespace-nowrap">평</span>
                  </div>
                  {errors.area?.message && (
                    <Caption className="text-red-500">{errors.area.message}</Caption>
                  )}
                </div>

                {/* 최대 수용 인원 */}
                <div className="space-y-2">
                  <TitleDefault>최대 수용 인원</TitleDefault>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder=""
                      {...register('maxOccupancy', {
                        pattern: {
                          value: /^\d+$/,
                          message: '올바른 숫자를 입력해주세요',
                        },
                      })}
                      type="number"
                      error={!!errors.maxOccupancy?.message}
                      value={maxOccupancyValue ?? ''}
                    />
                    <span className="text-neutral-1000 whitespace-nowrap">명</span>
                  </div>
                  {errors.maxOccupancy?.message && (
                    <Caption className="text-red-500">{errors.maxOccupancy.message}</Caption>
                  )}
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
                  사진은 최대 20장, 각각 5MB, 전체 100MB를 넘을 수 없습니다. (JPG, PNG, GIF 가능)
                </Caption>
              </div>

              {/* 비품 보관장소 */}
              <div className="space-y-2">
                <TitleDefault>
                  비품 보관장소 <span className="text-red-500">*</span>
                </TitleDefault>
                <Input
                  placeholder="청소 비품 보관장소를 입력해주세요"
                  {...register('equipmentStorage', {
                    required: '비품 보관장소를 입력해주세요',
                  })}
                  error={!!errors.equipmentStorage?.message}
                  value={equipmentStorageValue ?? ''}
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
                  {...register('trashDisposal', {
                    required: '쓰레기 배출장소를 입력해주세요',
                  })}
                  error={!!errors.trashDisposal?.message}
                  value={trashDisposalValue ?? ''}
                />
                {errors.trashDisposal?.message && (
                  <Caption className="text-red-500">{errors.trashDisposal.message}</Caption>
                )}
              </div>

              {/* 호스트 요청사항 */}
              <div className="space-y-2">
                <TitleDefault>호스트 요청사항</TitleDefault>
                <Input
                  placeholder="요청사항을 입력해주세요"
                  {...register('hostRequests')}
                  value={hostRequestsValue ?? ''}
                />
              </div>
            </div>
          </div>

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

              <div className="space-y-2 pl-6">
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
                  <button type="button" className="text-sm text-primary-艺术 underline">
                    보기
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
                  <button type="button" className="text-sm text-primary-400 underline">
                    보기
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
                  <button type="button" className="text-sm text-primary-400 underline">
                    보기
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
                  <button type="button" className="text-sm text-primary-400 underline">
                    보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 다음 단계 버튼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <Button type="submit" variant="primary" className="w-full">
            숙소 등록하기
          </Button>
        </form>
      </div>
    </div>
  );
}
