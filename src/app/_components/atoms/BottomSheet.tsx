'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * BottomSheet Props 인터페이스
 */
interface BottomSheetProps {
  /** 바텀시트 내부에 표시될 컨텐츠 */
  children: React.ReactNode;
  /** 초기 높이 (하단에서부터의 픽셀 값) */
  initialHeight: number;
  /** 최대 높이 (완전히 확장했을 때의 픽셀 값) */
  maxHeight: number;
}

/**
 * 모바일/태블릿용 바텀시트 컴포넌트
 *
 * 화면 하단에서 올라오는 드래그 가능한 바텀시트.
 * 터치와 마우스 이벤트를 모두 지원하며, 스와이프로 확장/축소 가능.
 *
 * @component
 * @example
 * ```tsx
 * <BottomSheet initialHeight={300} maxHeight={600}>
 *   <여기에 내부 컨텐츠를 추가해주세요. />
 * </BottomSheet>
 * ```
 *
 * @features
 * - 드래그로 확장/축소 가능
 * - 터치 및 마우스 이벤트 지원
 */
export default function BottomSheet({ children, initialHeight, maxHeight }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const startY = useRef(0);
  const currentTranslate = useRef(0);

  // 첫 렌더링 완료 체크
  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  // 확장/축소 상태에 따른 위치 조정
  useEffect(() => {
    if (sheetRef.current && !isDragging) {
      sheetRef.current.style.transition = isFirstRender ? 'none' : 'transform 0.3s ease';
      if (isExpanded) {
        sheetRef.current.style.transform = 'translateY(0)';
      } else {
        sheetRef.current.style.transform = `translateY(calc(100% - ${initialHeight}px))`;
      }
    }
  }, [isExpanded, initialHeight, isDragging, isFirstRender]);

  /**
   * 드래그 시작 핸들러
   * @param clientY - 터치/마우스의 Y 좌표
   */
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    startY.current = clientY;
    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
      const transform = window.getComputedStyle(sheetRef.current).transform;
      if (transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        currentTranslate.current = matrix.m42;
      }
    }
  }, []);

  /**
   * 드래그 이동 핸들러
   * @param clientY - 현재 터치/마우스의 Y 좌표
   */
  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging || !sheetRef.current) return;

      const diff = clientY - startY.current;
      const newTranslate = currentTranslate.current + diff;

      const maxTranslate = sheetRef.current.offsetHeight - initialHeight;
      const clampedTranslate = Math.max(0, Math.min(newTranslate, maxTranslate));

      sheetRef.current.style.transform = `translateY(${clampedTranslate}px)`;
    },
    [isDragging, initialHeight],
  );

  /**
   * 드래그 종료 핸들러
   * 드래그 거리에 따라 확장/축소 여부를 결정합니다.
   * @param clientY - 드래그 종료 시점의 Y 좌표
   */
  const handleDragEnd = useCallback(
    (clientY: number) => {
      if (!isDragging) return;

      setIsDragging(false);
      const diff = clientY - startY.current;
      const threshold = 50;

      if (isExpanded && diff > threshold) {
        setIsExpanded(false);
      } else if (!isExpanded && diff < -threshold) {
        setIsExpanded(true);
      } else {
        if (sheetRef.current) {
          sheetRef.current.style.transition = 'transform 0.3s ease';
          if (isExpanded) {
            sheetRef.current.style.transform = 'translateY(0)';
          } else {
            sheetRef.current.style.transform = `translateY(calc(100% - ${initialHeight}px))`;
          }
        }
      }
    },
    [isDragging, isExpanded, initialHeight],
  );

  // 터치 이벤트 리스너 등록
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleTouchStartNative = (e: TouchEvent) => {
      handleDragStart(e.touches[0].clientY);
      e.stopPropagation();
    };

    const handleTouchMoveNative = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleDragMove(e.touches[0].clientY);
    };

    const handleTouchEndNative = (e: TouchEvent) => {
      e.stopPropagation();
      handleDragEnd(e.changedTouches[0].clientY);
    };

    header.addEventListener('touchstart', handleTouchStartNative, { passive: false });
    header.addEventListener('touchmove', handleTouchMoveNative, { passive: false });
    header.addEventListener('touchend', handleTouchEndNative, { passive: false });

    return () => {
      header.removeEventListener('touchstart', handleTouchStartNative);
      header.removeEventListener('touchmove', handleTouchMoveNative);
      header.removeEventListener('touchend', handleTouchEndNative);
    };
  }, [handleDragStart, handleDragMove, handleDragEnd]);

  /**
   * 마우스 드래그 시작 핸들러 (데스크톱)
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleDragStart(e.clientY);
    e.stopPropagation();

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleDragMove(moveEvent.clientY);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      handleDragEnd(upEvent.clientY);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  /**
   * 컨텐츠 영역 터치 시작 핸들러
   * 컨텐츠 스크롤을 위해 이벤트 전파를 중단합니다.
   */
  const handleContentTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 lg:hidden"
      style={{
        height: `${maxHeight}px`,
        touchAction: 'none',
        overscrollBehavior: 'contain',
        transform: `translateY(calc(100% - ${initialHeight}px))`,
      }}
    >
      {/* 드래그 가능한 헤더 영역 */}
      <div
        ref={headerRef}
        className="w-full px-4 pt-4 pb-8 cursor-grab active:cursor-grabbing select-none flex justify-center items-start"
        onMouseDown={handleMouseDown}
        style={{ touchAction: 'none' }}
      >
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
      </div>

      {/* 내부 컨텐츠 */}
      <div
        className="h-[calc(100%-64px)] overflow-y-auto overflow-x-hidden px-6 scrollbar-hide"
        onTouchStart={handleContentTouchStart}
        style={{
          touchAction: 'pan-y',
          overscrollBehavior: 'contain',
        }}
      >
        {children}
      </div>
    </div>
  );
}
