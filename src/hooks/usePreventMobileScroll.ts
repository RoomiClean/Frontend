import { useEffect } from 'react';

/**
 * 모바일/태블릿에서 배경 스크롤 및 pull-to-refresh 방지 커스텀 훅
 *
 * @param breakpoint - 모바일로 판단할 화면 너비 (기본값: 1024px)
 */
export function usePreventMobileScroll(breakpoint: number = 1024) {
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < breakpoint;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100dvh';
        document.body.style.overscrollBehavior = 'none';
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.height = '100%';
        document.documentElement.style.overscrollBehavior = 'none';
      } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overscrollBehavior = '';
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.documentElement.style.overscrollBehavior = '';
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.style.overscrollBehavior = '';
    };
  }, [breakpoint]);
}

