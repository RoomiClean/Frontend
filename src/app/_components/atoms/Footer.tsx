'use client';

import Image from 'next/image';
import Logo from '@/assets/svg/RowLogo.svg';
import { Caption, TitleDefault } from './Typography';

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-300 bg-neutral-100 px-[16px] py-[20px] md:px-6 lg:px-[36px]">
      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Image src={Logo} alt="RoomiClean Logo" />

          <div className="flex gap-4 text-neutral-1000">
            <a href="#" className="transition-colors hover:text-blue-600">
              <TitleDefault>서비스 정책</TitleDefault>
            </a>
            <a href="#" className="transition-colors hover:text-blue-600">
              <TitleDefault>개인정보처리방침</TitleDefault>
            </a>
          </div>
        </div>

        <div className="w-full text-neutral-700">
          <Caption>(주) CleanB | 대표이사: 홍길동</Caption>
          <Caption>
            주소: 경기도 용인시 처인구 외대로 54번길 9 글로벌타운 B동 306호 | 이메일:
            naver@naver.com | 대표번호: xxxx-XXXX
          </Caption>
          <Caption>사업자 등록번호: XXX-XX-XXXXX | 통신판매신고번호: 2025-서울강남-xxxx</Caption>
          <Caption className="mt-2 text-gray-600">Copyright © CleanB ALL RIGHTS RESERVED</Caption>
        </div>
      </div>
    </footer>
  );
}
