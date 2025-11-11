import { TitleH3, TitleH4 } from '../atoms/Typography';
import SidebarItem from '../molecules/SidebarItem';

interface SidebarSubItem {
  label: string;
  href: string;
}

interface SidebarSection {
  title: string;
  items: SidebarSubItem[];
}

// TODO: href 수정 필요!
const sidebarSections: SidebarSection[] = [
  {
    title: '숙소 관리',
    items: [
      { label: '소유 숙소 목록', href: '/room' },
      { label: '숙소 신규 등록', href: '/room1' },
    ],
  },
  {
    title: '청소 요청',
    items: [
      { label: '수동 청소 요청', href: '/room2' },
      { label: '자동 청소 요청', href: '/room3' },
    ],
  },
  {
    title: '작업 진행 관리',
    items: [
      { label: '작업 요청 목록', href: '/room/request' },
      { label: '검수 대기 목록', href: '/room5' },
    ],
  },
  {
    title: '프로필 및 설정',
    items: [
      { label: '계정 설정', href: '/room6' },
      { label: '리뷰 관리', href: '/room7' },
      { label: '알림 설정', href: '/room8' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-[208px] flex-shrink-0 text-left">
      <div className="mb-[36px]">
        <TitleH3 className="text-neutral-1000">마이페이지</TitleH3>
      </div>

      <div className="flex flex-col gap-[32px]">
        {sidebarSections.map(section => (
          <div key={section.title}>
            <TitleH4 className="text-neutral-1000 mb-4">{section.title}</TitleH4>
            <div className="flex flex-col gap-[8px]">
              {section.items.map(item => (
                <SidebarItem key={item.href} label={item.label} href={item.href} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
