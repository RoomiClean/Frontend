'use client';

import { use } from 'react';
import { BodySmall, DisplayH4 } from '@/app/_components/atoms/Typography';
import CleanerInfoCard from '@/app/_components/molecules/card/CleanerInfoCard';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';

interface CleanerData {
  id: string;
  imageUrl: string;
  name: string;
  gender: string;
  experience: string;
  rating: number;
  introduction: string;
}

const cleanerMockData: CleanerData[] = [
  {
    id: '1',
    imageUrl: '/img/cleaner-male.png',
    name: '홍길동',
    gender: '남성',
    experience: '3개월 이상',
    rating: 4.3,
    introduction:
      '안녕하세요 홍길동입니다. 현재 청소 경력 6개월이고, 꼼꼼하고 정확한 청소를 약속드립니다.',
  },
  {
    id: '2',
    imageUrl: '/img/cleaner-female.png',
    name: '김영희',
    gender: '여성',
    experience: '1년 이상',
    rating: 4.8,
    introduction:
      '안녕하세요! 청소 경력 1년 6개월의 김영희입니다. 깔끔하고 세심한 청소로 만족도 높은 서비스를 제공해드리겠습니다.',
  },
  {
    id: '3',
    imageUrl: '/img/cleaner-male.png',
    name: '박민수',
    gender: '남성',
    experience: '6개월 이상',
    rating: 4.5,
    introduction:
      '청소 전문가 박민수입니다. 특히 화장실과 주방 청소에 자신있습니다. 책임감 있게 일하겠습니다.',
  },
  {
    id: '4',
    imageUrl: '/img/cleaner-female.png',
    name: '이수진',
    gender: '여성',
    experience: '2년 이상',
    rating: 4.9,
    introduction:
      '청소 경력 2년 이상의 베테랑입니다. 고객님의 소중한 공간을 내 집처럼 깨끗하게 관리해드립니다.',
  },
  {
    id: '5',
    imageUrl: '/img/cleaner-male.png',
    name: '최동욱',
    gender: '남성',
    experience: '1년 이상',
    rating: 4.6,
    introduction:
      '안녕하세요. 청소는 디테일이 생명입니다. 구석구석 놓치지 않고 깨끗하게 청소해드리겠습니다.',
  },
];

interface CleanerListPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CleanerListPage({ params }: CleanerListPageProps) {
  const { id } = use(params);

  const handleAccept = (cleanerId: string) => {
    console.log('요청 ID:', id, '청소자 수락 ID:', cleanerId);
  };

  const handleViewReviews = (cleanerId: string) => {
    console.log('리뷰 보기:', cleanerId);
  };

  return (
    <RoomMainTemplate>
      <div className="mb-6">
        <DisplayH4 className=" text-neutral-1000 mb-2 md:text-[28px]">청소자 요청 목록</DisplayH4>
        <BodySmall className="text-neutral-800 mb-8 md:text-[16px]">
          여러분들의 청소 요청을 수락하신 청소자 분들입니다. <br />
          청소자분들의 정보를 확인하고 청소를 진행해보세요.
        </BodySmall>
      </div>
      <div className="flex flex-col gap-8 md:gap-4 lg:grid lg:grid-cols-2">
        {cleanerMockData.map(cleaner => (
          <CleanerInfoCard
            key={cleaner.id}
            imageUrl={cleaner.imageUrl}
            name={cleaner.name}
            gender={cleaner.gender}
            experience={cleaner.experience}
            rating={cleaner.rating}
            introduction={cleaner.introduction}
            onAccept={() => handleAccept(cleaner.id)}
            onViewReviews={() => handleViewReviews(cleaner.id)}
          />
        ))}
      </div>
    </RoomMainTemplate>
  );
}
