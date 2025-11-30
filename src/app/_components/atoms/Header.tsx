'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '@/assets/svg/RowLogo.svg';
import Menu from '@/assets/svg/HamburgerMenu.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/app/_lib/queries/auth.queries';

export default function Header() {
  const router = useRouter();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const [isLogin, setIsLogin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLogin') === 'true';
    }
    return false;
  });

  useEffect(() => {
    // 초기 로컬스토리지 상태 확인
    const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const loginStatus = localStorage.getItem('isLogin');
        setIsLogin(loginStatus === 'true');
      }
    };

    checkLoginStatus();

    // storage 이벤트 리스너 (다른 탭에서 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLogin') {
        setIsLogin(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 커스텀 이벤트 리스너 (같은 탭에서 변경 감지)
    const handleAuthChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        localStorage.removeItem('isLogin');
        setIsLogin(false);
        window.dispatchEvent(new Event('authChange'));
        router.push('/home');
      },
      onError: () => {
        // 에러가 발생해도 로컬스토리지는 제거 (쿠키는 서버에서 처리)
        localStorage.removeItem('isLogin');
        setIsLogin(false);
        window.dispatchEvent(new Event('authChange'));
      },
    });
  };

  function handleMenuClick() {
    console.log('햄버거 메뉴 아이콘 클릭');
  }

  return (
    <div className="h-[68px] px-4 md:px-6 lg:px-8 py-[12px] flex justify-between items-center border-b">
      <div onClick={() => router.push('/home')}>
        <Image src={Logo} alt="Logo" className="cursor-pointer" />
      </div>
      <div className="flex items-center gap-8">
        {/* 태블릿 크기 이상에서만 링크 표시 */}
        <Link href="/service-structure" className="hidden md:block">
          서비스 제공 범위 및 구조
        </Link>
        <Link href="/how-to-use" className="hidden md:block">
          서비스 이용 방법
        </Link>
        {isLogin ? (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="hidden md:block text-neutral-1000 hover:text-neutral-500 disabled:opacity-50"
          >
            {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
          </button>
        ) : (
          <Link href="/login" className="hidden md:block">
            로그인
          </Link>
        )}
        {/* 모바일과 PC에서만 햄버거 메뉴 표시 */}
        <div className="cursor-pointer lg:block md:hidden" onClick={handleMenuClick}>
          <Image src={Menu} alt="MenuIcon" />
        </div>
      </div>
    </div>
  );
}
