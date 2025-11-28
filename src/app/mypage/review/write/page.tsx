'use client';

import { useRouter } from 'next/navigation';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import ReviewForm from '@/app/_components/organisms/ReviewForm';

export default function ReviewWritePage() {
  const router = useRouter();

  // TODO: api 연동 후 데이터 수정
  const mockCleanerInfo = {
    imageUrl: '/img/cleaner-male.png',
    name: '홍길동',
    gender: '남성',
    contact: '010-0000-0000',
    experience: '3개월 이상',
    rating: 4.3,
    introduction:
      '안녕하세요 홍길동입니다. 현재 청소 경력 5개월 차이며 약 50개의 에어비앤비 청소 경력이 있습니다. 맡겨주시면 최선을 다하겠습니다.',
  };

  const handleSubmit = (data: {
    ratings: {
      overall: number;
      cleanliness: number;
      punctuality: number;
      communication: number;
      reliability: number;
    };
    reviewText: string;
    photos: File[];
  }) => {
    // TODO: API 호출로 리뷰 제출
    console.log('리뷰 제출:', data);

    // 제출 후 리뷰 목록 페이지로 이동
    router.push('/mypage/review');
  };

  return (
    <RoomMainTemplate>
      <ReviewForm cleanerInfo={mockCleanerInfo} onSubmit={handleSubmit} />
    </RoomMainTemplate>
  );
}
