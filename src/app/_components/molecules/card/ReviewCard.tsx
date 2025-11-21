import Image from 'next/image';
import {
  BodyDefault,
  DisplaySmall,
  TitleDefault,
  TitleSmall,
} from '@/app/_components/atoms/Typography';
import StarIcon from '@/assets/svg/Star.svg';

export interface ReviewCardProps {
  id: string;
  host: string;
  date: string;
  comment: string;
  photos: string[];
  overallRating: string;
  ratings: string[]; // score 부분 - 실제로 서버에서 어떻게 내려오는지 보고 수정해야함!
}

export default function ReviewCard({
  host,
  date,
  comment,
  photos,
  overallRating,
  ratings,
}: ReviewCardProps) {
  return (
    <article className="py-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0 pr-4 md:border-r md:border-neutral-300">
          <div className="mb-[21px]">
            <TitleDefault className="text-neutral-1000">{host}</TitleDefault>
            <TitleSmall className="text-neutral-600 mt-2">{date}</TitleSmall>
          </div>

          <div className="flex flex-row">
            <div className="flex flex-col items-start justify-center mr-10">
              <div className="flex items-center gap-1">
                <Image src={StarIcon} alt="별점" width={15} height={15} />
                <DisplaySmall className="text-neutral-900 font-medium">
                  {overallRating}
                </DisplaySmall>
              </div>
            </div>

            <div className="flex flex-col items-start gap-[10px] mr-5">
              <TitleSmall className="text-neutral-900">청결도</TitleSmall>
              <TitleSmall className="text-neutral-900">시간 준수</TitleSmall>
              <TitleSmall className="text-neutral-900">의사소통</TitleSmall>
              <TitleSmall className="text-neutral-900">신뢰도 및 전문성</TitleSmall>
            </div>

            <div className="flex flex-col items-start gap-[10px] mr-4">
              {ratings.map((score, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <Image src={StarIcon} alt="별점" width={15} height={15} />
                  <DisplaySmall className="text-neutral-900">{score}</DisplaySmall>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 min-w-0">
          <BodyDefault className="text-neutral-900 leading-relaxed">{comment}</BodyDefault>
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-max">
              {photos.map((src, idx) => (
                <div
                  key={idx}
                  className="relative w-[154px] h-[154px] flex-shrink-0 overflow-hidden bg-neutral-200"
                >
                  <Image
                    src={src}
                    alt={`리뷰 사진 ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="154px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
