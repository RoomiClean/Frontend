import { Fragment } from 'react';
import { BodyDefault, TitleDefault } from '../atoms/Typography';
import { ACCOMMODATION_TYPE_LABELS } from '@/constants/develop.constants';

interface AccommodationInfoProps {
  accommodationType: string;
  accessMethod: string;
  roomCount: number;
  bedCount: number;
  livingRoomCount: number;
  bathroomCount: number;
  areaPyeong: number;
  maxOccupancy: number;
  supplyStorageLocation: string;
  trashLocation: string;
  cleaningNotes?: string;
}

/**
 * 숙소 정보 컴포넌트
 *
 * 숙소의 상세 정보를 2열 테이블 형태로 표시
 */
export default function AccommodationInfo({
  accommodationType,
  accessMethod,
  roomCount,
  bedCount,
  livingRoomCount,
  bathroomCount,
  areaPyeong,
  maxOccupancy,
  supplyStorageLocation,
  trashLocation,
  cleaningNotes,
}: AccommodationInfoProps) {
  const infoRows = [
    {
      label: '숙소 유형',
      value: ACCOMMODATION_TYPE_LABELS[accommodationType] || accommodationType,
    },
    { label: '출입 방법', value: accessMethod },
    {
      label: '숙소 구조',
      value: `방 ${roomCount} / 침대 ${bedCount} / 거실 ${livingRoomCount} / 화장실 ${bathroomCount}`,
    },
    { label: '숙소 면적/규모', value: `${areaPyeong} 평` },
    { label: '최대 수용 인원', value: `${maxOccupancy}명` },
    { label: '비품 보관장소', value: supplyStorageLocation },
    { label: '쓰레기 배출장소', value: trashLocation },
  ];

  if (cleaningNotes) {
    infoRows.push({ label: '호스트 요청사항', value: cleaningNotes });
  }

  return (
    <div className="w-full border border-neutral-300 rounded-[20px] shadow-[0_6px_15px_0_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="grid grid-cols-[160px_1fr] lg:grid-cols-[180px_1fr]">
        {infoRows.map((row, index) => (
          <Fragment key={row.label}>
            {/* 라벨 셀 */}
            <div
              className={`bg-neutral-200 px-4 py-4 border-b border-neutral-300
                ${index === 0 ? 'rounded-tl-[20px]' : ''}
                ${index === infoRows.length - 1 ? 'rounded-bl-[20px] border-b-0' : ''}
              `}
            >
              <TitleDefault className="text-neutral-1000">{row.label}</TitleDefault>
            </div>

            {/* 값 셀 */}
            <div
              className={`px-4 py-4 border-b border-neutral-300
                ${index === infoRows.length - 1 ? 'border-b-0' : ''}
              `}
            >
              <BodyDefault className="text-neutral-700 break-words">{row.value}</BodyDefault>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
