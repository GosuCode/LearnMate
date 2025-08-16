import { ReactNode } from "react";

interface SubjectsLayoutProps {
  children: ReactNode;
}

export default function SubjectsLayout({ children }: SubjectsLayoutProps) {
  return <>{children}</>;
}
