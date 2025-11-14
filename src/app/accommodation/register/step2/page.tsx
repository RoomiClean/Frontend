'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import Image from 'next/image';
import { Input } from '@/app/_components/atoms/Input';
import { Dropdown } from '@/app/_components/atoms/DropDown';
import Button from '@/app/_components/atoms/Button';
import {
  BodyDefault,
  BodySmall,
  Caption,
  TitleDefault,
  TitleH4,
  TitleSmall,
  DisplayH1,
} from '@/app/_components/atoms/Typography';
import {
  MARKETING_CONSENT,
  PRIVACY_POLICY,
  SERVICE_TERMS,
  LOCATION_TERMS,
} from '@/constants/agreements.constants';
import { ACCOMMODATION_TYPES } from '@/constants/business.constants';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useAgreements } from '@/hooks/useAgreements';
import { useAccountVerification } from '@/hooks/useAccountVerification';
import { BiSolidCamera } from 'react-icons/bi';

interface DaumPostcodeData {
  zonecode: string;
  roadAddress: string;
  jibunAddress: string;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (config: { oncomplete: (data: DaumPostcodeData) => void }) => {
        open: () => void;
      };
    };
  }
}

type AgreementType = 'service' | 'privacy' | 'location' | 'marketing';

interface AgreementBlock {
  id: string;
  variant: 'heading' | 'paragraph' | 'list';
  text: string;
  prefix?: string;
}

const formatAgreementContent = (content: string): AgreementBlock[] => {
  const headingRegex = /^(서비스 이용약관|총칙|부칙|제\d+조)/;

  return content
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      if (headingRegex.test(line)) {
        return {
          id: `heading-${index}`,
          variant: 'heading',
          text: line,
        };
      }

      if (/^\d+\./.test(line)) {
        const prefix = line.match(/^\d+\./)?.[0] ?? '';
        const text = line.replace(/^\d+\.\s*/, '').trim();
        return {
          id: `list-${index}`,
          variant: 'list',
          text,
          prefix,
        };
      }

      if (/^[•-]/.test(line)) {
        const text = line.replace(/^[•-]\s*/, '').trim();
        return {
          id: `bullet-${index}`,
          variant: 'list',
          text,
          prefix: '•',
        };
      }

      return {
        id: `paragraph-${index}`,
        variant: 'paragraph',
        text: line,
      };
    });
};

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
  const [openAgreement, setOpenAgreement] = useState<AgreementType | null>(null);
  const { agreements, toggleAgreement, isRequiredMet } = useAgreements({
    required: ['service', 'privacy', 'location'],
  });
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
  } as const;
  const selectedAgreementContent = openAgreement ? agreementContentMap[openAgreement] : '';
  const agreementBlocks = useMemo(
    () => formatAgreementContent(selectedAgreementContent),
    [selectedAgreementContent],
  );
  const agreementTabOrder: AgreementType[] = ['service', 'privacy', 'location', 'marketing'];
  const isAgreementChecked = openAgreement ? agreements[openAgreement] : false;

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
  const [photoError, setPhotoError] = useState<string | null>(null);

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
    if (accommodationPhotos.length < 5) {
      setPhotoError('숙소 사진을 최소 5장 이상 업로드해주세요.');
      alert('숙소 사진을 최소 5장 이상 업로드해주세요.');
      return;
    }

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
    <>
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
                        <Caption className="text-red-500 text-xs">
                          {errors.roomCount.message}
                        </Caption>
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
                        <Caption className="text-red-500 text-xs">
                          {errors.bedCount.message}
                        </Caption>
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
                  <TitleDefault>
                    숙소 사진 업로드 <span className="text-red-500">*</span>
                  </TitleDefault>
                  <div className="flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pb-2">
                    {accommodationPhotos.length < 20 && (
                      <div className="flex-shrink-0">
                        <label className="w-28 h-28 border-2 border-neutral-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-neutral-1000">
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/gif"
                            onChange={e => {
                              handleFileUpload(e);
                              setPhotoError(null);
                            }}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl">
                              <BiSolidCamera className="w-3 h-3" />
                            </span>
                            <TitleDefault className="text-neutral-600">사진첨부</TitleDefault>
                          </div>
                        </label>
                      </div>
                    )}
                    {accommodationPhotos.map((file, index) => (
                      <div key={index} className="relative w-28 h-28 flex-shrink-0">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`숙소 사진 ${index + 1}`}
                          width={112}
                          height={112}
                          unoptimized
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
                  </div>
                  <Caption className="text-neutral-500">
                    사진은 최소 5장, 최대 20장까지 업로드해야 하며 각각 5MB, 전체 100MB를 넘을 수
                    없습니다. (JPG, PNG, GIF 가능)
                  </Caption>
                  {photoError && <Caption className="text-red-500">{photoError}</Caption>}
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
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <Button type="submit" variant="primary" className="w-full">
              숙소 등록하기
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
                  {agreementTitleMap[openAgreement]}
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

            <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
              {agreementBlocks.length > 0 ? (
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
                      return (
                        <div
                          key={block.id}
                          className="flex items-start gap-2 text-sm text-neutral-700"
                        >
                          {block.prefix && (
                            <span className="mt-0.5 font-semibold text-neutral-500">
                              {block.prefix}
                            </span>
                          )}
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
                  onChange={event =>
                    openAgreement && toggleAgreement(openAgreement, event.target.checked)
                  }
                />
                <span className="leading-tight">
                  {agreementTitleMap[openAgreement]}에 동의합니다.
                </span>
              </label>
              <button
                type="button"
                onClick={() => openAgreement && toggleAgreement(openAgreement, !isAgreementChecked)}
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
