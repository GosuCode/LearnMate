import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function FlashcardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
