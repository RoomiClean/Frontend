import Image from 'next/image';
import Link from 'next/link';
import Button from '../../atoms/Button';
import { BodySmall, DisplayDefault, TitleLarge } from '../../atoms/Typography';
import ArrowRightIcon from '@/assets/svg/DetailArrow.svg';
import { getStatusLabelConfig } from '@/utils/cleaningRequest.utils';

interface CleaningRequestCardProps {
  id: string;
  imageUrl: string;
  title: string;
  requestDateTime: string;
  completionDateTime: string;
  selectedOption: string;
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'canceled';
  cleaningStartDateTime?: string;
  onCheckCleaner?: () => void;
  onClickDetail?: () => void;
  showStatusLabel?: boolean;
  isPastRequest?: boolean;
  onWriteReview?: () => void;
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
  showStatusLabel = false,
  isPastRequest = false,
  onWriteReview,
}: CleaningRequestCardProps) {
  const getStatusLabel = () => {
    const config = getStatusLabelConfig(status, isPastRequest);
    if (!config) return null;

    return (
      <div
        className={`px-4 py-3 rounded-[12px] whitespace-nowrap ${config.bgColor} ${config.textColor}`}
      >
        <BodySmall className={config.textColor}>{config.label}</BodySmall>
      </div>
    );
  };

  return (
    <div>
      {isPastRequest && (
        <div className="mb-4">
          <TitleLarge className="text-neutral-800">{completionDateTime}</TitleLarge>
        </div>
      )}
      <div className="rounded-[16px] bg-neutral-100 md:py-6 py-4 px-4 box-sizing: border-box border border-neutral-200 shadow-[0_3px_10px_0_rgba(0_0_0/0.2)] md:border-0 md:shadow-none md:hover:border md:hover:border-neutral-200 md:hover:shadow-[0_3px_10px_0_rgba(0_0_0/0.2)] transition-all overflow-visible">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="overflow-hidden rounded-[20px] w-[219px] h-[219px] md:w-[112px] md:h-[112px] bg-neutral-200 self-center md:self-auto">
            <Image
              src={imageUrl}
              alt={title}
              width={219}
              height={219}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between gap-2">
              <DisplayDefault className="text-neutral-1000 md:text-[20px] truncate flex-1">
                {title}
              </DisplayDefault>
              {isPastRequest ? (
                getStatusLabel()
              ) : showStatusLabel ? (
                getStatusLabel()
              ) : (
                <Link
                  href={`/mypage/request/detail/${id}`}
                  onClick={onClickDetail}
                  className="w-[70px] whitespace-nowrap text-neutral-500 hover:text-neutral-800 flex items-center flex-shrink-0"
                >
                  <BodySmall className="text-neutral-500">상세보기</BodySmall>
                  <Image src={ArrowRightIcon} alt="arrow-right" />
                </Link>
              )}
            </div>

            <div className="mt-4">
              <div className="flex flex-col gap-4 md:flex-row lg:flex-col min-[1363px]:flex-row items-start md:justify-between min-[1363px]:justify-between">
                <div>
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex">
                      <BodySmall className="text-neutral-600">요청 일시: </BodySmall>
                      <BodySmall className="text-neutral-800 ml-1">{requestDateTime}</BodySmall>
                    </div>
                    {(status === 'in-progress' || (isPastRequest && status === 'completed')) &&
                      cleaningStartDateTime && (
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
                {status === 'pending' && !isPastRequest && (
                  <div className="w-full md:w-[200px] lg:w-full min-[1363px]:w-[200px] self-end">
                    <Link href={`/mypage/request/cleaner-list/${id}`}>
                      <Button onClick={onCheckCleaner} active className="h-[46px] w-full">
                        청소자 요청 목록 확인
                      </Button>
                    </Link>
                  </div>
                )}
                {isPastRequest && status === 'completed' && (
                  <div className="w-full md:w-[200px] lg:w-full min-[1363px]:w-[200px] self-end">
                    <Button onClick={onWriteReview} active className="h-[46px] w-full">
                      리뷰 작성하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
