'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DisplayDefault, DisplayH3, DisplayLarge, TitleH4 } from '../atoms/Typography';
import CleaningRequestCard from '../molecules/card/CleaningRequestCard';
import EmptyIcon from '@/assets/svg/Search.svg';
import Button from '../atoms/Button';

type MainTab = 'ongoing' | 'past';
type SubTab = 'pending' | 'scheduled' | 'in-progress' | 'all' | 'completed' | 'canceled';

const MAIN_TABS: {
  id: MainTab;
  label: string;
}[] = [
  { id: 'ongoing', label: '진행중인 요청' },
  { id: 'past', label: '과거 요청 내역' },
];

const ONGOING_SUB_TABS: { id: SubTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'pending', label: '요청 대기 중' },
  { id: 'scheduled', label: '청소 진행 예정' },
  { id: 'in-progress', label: '청소 진행 중' },
];

const PAST_SUB_TABS: { id: SubTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'completed', label: '청소 완료' },
  { id: 'canceled', label: '요청 취소' },
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
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'canceled';
  cleaningStartDateTime?: string;
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
    completed: CleaningRequest[];
    canceled: CleaningRequest[];
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
  const [subTab, setSubTab] = useState<SubTab>('all');

  // 메인 탭 변경 시 서브 탭을 'all'로 리셋
  const handleMainTabChange = (tab: MainTab) => {
    setMainTab(tab);
    setSubTab('all');
  };

  // 탭에 따른 데이터 필터링
  const getFilteredRequests = (): CleaningRequest[] => {
    if (mainTab === 'past') {
      if (subTab === 'all') {
        return data.past.all;
      }
      if (subTab === 'completed') {
        return data.past.completed;
      }
      return data.past.canceled;
    }

    if (subTab === 'all') {
      return [...data.ongoing.pending, ...data.ongoing.scheduled, ...data.ongoing['in-progress']];
    }
    if (subTab === 'pending' || subTab === 'scheduled' || subTab === 'in-progress') {
      return data.ongoing[subTab];
    }
    return [];
  };

  const requests = getFilteredRequests();

  return (
    <div className="w-full h-full flex flex-col">
      <DisplayH3 className="text-neutral-1000 mb-2 md:mb-8 md:text-[28px] lg:text-[32px]">
        작업 요청 목록
      </DisplayH3>

      {/* 메인 탭 */}
      <div className="flex mb-4 border-b border-neutral-300">
        {MAIN_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleMainTabChange(tab.id)}
            className={`flex-1 md:flex-none w-full md:w-auto px-0 md:px-4 py-[14px] transition-colors relative md:text-[20px] whitespace-nowrap text-center justify-center ${
              mainTab === tab.id ? 'text-neutral-1000' : 'text-neutral-500'
            }`}
          >
            <DisplayLarge>{tab.label}</DisplayLarge>
            {mainTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 w-full h-[3px] bg-primary-400" />
            )}
          </button>
        ))}
      </div>

      {/* 서브 탭 */}
      {mainTab === 'ongoing' && (
        <div className="flex gap-4">
          {ONGOING_SUB_TABS.map(tab => (
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
      {mainTab === 'past' && (
        <div className="flex gap-4">
          {PAST_SUB_TABS.map(tab => (
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
      <div className="flex-1 space-y-6 pb-4 mt-6 md:mt-8">
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
              status={request.status}
              cleaningStartDateTime={request.cleaningStartDateTime}
              showStatusLabel={mainTab === 'ongoing' && subTab === 'all'}
              isPastRequest={mainTab === 'past'}
              onCheckCleaner={() => {
                console.log('청소자 정보 확인:', request.id);
              }}
              onClickDetail={() => {
                console.log('상세보기:', request.id);
              }}
              onWriteReview={() => {
                console.log('리뷰 작성:', request.id);
              }}
            />
          ))
        ) : (
          <div className="flex flex-col mt-2 md:mt-0 items-center justify-center text-center gap-4">
            <Image src={EmptyIcon} alt="EmptyIcon" />
            <TitleH4 className="text-neutral-1000">아직 요청하신 작업이 없어요</TitleH4>
            <Button variant="primary" active className="w-[151px]">
              청소 요청하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
