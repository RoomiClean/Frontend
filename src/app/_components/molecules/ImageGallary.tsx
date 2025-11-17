import Image from 'next/image';

interface Photo {
  id: string;
  photoUrl: string;
  displayOrder: number;
}

interface ImageGallaryProps {
  photos: Photo[];
}

/**
 * 숙소 이미지 갤러리 컴포넌트
 *
 * 메인 이미지 1개와 서브 이미지 4개를 그리드 형태로 표시합니다.
 */
export default function ImageGallary({ photos }: ImageGallaryProps) {
  const sortedPhotos = [...photos].sort((a, b) => a.displayOrder - b.displayOrder);
  const mainPhoto = sortedPhotos[0];
  const subPhotos = sortedPhotos.slice(1, 5);

  return (
    <div className="w-full">
      {/* 모바일 레이아웃 */}
      <div className="block md:hidden space-y-6">
        {/* 메인 이미지 */}
        <div className="w-full aspect-square rounded-[20px] overflow-hidden bg-neutral-200 shadow-[0_6px_15px_0_rgba(0_0_0/0.2)]">
          {mainPhoto && (
            <Image
              src={mainPhoto.photoUrl}
              alt="숙소 메인 이미지"
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* 서브 이미지 그리드 */}
        <div className="grid grid-cols-2 gap-6">
          {subPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="aspect-square rounded-[20px] overflow-hidden bg-neutral-200 shadow-[0_6px_15px_0_rgba(0_0_0/0.2)]"
            >
              <Image
                src={photo.photoUrl}
                alt={`숙소 이미지 ${index + 2}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 태블릿/PC 레이아웃 */}
      <div className="hidden md:flex gap-4">
        {/* 메인 이미지 */}
        <div className="flex-1 aspect-square rounded-[16px] overflow-hidden bg-neutral-200 shadow-[0_6px_15px_0_rgba(0_0_0/0.2)]">
          {mainPhoto && (
            <Image
              src={mainPhoto.photoUrl}
              alt="숙소 메인 이미지"
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* 서브 이미지 그리드 */}
        <div className="grid grid-cols-2 gap-4 flex-shrink-0" style={{ width: 'calc(50% - 8px)' }}>
          {subPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="aspect-square rounded-[16px] overflow-hidden bg-neutral-200 shadow-[0_6px_15px_0_rgba(0_0_0/0.2)]"
            >
              <Image
                src={photo.photoUrl}
                alt={`숙소 이미지 ${index + 2}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
