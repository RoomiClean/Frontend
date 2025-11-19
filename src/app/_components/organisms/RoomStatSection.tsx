import { DisplayH3 } from '../atoms/Typography';
import StatusStatItem from '../molecules/StatItem';
import HomeIcon from '../../../assets/svg/Home.svg';
import WarningIcon from '../../../assets/svg/Warning.svg';
import CalendarIcon from '../../../assets/svg/Calendar.svg';

export interface RoomStatusSectionProps {
  totalRooms: number;
  needClean: number;
  todayClean: number;
}

export default function RoomStatusSection({
  totalRooms,
  needClean,
  todayClean,
}: RoomStatusSectionProps) {
  return (
    <section className="space-y-6 mb-12">
      <DisplayH3 className="text-neutral-1000 md:text-[28px] lg:text-[32px]">
        숙소 관리 현황
      </DisplayH3>
      <div className="w-full border border-neutral-300 bg-neutral-100 lg:shadow-[0_6px_15px_0_rgba(0_0_0/0.2)]">
        <div className="flex divide-neutral-200 flex-row divide-y-0 divide-x">
          <StatusStatItem icon={HomeIcon} label="전체 숙소 수" value={totalRooms} />
          <StatusStatItem icon={WarningIcon} label="청소 필요" value={needClean} />
          <StatusStatItem icon={CalendarIcon} label="오늘 청소 예정" value={todayClean} />
        </div>
      </div>
    </section>
  );
}
