import Image from 'next/image';
import Button from '@/app/_components/atoms/Button';
import { BodyDefault, DisplayH4 } from '@/app/_components/atoms/Typography';

interface CleanerInfo {
  name: string;
  gender: '남성' | '여성' | string;
  phone: string;
  experienceText: string;
  ratingText: string;
  intro: string;
  profileImage: string;
}

interface CleanerDetailInfoCardProps {
  accepted: boolean;
  isAccepting?: boolean;
  cleaner: CleanerInfo;
  onAcceptClick?: () => void;
  onContactClick?: () => void;
}

export default function CleanerDetailInfoCard({
  accepted,
  isAccepting = false,
  cleaner,
  onAcceptClick,
}: CleanerDetailInfoCardProps) {
  const { name, gender, phone, experienceText, ratingText, intro, profileImage } = cleaner;

  return (
    <div
      className={`w-full rounded-[16px] bg-neutral-100 p-4 shadow-[0_3px_10px_rgba(0,0,0,0.20)]`}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* 프로필 이미지 */}
        <div className="relative w-full md:w-[300px] aspect-square md:aspect-square rounded-[20px] overflow-hidden bg-neutral-200 flex-shrink-0">
          <Image
            src={profileImage}
            alt={`${name} 프로필 이미지`}
            className="h-full w-full object-cover"
            width={295}
            height={295}
          />
        </div>

        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-y-2 mb-4">
            <DisplayH4 className="text-neutral-1000">{name}</DisplayH4>
            <InfoRow label="성별" value={gender} />
            <InfoRow label="연락처" value={accepted || isAccepting ? phone : '수락 후 공개'} />
            <InfoRow label="경력 정보" value={experienceText} />
            <InfoRow label="평점" value={ratingText} />
            <InfoRow label="자기소개" value={intro} />
          </div>

          <div className="w-full lg:w-[120px]">
            {!accepted && !isAccepting && (
              <Button variant="primary" active onClick={onAcceptClick} className="h-[46px]">
                수락하기
              </Button>
            )}
            {!accepted && isAccepting && (
              <Button variant="primary" disabled className="h-[46px]">
                수락 완료
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1">
      <BodyDefault className="text-neutral-800">
        <span className="text-neutral-600">{label}: </span>
        {value}
      </BodyDefault>
    </div>
  );
}
