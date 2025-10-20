import Image from 'next/image';
import Logo from '@/assets/svg/RowLogo.svg';
import Link from 'next/link';

// interface HeaderProps {
//   nickname: string;
// }

export default function Header() {
  return (
    <div className="h-[68px] px-[25px] py-[12px] flex justify-between items-center border-b">
      <Image src={Logo} alt="Logo" />
      <div className="flex items-center gap-8">
        <Link href="/service-structure">서비스 제공 범위 및 구조</Link>
        <Link href="/how-to-use">서비스 이용 방법</Link>
        <Link href="/login">로그인</Link>
      </div>
    </div>
  );
}
