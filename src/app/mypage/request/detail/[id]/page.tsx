'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import RequestDetailSection from '@/app/_components/organisms/RequestDetailSection';

/**
 * 요청 상세 페이지
 *
 * 상태에 따라 다른 정보를 표시합니다.
 * - pending: 요청 대기 중
 * - scheduled: 청소 진행 예정
 * - in-progress: 청소 진행 중
 */
export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const statusParam = (searchParams.get('requestStatus') || 'pending') as
    | 'pending'
    | 'scheduled'
    | 'in-progress';

  const mockRequestData = {
    id: id || '1',
    imageUrl: '/img/sample-room.jpg',
    title: '외대 앞 에어비앤비 자동 청소',
    requestDateTime: '2025/10/31 18:29',
    cleaningStartDateTime: '2025/10/31 18:29', // in-progress일 때만 표시
    completionDateTime: '2025/11/3 18:00',
    selectedOption: '청소만(기본 옵션)',
    requestStatus: statusParam as 'pending' | 'scheduled' | 'in-progress',
    triggerPoint: '체크아웃 즉시',
    requestPeriod: '2025/11/1 ~ 2025/12/1',
    phoneNumber: '010-0000-0000',
    emergencyContact: '010-0000-0000',
    minimumRating: 4.0,
    minimumExperience: '3개월 이상',
    memo: `외대 앞 에어비앤비입니다. 학생들이 많이 사용하므로 청결한 분위기를 유지해야 합니다. 현관부터 전체적으로 청소해주시면 됩니다. 정확한 주소는 다음과 같으며, 잘 부탁드립니다.`,
    referencePhotos: [
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
      '/img/sample-room.jpg',
    ],
    baseFee: 50000,
    platformFee: 7500,
    platformFeeRate: 15,
  };

  // const { data, isLoading, error } = useRequestDetail(id);

  const handleCheckCleaner = () => {
    console.log('청소자 정보 확인:', id);
  };

  const handleCancelRequest = () => {
    console.log('요청 취소:', id);
    // 취소 성공 시 목록 페이지로 이동
    router.push('/mypage/request');
  };

  return (
    <RoomMainTemplate>
      <RequestDetailSection
        imageUrl={mockRequestData.imageUrl}
        title={mockRequestData.title}
        requestDateTime={mockRequestData.requestDateTime}
        cleaningStartDateTime={
          mockRequestData.requestStatus === 'in-progress'
            ? mockRequestData.cleaningStartDateTime
            : undefined
        }
        completionDateTime={mockRequestData.completionDateTime}
        selectedOption={mockRequestData.selectedOption}
        requestStatus={mockRequestData.requestStatus}
        requestId={mockRequestData.id}
        triggerPoint={mockRequestData.triggerPoint}
        requestPeriod={mockRequestData.requestPeriod}
        phoneNumber={mockRequestData.phoneNumber}
        emergencyContact={mockRequestData.emergencyContact}
        minimumRating={mockRequestData.minimumRating}
        minimumExperience={mockRequestData.minimumExperience}
        memo={mockRequestData.memo}
        referencePhotos={mockRequestData.referencePhotos}
        baseFee={mockRequestData.baseFee}
        platformFee={mockRequestData.platformFee}
        platformFeeRate={mockRequestData.platformFeeRate}
        onCheckCleaner={handleCheckCleaner}
        onCancelRequest={handleCancelRequest}
      />
    </RoomMainTemplate>
  );
}
