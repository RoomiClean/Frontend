'use client';

import { useEffect, useRef, useState } from 'react';
import { Calendar } from '@/app/_components/molecules/Calendar';
import CleaningRequestListSection, {
  CleaningRequestData,
} from '@/app/_components/organisms/CleaningRequestListSection';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import BottomSheet from '@/app/_components/atoms/BottomSheet';
import { usePreventMobileScroll } from '@/hooks/usePreventMobileScroll';

export default function CleaningRequestManagePage() {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [previewHeight, setPreviewHeight] = useState<number>(300);
  const [maxHeight, setMaxHeight] = useState<number>(600);
  const [isMounted, setIsMounted] = useState(false);

  const cleaningMockData: CleaningRequestData = {
    ongoing: {
      pending: [
        // {
        //   id: '1',
        //   imageUrl: '/img/sample-room.jpg',
        //   title: '외대 앞 에어비앤비 자동 청소',
        //   requestDateTime: '2025/10/31 18:29',
        //   completionDateTime: '2025/11/3 18:00',
        //   selectedOption: '청소만(기본 옵션)',
        //   status: 'pending',
        // },
        // {
        //   id: '2',
        //   imageUrl: '/img/sample-room.jpg',
        //   title: '경희대 앞 에어비앤비',
        //   requestDateTime: '2025/10/31 20:15',
        //   completionDateTime: '2025/11/4 14:00',
        //   selectedOption: '청소만(기본 옵션)',
        //   status: 'pending',
        // },
      ],
      scheduled: [
        {
          id: '3',
          imageUrl: '/img/sample-room.jpg',
          title: '신촌 오피스텔 청소',
          requestDateTime: '2025/11/1 09:30',
          completionDateTime: '2025/11/5 10:00',
          selectedOption: '청소 + 빨래(추가 옵션)',
          status: 'scheduled',
        },
        {
          id: '4',
          imageUrl: '/img/sample-room.jpg',
          title: '홍대 게스트하우스 청소',
          requestDateTime: '2025/11/1 14:20',
          completionDateTime: '2025/11/6 09:00',
          selectedOption: '청소만(기본 옵션)',
          status: 'scheduled',
        },
      ],
      'in-progress': [
        {
          id: '5',
          imageUrl: '/img/sample-room.jpg',
          title: '강남역 원룸 청소',
          requestDateTime: '2025/11/2 08:00',
          cleaningStartDateTime: '2025/11/3 13:29',
          completionDateTime: '2025/11/2 16:00',
          selectedOption: '청소 + 정리정돈(추가 옵션)',
          status: 'in-progress',
        },
      ],
    },
    past: {
      all: [
        // 데이터 없는 경우 UI 확인용 (주석 처리)
        // {
        //   id: '6',
        //   imageUrl: '/img/sample-room.jpg',
        //   title: '이태원 아파트 청소',
        //   requestDateTime: '2025/10/20 10:00',
        //   completionDateTime: '2025/10/21 15:00',
        //   selectedOption: '청소만(기본 옵션)',
        //   status: 'in-progress',
        // },
      ],
    },
  };

  const calendarMemos = [
    '외대 앞 에어비앤비 자동 청소 2025/11/12 18:00',
    '경희대 앞 에어비앤비 청소 완료',
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const calculateHeights = () => {
      if (calendarRef.current) {
        const calendarRect = calendarRef.current.getBoundingClientRect();
        const calendarBottom = calendarRect.bottom;
        const calendarTop = calendarRect.top;
        const windowHeight = window.innerHeight;

        // 캘린더 하단에서 24px 떨어진 위치까지의 초기 높이
        const preview = windowHeight - calendarBottom - 24;
        setPreviewHeight(preview > 0 ? preview : 100);

        // 완전히 올렸을 때: 캘린더 상단까지의 높이
        const max = windowHeight - calendarTop;
        setMaxHeight(max > 0 ? max : windowHeight * 0.9);
      }
    };

    calculateHeights();

    window.addEventListener('resize', calculateHeights);

    const timer = setTimeout(calculateHeights, 100);

    return () => {
      window.removeEventListener('resize', calculateHeights);
      clearTimeout(timer);
    };
  }, []);

  // 모바일, 태블릿에서 배경 스크롤 및 당겨서 새로고침하는 거 방지
  usePreventMobileScroll(1024);

  return (
    <RoomMainTemplate>
      <div className="flex flex-col lg:flex-row gap-12 w-full lg:overflow-auto overflow-hidden h-screen lg:h-auto touch-none lg:touch-auto">
        {/* 작업 요청 목록 */}
        <div className="hidden lg:block lg:w-[60%]">
          <CleaningRequestListSection data={cleaningMockData} />
        </div>

        {/* 캘린더 */}
        <div className="lg:w-[40%] flex flex-col gap-6 lg:pt-[98px]">
          <div ref={calendarRef}>
            <Calendar className="lg:min-h-[450px]" memos={calendarMemos} />
          </div>
        </div>
      </div>

      {isMounted && (
        <BottomSheet initialHeight={previewHeight} maxHeight={maxHeight}>
          <CleaningRequestListSection data={cleaningMockData} />
        </BottomSheet>
      )}
    </RoomMainTemplate>
  );
}
