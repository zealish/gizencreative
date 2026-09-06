import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSiteLogo } from "@/lib/settings";
import { AdminShell } from "./_components/admin-shell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/admin/login");
  }

  const logoUrl = await getSiteLogo();

  return (
    <AdminShell
      userName={session.user.name}
      userEmail={session.user.email}
      logoUrl={logoUrl}
    >
      {children}
    </AdminShell>
  );
}
