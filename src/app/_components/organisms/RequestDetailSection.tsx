import Image from 'next/image';
import Link from 'next/link';
import Button from '../atoms/Button';
import {
  DisplayH3,
  DisplayH4,
  BodySmall,
  BodyDefault,
  TitleH4,
  TitleDefault,
} from '../atoms/Typography';

interface RequestDetailSectionProps {
  // 헤더 정보
  imageUrl: string;
  title: string;
  requestDateTime: string;
  cleaningStartDateTime?: string;
  completionDateTime: string;
  selectedOption: string;
  requestStatus: 'pending' | 'scheduled' | 'in-progress';
  requestId: string;
  // 청소 기본 규칙
  triggerPoint: string;
  requestPeriod: string;
  phoneNumber: string;
  emergencyContact: string;
  // 청소자 조건 필터
  minimumRating: number;
  minimumExperience: string;
  // 텍스트 메모
  memo: string;
  // 참고 사진
  referencePhotos: string[];
  // 결제 정보
  baseFee: number;
  platformFee: number;
  platformFeeRate: number;
  // 이벤트 핸들러
  onCheckCleaner?: () => void;
  onCancelRequest?: () => void;
}

/**
 * 요청 상세 정보 섹션 컴포넌트
 *
 * 상태에 따라 다른 정보를 표시
 * - pending, scheduled: 요청 취소하기 버튼 표시
 * - in-progress: 요청 취소하기 버튼 미표시
 */
export default function RequestDetailSection({
  imageUrl,
  title,
  requestDateTime,
  cleaningStartDateTime,
  completionDateTime,
  selectedOption,
  requestStatus,
  requestId,
  triggerPoint,
  requestPeriod,
  phoneNumber,
  emergencyContact,
  minimumRating,
  minimumExperience,
  memo,
  referencePhotos,
  baseFee,
  platformFee,
  platformFeeRate,
  onCheckCleaner,
  onCancelRequest,
}: RequestDetailSectionProps) {
  const showCancelButton = requestStatus === 'pending' || requestStatus === 'scheduled';

  const getStatusTitle = () => {
    switch (requestStatus) {
      case 'pending':
        return '요청 상세 정보';
      case 'scheduled':
        return '청소 진행 예정 상세 정보';
      case 'in-progress':
        return '청소 진행 중 상세 정보';
      default:
        return '요청 상세 정보';
    }
  };

  return (
    <div>
      <DisplayH3 className="text-neutral-1000 mb-[25px]">{getStatusTitle()}</DisplayH3>
      <div className="rounded-[16px] bg-neutral-100 py-8 px-6 box-sizing: border-box border border-neutral-200 shadow-[0_3px_10px_0_rgba(0_0_0/0.2)] overflow-visible">
        {/* 헤더 */}
        <div className="flex flex-col gap-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-[219px] h-[219px] md:w-[112px] md:h-[112px] rounded-[16px] overflow-hidden bg-neutral-200 flex-shrink-0 self-center md:self-auto">
                <Image
                  src={imageUrl}
                  alt={title}
                  width={219}
                  height={219}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 w-full">
                <DisplayH4 className="text-neutral-1000">{title}</DisplayH4>
                <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex">
                      <BodySmall className="text-neutral-600">요청 일시: </BodySmall>
                      <BodySmall className="text-neutral-800 ml-1">{requestDateTime}</BodySmall>
                    </div>
                    {requestStatus === 'in-progress' && cleaningStartDateTime && (
                      <div className="flex">
                        <BodySmall className="text-neutral-600">청소 시작 시각: </BodySmall>
                        <BodySmall className="text-neutral-800 ml-1">
                          {cleaningStartDateTime}
                        </BodySmall>
                      </div>
                    )}
                    <div className="flex">
                      <BodySmall className="text-neutral-600">
                        청소 완료 날짜 및 희망 시각:{' '}
                      </BodySmall>
                      <BodySmall className="text-neutral-800 ml-1">{completionDateTime}</BodySmall>
                    </div>
                    <div className="flex">
                      <BodySmall className="text-neutral-600">선택 옵션: </BodySmall>
                      <BodySmall className="text-neutral-800 ml-1">{selectedOption}</BodySmall>
                    </div>
                  </div>
                  <div className="w-full md:w-[200px] self-end">
                    <Link
                      href={
                        requestStatus === 'pending'
                          ? `/mypage/request/cleaner-list/${requestId}`
                          : `/mypage/request/cleaner-list/${requestId}`
                      }
                    >
                      <Button onClick={onCheckCleaner} active className="h-[46px] w-full">
                        {requestStatus === 'pending'
                          ? '청소자 요청 목록 확인'
                          : '청소자 상세 정보 확인'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 청소 기본 규칙 */}
          <div className="flex flex-col gap-10">
            <div className="space-y-4">
              <TitleH4 className="text-neutral-1000">청소 기본 규칙</TitleH4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <BodyDefault className="text-neutral-800">청소 요청 트리거 시점</BodyDefault>
                  <TitleDefault className="text-neutral-1000">{triggerPoint}</TitleDefault>
                </div>
                <div className="flex items-center justify-between">
                  <BodyDefault className="text-neutral-800">요청 기간</BodyDefault>
                  <TitleDefault className="text-neutral-1000">{requestPeriod}</TitleDefault>
                </div>
                <div className="flex items-center justify-between">
                  <BodyDefault className="text-neutral-800">전화번호</BodyDefault>
                  <TitleDefault className="text-neutral-1000">{phoneNumber}</TitleDefault>
                </div>
                <div className="flex items-center justify-between">
                  <BodyDefault className="text-neutral-800">비상 연락처</BodyDefault>
                  <TitleDefault className="text-neutral-1000">{emergencyContact}</TitleDefault>
                </div>
              </div>
            </div>
            {/* 청소자 조건 필터 */}
            <div className="space-y-4">
              <TitleH4 className="text-neutral-1000">청소자 조건 필터</TitleH4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <BodyDefault className="text-neutral-800">최소 평점</BodyDefault>
                  <TitleDefault className="text-neutral-1000">{minimumRating}/5.0</TitleDefault>
                </div>
                <div className="flex items-center justify-between">
                  <BodyDefault className="text-neutral-800">최소 경력</BodyDefault>
                  <TitleDefault className="text-neutral-1000">{minimumExperience}</TitleDefault>
                </div>
              </div>
            </div>
            {/* 텍스트 메모 */}
            <div className="space-y-4">
              <TitleH4 className="text-neutral-1000">텍스트 메모</TitleH4>
              <TitleDefault className="text-neutral-800 whitespace-pre-wrap">{memo}</TitleDefault>
            </div>
            {/* 참고 사진 */}
            {referencePhotos && referencePhotos.length > 0 && (
              <div className="space-y-4">
                <TitleH4 className="text-neutral-1000">참고 사진</TitleH4>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                  {referencePhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[112px] h-[112px] rounded-[20px] overflow-hidden bg-neutral-200"
                    >
                      <Image
                        src={photo}
                        alt={`참고 사진 ${index + 1}`}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* 결제 예상 금액 */}
            <div className="space-y-4">
              <TitleH4 className="text-neutral-1000">결제 예상 금액</TitleH4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <BodyDefault className="text-neutral-600">기본 요금</BodyDefault>
                  <TitleDefault className="text-neutral-800">
                    {new Intl.NumberFormat('ko-KR').format(baseFee)} 원
                  </TitleDefault>
                </div>
                <div className="flex justify-between items-center">
                  <BodyDefault className="text-neutral-600">
                    플랫폼 수수료 ({platformFeeRate}%)
                  </BodyDefault>
                  <TitleDefault className="text-neutral-800">
                    {new Intl.NumberFormat('ko-KR').format(platformFee)} 원
                  </TitleDefault>
                </div>
                <div className="border-t border-neutral-300 pt-2">
                  <div className="flex justify-between items-center">
                    <BodyDefault className="text-neutral-1000">결제 예정 금액</BodyDefault>
                    <TitleH4 className="text-neutral-1000">
                      {new Intl.NumberFormat('ko-KR').format(baseFee + platformFee)}원
                    </TitleH4>
                  </div>
                </div>
              </div>
            </div>
            {/* 요청 취소하기 버튼 */}
            {showCancelButton && (
              <div className="pt-4 md:flex md:justify-end">
                <div className="w-full md:w-[151px]">
                  <Button onClick={onCancelRequest} variant="secondary" className="h-[46px] w-full">
                    요청 취소하기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
