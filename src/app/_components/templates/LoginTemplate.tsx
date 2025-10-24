interface LoginTemplateProps {
  children: React.ReactNode;
}
export const AuthTemplate = ({ children }: LoginTemplateProps) => {
  return <div className="flex items-center justify-center h-[calc(100vh-68px)]">{children}</div>;
};
