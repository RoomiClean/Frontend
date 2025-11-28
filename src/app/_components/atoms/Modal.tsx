import { ReactNode, useEffect } from 'react';
import Image from 'next/image';
import CloseIcon from '@/assets/svg/close.svg';

interface ModalProps {
  /** 모달 열림/닫힘 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  children: ReactNode;
  width?: string;
  height?: string;
  padding?: string;
  className?: string;
  /** 닫기 버튼 표시 여부 */
  showCloseButton?: boolean;
}

/**
 * 모달 컴포넌트
 *
 * @description
 * - 바깥 클릭 또는 X 버튼 클릭시 닫힙니다.
 * - width, height, padding을 커스터마이징할 수 있습니다.
 * - ESC 키를 눌러도 닫힙니다.
 * - showCloseButton으로 닫기 버튼 표시 여부를 제어할 수 있습니다.
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   width="600px"
 *   height="400px"
 *   padding="40px"
 *   showCloseButton={true}
 * >
 *   <h2>모달 제목</h2>
 *   <p>모달 내용</p>
 * </Modal>
 * ```
 */
export default function Modal({
  isOpen,
  onClose,
  children,
  width = '500px',
  height = 'auto',
  padding = '32px',
  className = '',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // body 스크롤 방지 (스크롤바는 유지)
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;

      // body 스타일 적용 (position: fixed로 스크롤 방지, overflowY: scroll로 스크롤바 유지)
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';

      return () => {
        // 원래 상태로 복구
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';

        // 스크롤 위치 복원
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-200 bg-opacity-30 px-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-neutral-100 border border-neutral-300 rounded-[20px] w-full ${className}`}
        style={{ width, height, padding }}
      >
        {showCloseButton && (
          <button onClick={onClose} className="absolute top-4 right-4" aria-label="모달 닫기">
            <Image src={CloseIcon} alt="닫기" />
          </button>
        )}
        <div className="w-full h-full flex flex-col items-center justify-center">{children}</div>
      </div>
    </div>
  );
}
