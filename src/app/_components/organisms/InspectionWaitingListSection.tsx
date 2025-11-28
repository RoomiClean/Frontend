'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DisplayDefault, DisplayH3, TitleH4 } from '../atoms/Typography';
import CleaningRequestCard from '../molecules/card/CleaningRequestCard';
import EmptyIcon from '@/assets/svg/Search.svg';
import { CLEANING_TYPE_LABELS } from '@/constants/business.constants';
import { formatDateTime } from '@/utils/dateTime.utils';

interface ElapsedTime {
  hours: number;
  minutes: number;
  formatted: string;
}

interface InspectionItem {
  inspectionId: string;
  accommodationName: string;
  accommodationImageUrl: string;
  requestedDatetime: string;
  completedAt: string;
  options: 'BASIC' | 'WITH_LAUNDRY';
  elapsedTime?: ElapsedTime;
}

export interface InspectionData {
  request: InspectionItem[]; // 검수 요청
  settlement: InspectionItem[]; // 검수 완료 & 정산 대기
}

type InspectionTab = 'request' | 'settlement';

const INSPECTION_TABS: {
  id: InspectionTab;
  label: string;
}[] = [
  { id: 'request', label: '검수 요청' },
  { id: 'settlement', label: '검수 완료 & 정산 대기' },
];

interface InspectionWaitingListSectionProps {
  data: InspectionData;
}

export default function InspectionWaitingListSection({ data }: InspectionWaitingListSectionProps) {
  const [tab, setTab] = useState<InspectionTab>('request');

  // 탭에 따른 데이터 필터링
  const getFilteredRequests = (): InspectionItem[] => {
    if (tab === 'request') {
      return data.request;
    } else {
      return data.settlement;
    }
  };

  const requests = getFilteredRequests();

  return (
    <div className="w-full h-full flex flex-col">
      <DisplayH3 className="text-neutral-1000 mb-2 md:mb-8 md:text-[28px] lg:text-[32px]">
        검수 대기 목록
      </DisplayH3>

      {/* 탭 */}
      <div className="flex border-b border-neutral-300">
        {INSPECTION_TABS.map(inspectionTab => (
          <button
            key={inspectionTab.id}
            onClick={() => setTab(inspectionTab.id)}
            className={`flex-1 md:flex-none w-full md:w-auto px-0 md:px-4 py-[14px] transition-colors relative md:text-[20px] whitespace-nowrap text-center justify-center ${
              tab === inspectionTab.id ? 'text-neutral-1000' : 'text-neutral-500'
            }`}
          >
            <DisplayDefault>{inspectionTab.label}</DisplayDefault>
            {tab === inspectionTab.id && (
              <div className="absolute bottom-0 left-0 right-0 w-full h-[3px] bg-primary-400" />
            )}
          </button>
        ))}
      </div>

      {/* 요청 카드 리스트 */}
      <div className="flex-1 space-y-6 pb-4 mt-6 md:mt-8 -mx-4 px-4">
        {requests.length > 0 ? (
          requests.map(item => (
            <CleaningRequestCard
              key={item.inspectionId}
              id={item.inspectionId}
              imageUrl={item.accommodationImageUrl}
              title={item.accommodationName}
              requestDateTime={formatDateTime(item.requestedDatetime)}
              completionDateTime={formatDateTime(item.completedAt)}
              selectedOption={CLEANING_TYPE_LABELS[item.options] || item.options}
              requestStatus="completed"
              isInspectionMode={true}
              elapsedTime={
                tab === 'request' && item.elapsedTime ? item.elapsedTime.formatted : undefined
              }
              onInspect={() => {
                console.log('청소 상태 검수:', item.inspectionId);
              }}
            />
          ))
        ) : (
          <div className="flex flex-col mt-2 md:mt-0 items-center justify-center text-center gap-4">
            <Image src={EmptyIcon} alt="EmptyIcon" />
            <TitleH4 className="text-neutral-1000">아직 검수 대기 항목이 없어요</TitleH4>
          </div>
        )}
      </div>
    </div>
  );
}
