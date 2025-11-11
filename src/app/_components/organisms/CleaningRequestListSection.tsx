'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BodyDefault,
  DisplayDefault,
  DisplayH2,
  DisplayH3,
  DisplayLarge,
} from '../atoms/Typography';
import CleaningRequestCard from '../molecules/CleaningRequestCard';
import EmptyIcon from '@/assets/svg/EmptyAccommodation.svg';

type MainTab = 'ongoing' | 'past';
type SubTab = 'pending' | 'scheduled' | 'in-progress';

const MAIN_TABS: {
  id: MainTab;
  label: string;
}[] = [
  { id: 'ongoing', label: '진행중인 요청' },
  { id: 'past', label: '과거 요청 내역' },
];

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: 'pending', label: '요청 대기 중' },
  { id: 'scheduled', label: '청소 진행 예정' },
  { id: 'in-progress', label: '청소 진행 중' },
];

/**
 * 청소 요청 인터페이스
 */
export interface CleaningRequest {
  id: string;
  imageUrl: string;
  title: string;
  requestDateTime: string;
  completionDateTime: string;
  selectedOption: string;
  status: 'pending' | 'scheduled' | 'in-progress';
}

/**
 * 청소 요청 데이터 타입
 * 서버 명세서에 따라 추후에 변경될 수 있음
 */
export interface CleaningRequestData {
  ongoing: {
    pending: CleaningRequest[];
    scheduled: CleaningRequest[];
    'in-progress': CleaningRequest[];
  };
  past: {
    all: CleaningRequest[];
  };
}

interface CleaningRequestListSectionProps {
  data: CleaningRequestData;
}

/**
 * 작업 요청 목록 섹션
 *
 * 진행중인 요청과 과거 요청을 탭으로 분류하여 보여주는 섹션
 */
export default function CleaningRequestListSection({ data }: CleaningRequestListSectionProps) {
  const [mainTab, setMainTab] = useState<MainTab>('ongoing');
  const [subTab, setSubTab] = useState<SubTab>('pending');

  // 탭에 따른 데이터 필터링
  const requests = mainTab === 'past' ? data.past.all : data.ongoing[subTab] || [];

  return (
    <div className="w-full h-full flex flex-col overflow-visible">
      <DisplayH3 className="text-neutral-1000 mb-2 md:mb-8 md:text-[28px] lg:text-[32px]">
        작업 요청 목록
      </DisplayH3>

      {/* 메인 탭 */}
      <div className="flex mb-4 border-b border-neutral-300 overflow-x-auto scrollbar-hide">
        {MAIN_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setMainTab(tab.id)}
            className={`px-4 py-[14px] transition-colors relative md:text-[20px] whitespace-nowrap ${
              mainTab === tab.id ? 'text-neutral-1000' : 'text-neutral-500'
            }`}
          >
            <DisplayLarge>{tab.label}</DisplayLarge>
            {mainTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-400" />
            )}
          </button>
        ))}
      </div>

      {/* 서브 탭 (진행중인 요청일 때만 표시) */}
      {mainTab === 'ongoing' && (
        <div className="flex gap-4 mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
          {SUB_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`whitespace-nowrap transition-colors md:text-[16px] ${
                subTab === tab.id ? 'text-primary-400' : 'text-neutral-500'
              }`}
            >
              <DisplayDefault>{tab.label}</DisplayDefault>
            </button>
          ))}
        </div>
      )}

      {/* 요청 카드 리스트 */}
      <div className="flex-1 space-y-6 scrollbar-hide overflow-y-auto p-1">
        {requests.length > 0 ? (
          requests.map(request => (
            <CleaningRequestCard
              key={request.id}
              id={request.id}
              imageUrl={request.imageUrl}
              title={request.title}
              requestDateTime={request.requestDateTime}
              completionDateTime={request.completionDateTime}
              selectedOption={request.selectedOption}
              onCheckCleaner={() => {
                console.log('청소자 정보 확인:', request.id);
              }}
              onClickDetail={() => {
                console.log('상세보기:', request.id);
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center pt-5 h-full">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <Image src={EmptyIcon} alt="EmptyIcon" />
              <DisplayH2 className="text-neutral-1000 md:text-[32px]">
                요청 내역이 없습니다
              </DisplayH2>
              <BodyDefault className="text-neutral-800 md:text-[18px]">
                현재 진행중인 청소 요청이 없습니다
              </BodyDefault>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
