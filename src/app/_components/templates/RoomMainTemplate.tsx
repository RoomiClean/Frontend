interface RoomMainTemplateProps {
  children: React.ReactNode;
}

export default function RoomMainTemplate({ children }: RoomMainTemplateProps) {
  return (
    <main className="mx-auto w-full max-w-[1040px] space-y-10 px-4 md:px-6 py-8">{children}</main>
  );
}
