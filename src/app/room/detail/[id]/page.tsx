'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import Button from '@/app/_components/atoms/Button';
import { DisplayH3, BodyDefault, DisplayDefault } from '@/app/_components/atoms/Typography';
import ImageCard from '@/app/_components/molecules/ImageCard';
import AccommodationInfo from '@/app/_components/molecules/AccommodationInfo';
import { Calendar, CalendarMarkerNotes } from '@/app/_components/molecules/Calendar';
import EditIcon from '@/assets/svg/Pencil.svg';

const mockRoomData = {
  id: '1',
  businessVerificationId: 'BV123456',
  name: '외대 앞 에어비앤비',
  address: '경기도 용인시 처인구 모현읍 외대로 54번길 9',
  detailedAddress: '글로벌타운 B동 306호',
  accessMethod: '중앙현관 출입 비밀번호: #2012#',
  accommodationType: 'ETC',
  areaPyeong: 18,
  roomCount: 3,
  bedCount: 3,
  livingRoomCount: 3,
  bathroomCount: 3,
  maxOccupancy: 5,
  supplyStorageLocation: '현관문 우측 서랍장 내부',
  trashLocation: '1층 현관 앞 분리수거 장소',
  recycleLocation: '1층 현관 앞 분리수거 장소',
  cleaningNotes: '청소할 때 시끄럽게 하면 아래 층에서 신고해요;',
  lastCleanedAt: '2025-10-05T00:00:00.000Z',
  photos: [
    { id: 'photo-1', photoUrl: '/img/sample-room.jpg', displayOrder: 0 },
    { id: 'photo-2', photoUrl: '/img/sample-room.jpg', displayOrder: 1 },
    { id: 'photo-3', photoUrl: '/img/sample-room.jpg', displayOrder: 2 },
    { id: 'photo-4', photoUrl: '/img/sample-room.jpg', displayOrder: 3 },
    { id: 'photo-5', photoUrl: '/img/sample-room.jpg', displayOrder: 4 },
  ],
  createdAt: '2025-11-07T13:41:14.748Z',
};

const mockAccommodationSchedules = [{ startDate: '2025-10-07', endDate: '2025-10-11' }];
const mockReservedCleaningSchedules = [{ date: '2025-10-12' }, { date: '2025-10-22' }];

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const handleEdit = () => router.push(`/room/edit/${id}`);

  const lastCleaningSchedule = mockRoomData.lastCleanedAt
    ? { date: new Date(mockRoomData.lastCleanedAt) }
    : undefined;

  const infoRef = useRef<HTMLDivElement>(null);
  const [infoHeight, setInfoHeight] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    /**
     * 높이 측정 및 업데이트 함수
     * requestAnimationFrame을 사용하여 다음 렌더링 사이클에 높이 측정
     */
    const updateHeight = () => {
      // 이전 RAF가 아직 실행 대기 중이면 취소 (불필요한 중복 호출 방지)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // 브라우저의 다음 repaint 전에 높이 측정
      rafRef.current = requestAnimationFrame(() => {
        if (infoRef.current) {
          const height = infoRef.current.offsetHeight;
          setInfoHeight(height);
        }
      });
    };

    // 초기 높이 설정
    updateHeight();

    // 윈도우 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', updateHeight);

    // ResizeObserver로 요소 자체의 크기 변화 감지
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (infoRef.current) {
      resizeObserver.observe(infoRef.current);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <RoomMainTemplate showSidebar={false}>
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <DisplayH3 className="text-neutral-1000 mb-1 md:text-[28px] lg:text-[32px]">
              {mockRoomData.name}
            </DisplayH3>
            <BodyDefault className="text-neutral-800">
              {mockRoomData.address} {mockRoomData.detailedAddress}
            </BodyDefault>
          </div>

          <div className="hidden w-full md:w-auto md:flex-shrink-0">
            <Button
              onClick={handleEdit}
              variant="primary"
              className="h-[46px] flex items-center justify-center gap-2 px-6"
            >
              <DisplayDefault className="text-primary-300">정보 수정하기</DisplayDefault>
              <Image src={EditIcon} alt="수정" />
            </Button>
          </div>
        </div>
      </div>

      {/* 이미지 */}
      <div className="mb-8">
        <ImageCard photos={mockRoomData.photos} />
      </div>

      {/* 정보 + 캘린더 */}
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:items-start">
        {/* 숙소 정보 컬럼 */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <DisplayH3 className="text-neutral-1000">숙소 정보</DisplayH3>
          <div ref={infoRef}>
            <AccommodationInfo
              accommodationType={mockRoomData.accommodationType}
              accessMethod={mockRoomData.accessMethod}
              roomCount={mockRoomData.roomCount}
              bedCount={mockRoomData.bedCount}
              livingRoomCount={mockRoomData.livingRoomCount}
              bathroomCount={mockRoomData.bathroomCount}
              areaPyeong={mockRoomData.areaPyeong}
              maxOccupancy={mockRoomData.maxOccupancy}
              supplyStorageLocation={mockRoomData.supplyStorageLocation}
              trashLocation={mockRoomData.trashLocation}
              cleaningNotes={mockRoomData.cleaningNotes}
            />
          </div>
        </div>

        {/* 캘린더 컬럼 */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <DisplayH3 className="text-neutral-1000">일정 정보</DisplayH3>
            <Link href="#">
              <BodyDefault className="text-primary-400">iCal 캘린더 연동하기 →</BodyDefault>
            </Link>
          </div>
          <div
            className="transition-all duration-300 rounded-[20px] shadow-[0_6px_15px_0_rgba(0,0,0,0.1)]"
            style={{
              height: infoHeight ? `${infoHeight}px` : 'auto',
              overflow: 'hidden',
            }}
          >
            <Calendar
              accommodationSchedules={mockAccommodationSchedules}
              lastCleaningSchedule={lastCleaningSchedule}
              reservedCleaningSchedules={mockReservedCleaningSchedules}
              initialYear={2025}
              initialMonth={10}
            />
          </div>
          <CalendarMarkerNotes />
        </div>
      </div>
      <div className="w-full md:hidden">
        <Button
          onClick={handleEdit}
          variant="primary"
          className="h-[46px] flex items-center justify-center gap-2 px-6"
        >
          <DisplayDefault className="text-primary-300">정보 수정하기</DisplayDefault>
          <Image src={EditIcon} alt="수정" />
        </Button>
      </div>
    </RoomMainTemplate>
  );
}
