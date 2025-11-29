import Image from 'next/image';
import Link from 'next/link';
import RoomMainTemplate from '@/app/_components/templates/RoomMainTemplate';
import {
  BodyDefault,
  BodySmall,
  DisplayDefault,
  DisplayH3,
  DisplayH4,
  TitleDefault,
} from '@/app/_components/atoms/Typography';

export default function UserInformationPage() {
  // TODO: 실제 로그인한 사용자 정보로 교체 예정
  const user = {
    name: '홍길동',
    email: 'tlstkdgus9@naver.com',
    phone: '010-0000-0000',
    birth: '2001.01.01',
    gender: '남성',
  };

  const accountMenus = [
    { label: '비밀번호 변경', href: '/mypage/userInformation/password' },
    { label: '사업자 정보 관리', href: '/mypage/userInformation/business' },
    { label: '약관 동의 현황', href: '/mypage/userInformation/agreement' },
    { label: '회원 탈퇴', href: '/mypage/userInformation/withdrawal' },
  ];

  return (
    <RoomMainTemplate>
      <div className="flex flex-col gap-[25px]">
        {/* 페이지 타이틀 */}
        <DisplayH4 className="text-neutral-1000 md:text-[24px]">내 정보 관리</DisplayH4>

        {/* 회원 정보 카드 */}
        <section className="w-full rounded-[20px] bg-neutral-100 border border-neutral-100 shadow-[0_6px_15px_0_rgba(0,0,0,0.1)] px-6 py-8 md:px-8 md:py-8">
          <div className="flex items-center justify-between mb-4">
            <DisplayH4 className="text-neutral-1000">회원 정보</DisplayH4>
            <Link href="/mypage/userInformation/edit">
              <DisplayDefault className="text-primary-400 hover:underline">
                프로필 편집 →
              </DisplayDefault>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* 프로필 이미지 (샘플) */}
            <div className="w-[180px] h-[180px] rounded-[20px] overflow-hidden bg-neutral-200 flex-shrink-0 flex items-center justify-center">
              <Image
                src="/img/cleaner-male.png"
                alt="프로필 이미지"
                width={180}
                height={180}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 프로필 상세 정보 */}
            <div className="flex flex-col gap-4">
              <DisplayH4 className="text-neutral-1000">{user.name}</DisplayH4>
              <div className="flex-1 grid grid-cols-[60px_1fr] md:grid-cols-[80px_1fr] gap-y-3 gap-x-4 md:gap-x-8 w-full">
                <BodyDefault className="text-neutral-400">아이디</BodyDefault>
                <BodyDefault className="text-neutral-800 break-all">{user.email}</BodyDefault>

                <BodyDefault className="text-neutral-400">전화번호</BodyDefault>
                <BodyDefault className="text-neutral-800">{user.phone}</BodyDefault>

                <BodyDefault className="text-neutral-600">생년월일</BodyDefault>
                <BodyDefault className="text-neutral-800">{user.birth}</BodyDefault>

                <BodyDefault className="text-neutral-400">성별</BodyDefault>
                <BodyDefault className="text-neutral-800">{user.gender}</BodyDefault>
              </div>
            </div>
          </div>
        </section>

        {/* 계정 관리 카드 */}
        <section className="w-full rounded-[20px] bg-neutral-100 border border-neutral-100 shadow-[0_6px_15px_0_rgba(0,0,0,0.1)] px-6 py-8 md:px-8 md:py-8">
          <DisplayH4 className="text-neutral-1000 mb-6">계정 관리</DisplayH4>
          <ul className="flex flex-col gap-4">
            {accountMenus.map(menu => (
              <li key={menu.href}>
                <Link href={menu.href} className="flex items-center justify-between">
                  <BodyDefault className="text-current text-neutral-800 hover:text-primary-400 transition-colors">
                    {menu.label}
                  </BodyDefault>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </RoomMainTemplate>
  );
}
