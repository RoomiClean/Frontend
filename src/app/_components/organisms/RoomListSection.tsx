import Image from 'next/image';
import Button from '../atoms/Button';
import { BodyDefault, DisplayH2, DisplayH3 } from '../atoms/Typography';
import EmptyIcon from '../../../assets/svg/EmptyAccommodation.svg';
import AccommodationCard from '../molecules/card/AccommodationCard';

interface AccommodationItem {
  id: string;
  imageUrl: string;
  title: string;
  address: string;
  checkInText: string;
  checkOutText: string;
}

interface AccommodationListSectionProps {
  items: AccommodationItem[];
  onClickAdd?: () => void;
}

export default function AccommodationListSection({
  items,
  onClickAdd,
}: AccommodationListSectionProps) {
  const isEmpty = items.length === 0;

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center md:pb-6 md:border-b border-neutral-300 lg:justify-start">
        <DisplayH3 className="text-neutral-1000 md:text-[28px] lg:text-[32px]">
          소유 에어비앤비 목록
        </DisplayH3>
        {!isEmpty && (
          <div className="min-w-[120px] h-[46px] lg:hidden">
            <Button onClick={onClickAdd} className="h-[46px]">
              숙소 추가하기
            </Button>
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center gap-4 mb-8">
            <Image src={EmptyIcon} alt="EmptyIcon" />
            <DisplayH2 className="text-neutral-1000 md:text-[32px]">
              등록된 숙소가 없습니다
            </DisplayH2>
            <BodyDefault className="text-neutral-1000 md:text-[18px]">
              아래 버튼을 눌러 숙소를 추가해주세요
            </BodyDefault>
          </div>
          <div className="w-full md:w-[400px] h-[46px]">
            <Button onClick={onClickAdd}>숙소 추가하기</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {items.map(item => (
              <AccommodationCard key={item.id} {...item} />
            ))}
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="w-[440px] h-[46px]">
              <Button onClick={onClickAdd} className="h-[46px]">
                숙소 추가하기
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
