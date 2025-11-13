'use client';

import Image from 'next/image';
import Logo from '@/assets/svg/RowLogo.svg';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white px-6 py-8 sm:px-10 sm:py-10 lg:px-[72px]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Image src={Logo} alt="RoomiClean Logo" />

          <div className="flex gap-4 text-sm text-gray-700 sm:gap-6">
            <a href="#" className="transition-colors hover:text-blue-600">
              서비스 정책
            </a>
            <a href="#" className="transition-colors hover:text-blue-600">
              개인정보처리방침
            </a>
          </div>
        </div>

        <div className="w-full text-sm leading-relaxed text-gray-700">
          <div>(주) CleanB | 대표이사: 홍길동</div>
          <div>
            주소: 경기도 용인시 처인구 외대로 54번길 9 글로벌타운 B동 306호 | 이메일:
            naver@naver.com | 대표번호: xxxx-XXXX
          </div>
          <div>사업자 등록번호: XXX-XX-XXXXX | 통신판매신고번호: 2025-서울강남-xxxx</div>
          <div className="mt-2 text-gray-600">Copyright © CleanB ALL RIGHTS RESERVED</div>
        </div>
      </div>
    </footer>
  );
}
