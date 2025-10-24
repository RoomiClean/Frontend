interface FindInfoTemplateProps {
  children: React.ReactNode;
}
export const FindInfoTemplate = ({ children }: FindInfoTemplateProps) => {
  return <div className="flex justify-center pt-[100px]">{children}</div>;
};
