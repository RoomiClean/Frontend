'use client';

import Image from 'next/image';
import Button from '../atoms/Button';
import {
  DisplayH3,
  DisplayH4,
  BodySmall,
  BodyDefault,
  TitleH4,
  TitleDefault,
  TitleSmall,
} from '../atoms/Typography';
import { formatDateTime } from '@/utils/dateTime.utils';

interface InspectionDetailSectionProps {
  // 헤더 정보
  accommodationName: string;
  accommodationImageUrl: string;
  elapsedTime: string; // 예: "8시간 30분"
  // 청소 요청 정보
  requestedDatetime: string;
  cleaningStartDateTime: string;
  completedAt: string;
  selectedOption: string;
  // 사진
  beforeCleaningPhotos: string[];
  afterCleaningPhotos: string[];
  // 특이사항
  specialNotes?: string;
  specialNotesPhotos?: string[];
  // 결제 정보
  baseFee: number;
  platformFee: number;
  platformFeeRate: number;
  // 이벤트 핸들러
  onApprove?: () => void;
  onRequestRework?: () => void;
}

/**
 * 청소 상태 검수 상세 섹션 컴포넌트
 *
 * 청소 완료 후 검수하는 페이지에서 사용
 */
export default function InspectionDetailSection({
  accommodationName,
  accommodationImageUrl,
  elapsedTime,
  requestedDatetime,
  cleaningStartDateTime,
  completedAt,
  selectedOption,
  beforeCleaningPhotos,
  afterCleaningPhotos,
  specialNotes,
  specialNotesPhotos,
  baseFee,
  platformFee,
  platformFeeRate,
  onApprove,
  onRequestRework,
}: InspectionDetailSectionProps) {
  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6">
        <DisplayH3 className="text-neutral-1000 mb-2">청소 상태 검수</DisplayH3>
        <div className="flex items-center">
          <TitleSmall className="text-neutral-600">청소 완료 후 </TitleSmall>
          <TitleSmall className="text-red-200 ml-1">{elapsedTime}</TitleSmall>
          <TitleSmall className="text-neutral-600 ml-1">경과</TitleSmall>
        </div>
      </div>

      <div className="rounded-[16px] bg-neutral-100 py-8 px-6 box-sizing: border-box border border-neutral-200 shadow-[0_3px_10px_0_rgba(0_0_0/0.2)] overflow-visible">
        <div className="flex flex-col gap-8">
          {/* 청소 요청 상세 정보 */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-[219px] h-[219px] md:w-[112px] md:h-[112px] rounded-[16px] overflow-hidden bg-neutral-200 flex-shrink-0 self-center md:self-auto">
                <Image
                  src={accommodationImageUrl}
                  alt={accommodationName}
                  width={219}
                  height={219}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 w-full">
                <DisplayH4 className="text-neutral-1000">{accommodationName}</DisplayH4>
                <div className="mt-4 flex flex-col gap-1">
                  <div className="flex">
                    <BodySmall className="text-neutral-600">요청 일시: </BodySmall>
                    <BodySmall className="text-neutral-800 ml-1">
                      {formatDateTime(requestedDatetime)}
                    </BodySmall>
                  </div>
                  <div className="flex">
                    <BodySmall className="text-neutral-600">청소 시작 시각: </BodySmall>
                    <BodySmall className="text-neutral-800 ml-1">
                      {formatDateTime(cleaningStartDateTime)}
                    </BodySmall>
                  </div>
                  <div className="flex">
                    <BodySmall className="text-neutral-600">
                      청소 완료 날짜 및 희망 시각:{' '}
                    </BodySmall>
                    <BodySmall className="text-neutral-800 ml-1">
                      {formatDateTime(completedAt)}
                    </BodySmall>
                  </div>
                  <div className="flex">
                    <BodySmall className="text-neutral-600">선택 옵션: </BodySmall>
                    <BodySmall className="text-neutral-800 ml-1">{selectedOption}</BodySmall>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 청소 시작 전/후 업로드 사진 - 좌우 배치 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* 청소 시작 전 업로드 사진 */}
            <div className="flex-1 space-y-4 min-w-0">
              <TitleH4 className="text-neutral-1000">청소 시작 전 업로드 사진</TitleH4>
              {beforeCleaningPhotos && beforeCleaningPhotos.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto scrollbar-hide w-full">
                  {beforeCleaningPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[112px] h-[112px] rounded-[20px] overflow-hidden bg-neutral-200"
                    >
                      <Image
                        src={photo}
                        alt={`청소 시작 전 사진 ${index + 1}`}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[112px]" />
              )}
            </div>

            {/* 청소 완료 후 업로드 사진 */}
            <div className="flex-1 space-y-4 min-w-0">
              <TitleH4 className="text-neutral-1000">청소 완료 후 업로드 사진</TitleH4>
              {afterCleaningPhotos && afterCleaningPhotos.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto scrollbar-hide w-full">
                  {afterCleaningPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[112px] h-[112px] rounded-[20px] overflow-hidden bg-neutral-200"
                    >
                      <Image
                        src={photo}
                        alt={`청소 완료 후 사진 ${index + 1}`}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[112px]" />
              )}
            </div>
          </div>

          {/* 작업 중 특이사항 및 증빙 사진 - 좌우 배치 */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* 작업 중 특이사항 */}
            <div className="flex-1 space-y-4 min-w-0">
              <TitleH4 className="text-neutral-1000">작업 중 특이사항</TitleH4>
              {specialNotes ? (
                <TitleDefault className="text-neutral-800 whitespace-pre-wrap">
                  {specialNotes}
                </TitleDefault>
              ) : (
                <div className="h-[60px]" />
              )}
            </div>

            {/* 특이사항 증빙 사진 */}
            <div className="flex-1 space-y-4 min-w-0">
              <TitleH4 className="text-neutral-1000">특이사항 증빙 사진</TitleH4>
              {specialNotesPhotos && specialNotesPhotos.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto scrollbar-hide w-full">
                  {specialNotesPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[112px] h-[112px] rounded-[20px] overflow-hidden bg-neutral-200"
                    >
                      <Image
                        src={photo}
                        alt={`특이사항 증빙 사진 ${index + 1}`}
                        width={112}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[112px]" />
              )}
            </div>
          </div>

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

          {/* 액션 버튼 */}
          <div className="pt-4 flex flex-col md:flex-row gap-4 md:justify-end">
            <div className="w-full md:w-[151px]">
              <Button onClick={onRequestRework} variant="secondary" className="h-[46px] w-full">
                재작업 요청하기
              </Button>
            </div>
            <div className="w-full md:w-[151px]">
              <Button onClick={onApprove} active className="h-[46px] w-full">
                승인하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
