'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BodyDefault } from '../atoms/Typography';

interface SidebarItemProps {
  label: string;
  href: string;
}

export default function SidebarItem({ label, href }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/mypage' && pathname.startsWith(`${href}/`));

  return (
    <Link href={href}>
      <BodyDefault
        className={`transition-all ${
          isActive
            ? 'font-medium text-neutral-1000'
            : 'text-neutral-600 hover:font-medium hover:text-neutral-1000'
        }`}
      >
        {label}
      </BodyDefault>
    </Link>
  );
}
