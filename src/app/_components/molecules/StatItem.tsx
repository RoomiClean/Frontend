import Image from 'next/image';
import { BodyLarge, TitleDefault } from '../atoms/Typography';

/**
 * 숙소 관리 현황 아이템
 */
export interface StatusStatItemProps {
  icon: string;
  label: string;
  value: number;
}

export default function StatusStatItem({ icon, label, value }: StatusStatItemProps) {
  const itemBase = 'flex flex-1 flex-col items-center justify-center gap-1 py-3';

  return (
    <div className={itemBase}>
      <Image src={icon} alt={label} />
      <TitleDefault className="text-neutral-1000">{label}</TitleDefault>
      <div className="flex items-baseline">
        <BodyLarge className="text-red-100">{value}</BodyLarge>
        <BodyLarge className="text-neutral-1000">개</BodyLarge>
      </div>
    </div>
  );
}
