interface RequestTemplateProps {
  children: React.ReactNode;
}
export const RequestTemplate = ({ children }: RequestTemplateProps) => {
  return (
    <div className="flex h-full w-full py-[40px] md:py-[60px] lg:py-[80px] px-[24px] lg:px-[128px]">
      {children}
    </div>
  );
};
