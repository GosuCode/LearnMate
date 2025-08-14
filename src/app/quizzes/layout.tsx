import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function QuizzesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
