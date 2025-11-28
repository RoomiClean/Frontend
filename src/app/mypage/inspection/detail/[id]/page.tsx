'use client';

import { useParams, useRouter } from 'next/navigation';
import InspectionDetailSection from '@/app/_components/organisms/InspectionDetailSection';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import { CLEANING_TYPE_LABELS } from '@/constants/business.constants';

export default function InspectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inspectionId = params.id as string;

  // TODO: 실제 API 호출로 대체
  // 현재는 목업 데이터 사용
  const mockData = {
    inspectionId: inspectionId || '01HQXYZ123',
    accommodationName: '외대 앞 에어비앤비 자동 청소',
    accommodationImageUrl: '/img/sample-room.jpg',
    requestedDatetime: '2025-10-31T18:29:00.000Z',
    cleaningStartDateTime: '2025-10-31T18:29:00.000Z',
    completedAt: '2025-11-03T18:00:00.000Z',
    options: 'BASIC' as const,
    elapsedTime: '8시간 30분',
    beforeCleaningPhotos: [
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
    ],
    afterCleaningPhotos: [
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
    ],
    specialNotes: '러그에 얼룩이 묻어있었습니다. 해당 부분 인지하면 좋을 것 같습니다.',
    specialNotesPhotos: [
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
    ],
    baseFee: 50000,
    platformFee: 7500,
    platformFeeRate: 15,
  };

  const handleApprove = () => {
    // TODO: 승인 API 호출
    console.log('승인하기:', inspectionId);
    // 승인 후 검수 대기 목록으로 이동
    router.push('/mypage/inspection');
  };

  const handleRequestRework = () => {
    // TODO: 재작업 요청 API 호출
    console.log('재작업 요청하기:', inspectionId);
    // 재작업 요청 후 검수 대기 목록으로 이동
    router.push('/mypage/inspection');
  };

  return (
    <RoomMainTemplate>
      <InspectionDetailSection
        accommodationName={mockData.accommodationName}
        accommodationImageUrl={mockData.accommodationImageUrl}
        elapsedTime={mockData.elapsedTime}
        requestedDatetime={mockData.requestedDatetime}
        cleaningStartDateTime={mockData.cleaningStartDateTime}
        completedAt={mockData.completedAt}
        selectedOption={CLEANING_TYPE_LABELS[mockData.options] || mockData.options}
        beforeCleaningPhotos={mockData.beforeCleaningPhotos}
        afterCleaningPhotos={mockData.afterCleaningPhotos}
        specialNotes={mockData.specialNotes}
        specialNotesPhotos={mockData.specialNotesPhotos}
        baseFee={mockData.baseFee}
        platformFee={mockData.platformFee}
        platformFeeRate={mockData.platformFeeRate}
        onApprove={handleApprove}
        onRequestRework={handleRequestRework}
      />
    </RoomMainTemplate>
  );
}
