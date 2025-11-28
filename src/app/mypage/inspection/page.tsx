'use client';

import { Calendar } from '@/app/_components/molecules/Calendar';
import InspectionWaitingListSection, {
  InspectionData,
} from '@/app/_components/organisms/InspectionWaitingListSection';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import BottomSheet from '@/app/_components/atoms/BottomSheet';
import { usePreventMobileScroll } from '@/hooks/usePreventMobileScroll';
import { useCalendarHeights } from '@/hooks/useCalendarHeights';

export default function InspectionWaitingPage() {
  const { calendarRef, previewHeight, maxHeight, isMounted } = useCalendarHeights();

  const inspectionMockData: InspectionData = {
    request: [
      {
        inspectionId: '01HQXYZ123',
        accommodationName: '외대 앞 에어비앤비 자동 청소',
        accommodationImageUrl: '/img/sample-room.jpg',
        requestedDatetime: '2025-10-31T18:29:00.000Z',
        completedAt: '2025-11-03T18:00:00.000Z',
        options: 'BASIC',
        elapsedTime: {
          hours: 0,
          minutes: 30,
          formatted: '30분',
        },
      },
      {
        inspectionId: '01HQXYZ124',
        accommodationName: '경희대 앞 에어비앤비',
        accommodationImageUrl: '/img/sample-room.jpg',
        requestedDatetime: '2025-10-31T20:15:00.000Z',
        completedAt: '2025-11-04T14:00:00.000Z',
        options: 'BASIC',
        elapsedTime: {
          hours: 2,
          minutes: 30,
          formatted: '2시간 30분',
        },
      },
    ],
    settlement: [
      {
        inspectionId: '01HQXYZ125',
        accommodationName: '신촌 오피스텔 청소',
        accommodationImageUrl: '/img/sample-room.jpg',
        requestedDatetime: '2025-11-01T09:30:00.000Z',
        completedAt: '2025-11-05T10:00:00.000Z',
        options: 'WITH_LAUNDRY',
      },
    ],
  };

  const calendarMemos = [
    '외대 앞 에어비앤비 자동 청소 요청 일자',
    '경희대 앞 에어비앤비 청소 완료',
  ];

  usePreventMobileScroll(1024);

  return (
    <RoomMainTemplate>
      <div className="flex flex-col lg:flex-row gap-12 w-full h-screen lg:h-auto touch-none lg:touch-auto">
        {/* 검수 대기 목록 */}
        <div className="hidden lg:block lg:w-[60%]">
          <InspectionWaitingListSection data={inspectionMockData} />
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
          <InspectionWaitingListSection data={inspectionMockData} />
        </BottomSheet>
      )}
    </RoomMainTemplate>
  );
}
