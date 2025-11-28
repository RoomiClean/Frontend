import Image from 'next/image';
import Link from 'next/link';
import ArrowRightIcon from '@/assets/svg/DetailArrow.svg';
import { BodyDefault, BodySmall, DisplayH4, DisplayLarge } from '../../atoms/Typography';
import Button from '../../atoms/Button';

interface AccommodationCardProps {
  id: string;
  imageUrl: string;
  title: string;
  address: string;
  checkInText: string;
  checkOutText: string;
  onRequestClean?: () => void;
}

/**
 * 숙소 관리 메인 페이지에서 보여주는 카드 컴포넌트
 *
 * 숙소 이미지, 기본 정보, 다음 일정
 */
export default function AccommodationCard({
  id,
  imageUrl,
  title,
  address,
  checkInText,
  checkOutText,
  onRequestClean,
}: AccommodationCardProps) {
  return (
    <div className="rounded-[16px] bg-neutral-100 md:py-6 py-4 px-4 hover:border hover:border-neutral-200 hover:shadow-[0_6px_15px_0_rgba(0_0_0/0.2)] transition-all">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="h-[208px] w-[208px] overflow-hidden rounded-[12px] bg-neutral-200 self-center md:self-auto">
          <Image
            src={imageUrl}
            alt={title}
            width={208}
            height={208}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 w-full">
          <div className="pb-[10px] mb-[10px] md:border-b border-neutral-300">
            <div className="flex items-start justify-between mb-1">
              <DisplayH4 className="text-neutral-1000">{title}</DisplayH4>
              <Link
                href={`/mypage/accommodation/detail/${id}`}
                className="text-neutral-500 hover:text-neutral-800 flex items-center"
              >
                <BodySmall className="text-neutral-500">상세보기</BodySmall>
                <Image src={ArrowRightIcon} alt="arrow-right" />
              </Link>
            </div>
            <BodySmall className="text-neutral-800">{address}</BodySmall>
          </div>

          <div className="mt-4">
            <DisplayLarge className="text-neutral-1000 mb-2">다음 일정 정보</DisplayLarge>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <BodyDefault className="text-neutral-800">Check-in: {checkInText}</BodyDefault>
                <BodyDefault className="text-neutral-800">Check-out: {checkOutText}</BodyDefault>
              </div>
              <div className="w-full md:w-[151px]">
                <Button onClick={onRequestClean} active className="h-[46px] w-full">
                  청소 요청하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
