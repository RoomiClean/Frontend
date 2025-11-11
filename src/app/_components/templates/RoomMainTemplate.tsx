import Sidebar from '../organisms/Sidebar';

interface RoomMainTemplateProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function RoomMainTemplate({ children, showSidebar = true }: RoomMainTemplateProps) {
  return (
    <div className="mx-auto w-full px-4 md:px-6 lg:px-[36px] py-8 md:py-[60px] lg:py-20">
      {showSidebar ? (
        <div className="flex gap-12">
          <Sidebar />
          <main className="flex-1 min-w-0 space-y-10">{children}</main>
        </div>
      ) : (
        <main className="w-full space-y-10">{children}</main>
      )}
    </div>
  );
}
