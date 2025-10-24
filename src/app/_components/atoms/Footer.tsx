'use client';

import Image from 'next/image';
import Logo from '@/assets/svg/RowLogo.svg';

export default function Footer() {
  return (
    <div className="w-full px-[36px] py-[24px] bg-white border-t border-gray-200">
      <div className="flex flex-col lg:flex-col justify-between items-start lg:items-center gap-6">
        <div className="flex justify-between items-center w-full">
          <Image src={Logo} alt="RoomiClean Logo" />

          <div className="flex gap-6 lg:gap-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              서비스 정책
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              개인정보처리방침
            </a>
          </div>
        </div>

        <div className="text-gray-700 text-sm leading-relaxed w-full">
          <div>(주) CleanB | 대표이사: 홍길동</div>
          <div>
            주소: 경기도 용인시 처인구 외대로 54번길 9 글로벌타운 B동 306호 | 이메일:
            naver@naver.com | 대표번호: xxxx-XXXX
          </div>
          <div>사업자 등록번호: XXX-XX-XXXXX | 통신판매신고번호: 2025-서울강남-xxxx</div>
          <div className="text-gray-600 mt-2">Copyright © CleanB ALL RIGHTS RESERVED</div>
        </div>
      </div>
    </div>
  );
}
