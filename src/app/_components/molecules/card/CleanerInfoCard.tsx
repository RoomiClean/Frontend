import Image from 'next/image';
import Button from '../../atoms/Button';
import { BodySmall, DisplayH4 } from '../../atoms/Typography';
import ArrowRightIcon from '@/assets/svg/DetailArrow.svg';

interface CleanerInfoCardProps {
  imageUrl: string;
  name: string;
  gender: string;
  experience: string;
  rating: number;
  introduction: string;
  onAccept?: () => void;
  onViewReviews?: () => void;
}

/**
 * 청소자 정보 카드 컴포넌트
 *
 * 청소자의 프로필 이미지, 기본 정보, 평점 및 자기소개를 표시
 */
export default function CleanerInfoCard({
  imageUrl,
  name,
  gender,
  experience,
  rating,
  introduction,
  onAccept,
  onViewReviews,
}: CleanerInfoCardProps) {
  return (
    <div className="relative rounded-[16px] bg-neutral-100 md:py-6 py-4 px-4 box-sizing: border-box border border-neutral-200 shadow-[0_3px_10px_0_rgba(0_0_0/0.2)]">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="overflow-hidden rounded-[20px] w-[136px] h-[136px] bg-neutral-200 self-center md:self-auto">
          <Image
            src={imageUrl}
            alt={name}
            width={136}
            height={136}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 w-full flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <DisplayH4 className="text-neutral-1000">{name}</DisplayH4>
            <button
              onClick={onViewReviews}
              className="whitespace-nowrap text-neutral-500 hover:text-neutral-800 flex items-center"
            >
              <BodySmall className="text-neutral-500">상세보기</BodySmall>
              <Image src={ArrowRightIcon} alt="arrow-right" />
            </button>
          </div>

          <div className="flex flex-col gap-1 mb-3 md:pr-32">
            <div className="flex">
              <BodySmall className="text-neutral-600">성별: </BodySmall>
              <BodySmall className="text-neutral-800 ml-1">{gender}</BodySmall>
            </div>
            <div className="flex">
              <BodySmall className="text-neutral-600">경력 정보: </BodySmall>
              <BodySmall className="text-neutral-800 ml-1">{experience}</BodySmall>
            </div>
            <div className="flex">
              <BodySmall className="text-neutral-600">평점: </BodySmall>
              <BodySmall className="text-neutral-800 ml-1">{rating}/5.0</BodySmall>
            </div>
            <BodySmall className="text-neutral-800 truncate md:whitespace-normal md:overflow-visible flex-1">
              <span className="text-neutral-600">자기소개: </span>
              {introduction}
            </BodySmall>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[120px] md:absolute md:bottom-6 md:right-4 mt-4 md:mt-0">
        <Button onClick={onAccept} active className="h-[46px] w-full">
          수락하기
        </Button>
      </div>
    </div>
  );
}
