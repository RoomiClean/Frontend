'use client';

import Image from 'next/image';
import Logo from '@/assets/svg/RowLogo.svg';
import Menu from '@/assets/svg/HamburgerMenu.svg';
import Link from 'next/link';

// interface HeaderProps {
//   nickname: string;
// }

export default function Header() {
  const handleMenuClick = () => {
    console.log('햄버거 메뉴 아이콘 클릭');
  };
  return (
    <div className="h-[68px] px-4 md:px-6 lg:px-8 py-[12px] flex justify-between items-center border-b">
      <Image src={Logo} alt="Logo" />
      <div className="flex items-center gap-8">
        {/* 태블릿 크기 이상에서만 링크 표시 */}
        <Link href="/service-structure" className="hidden md:block">
          서비스 제공 범위 및 구조
        </Link>
        <Link href="/how-to-use" className="hidden md:block">
          서비스 이용 방법
        </Link>
        <Link href="/login" className="hidden md:block">
          로그인
        </Link>
        {/* 모바일과 PC에서만 햄버거 메뉴 표시 */}
        <div className="cursor-pointer lg:block md:hidden" onClick={handleMenuClick}>
          <Image src={Menu} alt="MenuIcon" />
        </div>
      </div>
    </div>
  );
}
