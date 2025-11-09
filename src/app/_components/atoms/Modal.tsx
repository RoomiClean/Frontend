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
}

/**
 * 모달 컴포넌트
 *
 * @description
 * - 바깥 클릭 또는 X 버튼 클릭시 닫힙니다.
 * - width, height, padding을 커스터마이징할 수 있습니다.
 * - ESC 키를 눌러도 닫힙니다.
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

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-200 bg-opacity-30"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative bg-neutral-100 border border-neutral-300 rounded-[20px]  ${className}`}
        style={{ width, height, padding }}
      >
        <button onClick={onClose} className="absolute top-4 right-4" aria-label="모달 닫기">
          <Image src={CloseIcon} alt="닫기" />
        </button>
        <div className="w-full h-full">{children}</div>
      </div>
    </div>
  );
}
