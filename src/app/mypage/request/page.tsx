'use client';

import { Calendar } from '@/app/_components/molecules/Calendar';
import CleaningRequestListSection, {
  CleaningRequestData,
} from '@/app/_components/organisms/CleaningRequestListSection';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import BottomSheet from '@/app/_components/atoms/BottomSheet';
import { usePreventMobileScroll } from '@/hooks/usePreventMobileScroll';
import { useCalendarHeights } from '@/hooks/useCalendarHeights';

export default function CleaningRequestManagePage() {
  const { calendarRef, previewHeight, maxHeight, isMounted } = useCalendarHeights();

  const cleaningMockData: CleaningRequestData = {
    ongoing: {
      pending: [
        {
          id: '1',
          imageUrl: '/img/sample-room.jpg',
          title: '외대 앞 에어비앤비 자동 청소',
          requestDateTime: '2025/10/31 18:29',
          completionDateTime: '2025/11/3 18:00',
          selectedOption: '청소만(기본 옵션)',
          requestStatus: 'pending',
        },
        {
          id: '2',
          imageUrl: '/img/sample-room.jpg',
          title: '경희대 앞 에어비앤비',
          requestDateTime: '2025/10/31 20:15',
          completionDateTime: '2025/11/4 14:00',
          selectedOption: '청소만(기본 옵션)',
          requestStatus: 'pending',
        },
      ],
      scheduled: [
        {
          id: '3',
          imageUrl: '/img/sample-room.jpg',
          title: '신촌 오피스텔 청소',
          requestDateTime: '2025/11/1 09:30',
          completionDateTime: '2025/11/5 10:00',
          selectedOption: '청소 + 빨래(추가 옵션)',
          requestStatus: 'scheduled',
        },
        {
          id: '4',
          imageUrl: '/img/sample-room.jpg',
          title: '홍대 게스트하우스 청소',
          requestDateTime: '2025/11/1 14:20',
          completionDateTime: '2025/11/6 09:00',
          selectedOption: '청소만(기본 옵션)',
          requestStatus: 'scheduled',
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
          requestStatus: 'in-progress',
        },
      ],
    },
    past: {
      all: [
        {
          id: '6',
          imageUrl: '/img/sample-room.jpg',
          title: '외대 앞 에어비앤비 자동 청소',
          requestDateTime: '2025/10/31 18:29',
          cleaningStartDateTime: '2025/11/3 13:29',
          completionDateTime: '2025/11/3 18:00',
          selectedOption: '청소만(기본 옵션)',
          requestStatus: 'completed',
        },
        {
          id: '7',
          imageUrl: '/img/sample-room.jpg',
          title: '외대 앞 에어비앤비 자동 청소',
          requestDateTime: '2025/10/31 18:29',
          cleaningStartDateTime: '2025/11/3 13:29',
          completionDateTime: '2025/11/3 18:00',
          selectedOption: '청소만(기본 옵션)',
          requestStatus: 'canceled',
        },
      ],
      completed: [
        {
          id: '6',
          imageUrl: '/img/sample-room.jpg',
          title: '외대 앞 에어비앤비 자동 청소',
          requestDateTime: '2025/10/31 18:29',
          cleaningStartDateTime: '2025/11/3 13:29',
          completionDateTime: '2025/11/3 18:00',
          selectedOption: '청소만(기본 옵션)',
          requestStatus: 'completed',
        },
      ],
      canceled: [
        {
          id: '7',
          imageUrl: '/img/sample-room.jpg',
          title: '외대 앞 에어비앤비 자동 청소',
          requestDateTime: '2025/10/31 18:29',
          cleaningStartDateTime: '2025/11/3 13:29',
          completionDateTime: '2025/11/3 18:00',
          selectedOption: '청소만(기본 옵션)',
          requestStatus: 'canceled',
        },
      ],
    },
  };

  const calendarMemos = [
    '외대 앞 에어비앤비 자동 청소 2025/11/12 18:00',
    '경희대 앞 에어비앤비 청소 완료',
  ];

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
