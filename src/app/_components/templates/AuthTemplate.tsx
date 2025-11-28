interface AuthTemplateProps {
  children: React.ReactNode;
}
export const AuthTemplate = ({ children }: AuthTemplateProps) => {
  return <div className="flex justify-center items-center h-full w-full">{children}</div>;
};
