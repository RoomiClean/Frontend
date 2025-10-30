import Button from '../atoms/Button';
import { DisplayH3 } from '../atoms/Typography';
import AccommodationCard from '../molecules/RoomCard';

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
  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center md:pb-6 md:border-b border-neutral-300 lg:justify-start">
        <DisplayH3 className="text-neutral-1000 md:text-[28px] lg:text-[32px]">
          소유 에어비앤비 목록
        </DisplayH3>
        <div className="min-w-[120px] h-[46px] lg:hidden">
          <Button onClick={onClickAdd} className="h-[46px]">
            숙소 추가하기
          </Button>
        </div>
      </div>

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
    </section>
  );
}
