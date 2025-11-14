import RoomMainTemplate from '../../_components/templates/RoomMainTemplate';
import RoomStatusSection from '../../_components/organisms/RoomStatSection';
import AccommodationListSection from '../../_components/organisms/RoomListSection';

export default function RoomMainPage() {
  const stats = { totalRooms: 3, needClean: 3, todayClean: 3 };
  // const stats = { totalRooms: 0, needClean: 0, todayClean: 0 };
  const items = [
    {
      id: '1',
      imageUrl: '/img/sample-room.jpg',
      title: '외대 앞 에어비앤비',
      address: '경기도 용인시 처인구 모현읍 외대로 54번길 9 글로벌타운 B동 306호',
      checkInText: '10월 25일 오후 3시',
      checkOutText: '10월 26일 오전 11시',
    },
    {
      id: '2',
      imageUrl: '/img/sample-room.jpg',
      title: '외대 앞 에어비앤비2',
      address: '경기도 용인시 처인구 모현읍 외대로 54번길 9 글로벌타운 B동 308호',
      checkInText: '10월 25일 오후 3시',
      checkOutText: '10월 26일 오전 11시',
    },
  ];
  // const items =[];

  return (
    <RoomMainTemplate>
      <RoomStatusSection
        totalRooms={stats.totalRooms}
        needClean={stats.needClean}
        todayClean={stats.todayClean}
      />
      <AccommodationListSection items={items} />
    </RoomMainTemplate>
  );
}
