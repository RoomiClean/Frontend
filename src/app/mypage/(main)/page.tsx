'use client';

import RoomMainTemplate from '../../_components/templates/RoomMainTemplate';
import RoomStatusSection from '../../_components/organisms/RoomStatSection';
import AccommodationListSection from '../../_components/organisms/RoomListSection';
import { useGetAccommodations } from '../../_lib/queries';
import { formatCheckInOutDateTime } from '@/utils/dateTime.utils';
import type { AccommodationListItem } from '../../_lib/types/accommodation.types';

export default function RoomMainPage() {
  const { data, isLoading, error } = useGetAccommodations();

  if (isLoading) {
    return (
      <RoomMainTemplate>
        <div className="flex items-center justify-center py-20">
          <p className="text-neutral-600">로딩 중...</p>
        </div>
      </RoomMainTemplate>
    );
  }

  if (error || !data || !data.success) {
    return (
      <RoomMainTemplate>
        <div className="flex items-center justify-center py-20">
          <p className="text-red-500">데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </RoomMainTemplate>
    );
  }

  const statistics = data.data.statistics || {
    totalCount: 0,
    cleaningNeededCount: 0,
    todayCleaningScheduledCount: 0,
  };

  const accommodations: AccommodationListItem[] = data.data.accommodations || [];

  const items = accommodations.map((accommodation: AccommodationListItem) => ({
    id: accommodation.id,
    imageUrl: accommodation.photos?.[0]?.photoUrl || '/img/sample-room.jpg',
    title: accommodation.name,
    address: accommodation.address,
    detailedAddress: accommodation.detailedAddress,
    checkInText: accommodation.nextCheckin
      ? formatCheckInOutDateTime(accommodation.nextCheckin)
      : '일정 없음',
    checkOutText: accommodation.nextCheckout
      ? formatCheckInOutDateTime(accommodation.nextCheckout)
      : '일정 없음',
  }));

  return (
    <RoomMainTemplate>
      <RoomStatusSection
        totalRooms={statistics.totalCount}
        needClean={statistics.cleaningNeededCount}
        todayClean={statistics.todayCleaningScheduledCount}
      />
      <AccommodationListSection items={items} />
    </RoomMainTemplate>
  );
}
