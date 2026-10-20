import AutoLogoutGuard from "@/components/AutoLogoutGuard";
import DashboardShell from "./DashboardShell";
import { getSessionUser } from "@/lib/getSessionUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session) return null;

  return (
    <DashboardShell role={session.role}>
      <AutoLogoutGuard />
      {children}
    </DashboardShell>
  );
}
