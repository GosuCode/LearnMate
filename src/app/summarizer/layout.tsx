import { ReactNode } from "react";

interface SummarizerLayoutProps {
  children: ReactNode;
}

export default function SummarizerLayout({ children }: SummarizerLayoutProps) {
  return <>{children}</>;
}
