'use client';

import { useState } from 'react';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import { TitleH3 } from '@/app/_components/atoms/Typography';
import CleanerDetailInfoCard from '@/app/_components/molecules/card/CleanerDetailInfoCard';
import CleanerReviewsSection from '@/app/_components/organisms/CleanerReviewsSection';
import { ReviewCardProps } from '@/app/_components/molecules/card/ReviewCard';

export default function CleanerListDetailPage() {
  const mockData = {
    accepted: false,
    cleaner: {
      name: '홍길동',
      gender: '남성',
      phone: '010-0000-0000',
      experienceText: '3개월 이상',
      ratingText: '4.3/5.0',
      intro:
        '안녕하세요 홍길동입니다. 현재 청소 경력 5개월 차이며 약 50개의 에어비앤비 청소 경력이 있습니다. 맡겨주시면 최선을 다하겠습니다.',
      profileImage: '/img/cleaner-male.png',
    },
    averageRating: '4.2',
    totalReviews: 4,
    reviews: [
      {
        id: 'r1',
        host: '경희대 앞 에어비앤비 호스트',
        date: '2025-01-16',
        comment: '청소 너무 만족스럽습니다. 특히 화장실과 주방이 정말 깨끗하게 청소되었어요.',
        photos: ['/img/sample-room.jpg', '/img/sample-room.jpg', '/img/sample-room.jpg'],
        overallRating: '4.5',
        ratings: ['5.0', '4.0', '4.5', '4.5'],
      },
      {
        id: 'r2',
        host: '홍대입구역 근처 숙소 호스트',
        date: '2025-01-14',
        comment: '전반적으로 만족합니다. 다만 약간 늦게 도착하셨지만 청소 품질은 좋았습니다.',
        photos: ['/img/sample-room.jpg', '/img/sample-room.jpg'],
        overallRating: '3.8',
        ratings: ['4.0', '3.0', '4.0', '4.0'],
      },
      {
        id: 'r3',
        host: '강남역 근처 펜션 호스트',
        date: '2025-01-10',
        comment: '완벽한 청소였습니다! 다음에도 꼭 부탁드리고 싶어요.',
        photos: [
          '/img/sample-room.jpg',
          '/img/sample-room.jpg',
          '/img/sample-room.jpg',
          '/img/sample-room.jpg',
        ],
        overallRating: '5.0',
        ratings: ['5.0', '5.0', '5.0', '5.0'],
      },
      {
        id: 'r4',
        host: '이태원 근처 게스트하우스 호스트',
        date: '2025-01-08',
        comment: '청소는 괜찮았지만 의사소통이 좀 아쉬웠어요.',
        photos: ['/img/sample-room.jpg'],
        overallRating: '3.5',
        ratings: ['4.0', '3.5', '3.0', '3.5'],
      },
    ],
  };

  const isAccepted = mockData.accepted;
  const [isAccepting, setIsAccepting] = useState(false); // 수락하기 버튼을 클릭한 상태

  const handleAcceptClick = () => {
    setIsAccepting(true);
  };

  return (
    <RoomMainTemplate>
      <div className="space-y-8">
        <TitleH3 className="text-neutral-1000 md:text-[28px]">청소자 상세 정보</TitleH3>

        {/* 상단 청소자 카드: accepted 여부에 따라 다르게 렌더링 */}
        <CleanerDetailInfoCard
          accepted={isAccepted}
          isAccepting={isAccepting}
          onAcceptClick={handleAcceptClick}
          cleaner={mockData.cleaner}
        />

        {/* 하단 리뷰 섹션 */}
        <CleanerReviewsSection
          averageRating={mockData.averageRating}
          totalReviews={mockData.totalReviews}
          reviews={mockData.reviews}
        />
      </div>
    </RoomMainTemplate>
  );
}
