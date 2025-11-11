import Image from 'next/image';
import Link from 'next/link';
import Button from '../../atoms/Button';
import { BodySmall, DisplayH4 } from '../../atoms/Typography';
import ArrowRightIcon from '@/assets/svg/DetailArrow.svg';

interface CleaningRequestCardProps {
  id: string;
  imageUrl: string;
  title: string;
  requestDateTime: string;
  completionDateTime: string;
  selectedOption: string;
  status: 'pending' | 'scheduled' | 'in-progress';
  cleaningStartDateTime?: string;
  onCheckCleaner?: () => void;
  onClickDetail?: () => void;
}

/**
 * 청소 요청 목록에서 보여주는 카드 컴포넌트
 *
 * 숙소 이미지, 청소 요청 정보, 완료 날짜 및 시각
 * - 요청 대기 중(pending): 청소자 요청 목록 확인 버튼 표시
 * - 청소 진행 예정(scheduled): 버튼 없음
 * - 청소 진행 중(in-progress): 버튼 없음, 청소 시작 시각 표시
 */
export default function CleaningRequestCard({
  id,
  imageUrl,
  title,
  requestDateTime,
  completionDateTime,
  selectedOption,
  status,
  cleaningStartDateTime,
  onCheckCleaner,
  onClickDetail,
}: CleaningRequestCardProps) {
  return (
    <div className="rounded-[16px] bg-neutral-100 md:py-6 py-4 px-4 box-sizing: border-box hover:border hover:border-neutral-200 hover:shadow-[0_3px_10px_0_rgba(0_0_0/0.2)] transition-all">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="overflow-hidden rounded-[20px] w-[112px] h-[112px] bg-neutral-200 self-center md:self-auto">
          <Image
            src={imageUrl}
            alt={title}
            width={112}
            height={112}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-start justify-between">
            <DisplayH4 className="text-neutral-1000">{title}</DisplayH4>
            <Link
              href={`/room/detail/${id}`}
              onClick={onClickDetail}
              className="w-[70px] whitespace-nowrap text-neutral-500 hover:text-neutral-800 flex items-center"
            >
              <BodySmall className="text-neutral-500">상세보기</BodySmall>
              <Image src={ArrowRightIcon} alt="arrow-right" />
            </Link>
          </div>

          <div className="mt-4">
            <div className="flex flex-col gap-4 md:flex-row lg:flex-col min-[1363px]:flex-row items-start md:justify-between min-[1363px]:justify-between">
              <div>
                <div className="flex flex-col gap-1 items-start">
                  <div className="flex">
                    <BodySmall className="text-neutral-600">요청 일시: </BodySmall>
                    <BodySmall className="text-neutral-800 ml-1">{requestDateTime}</BodySmall>
                  </div>
                  {status === 'in-progress' && cleaningStartDateTime && (
                    <div className="flex">
                      <BodySmall className="text-neutral-600">청소 시작 시각: </BodySmall>
                      <BodySmall className="text-neutral-800 ml-1">
                        {cleaningStartDateTime}
                      </BodySmall>
                    </div>
                  )}
                  <div className="flex">
                    <BodySmall className="text-neutral-600">
                      청소 완료 날짜 및 희망 시각:{' '}
                    </BodySmall>
                    <BodySmall className="text-neutral-800 ml-1">{completionDateTime}</BodySmall>
                  </div>
                  <div className="flex">
                    <BodySmall className="text-neutral-600">선택 옵션: </BodySmall>
                    <BodySmall className="text-neutral-800 ml-1">{selectedOption}</BodySmall>
                  </div>
                </div>
              </div>
              {status === 'pending' && (
                <div className="w-full md:w-[200px] lg:w-full min-[1363px]:w-[200px]">
                  <Link href={`/room/request/cleaner-list/${id}`}>
                    <Button onClick={onCheckCleaner} active className="h-[46px] w-full">
                      청소자 요청 목록 확인
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
