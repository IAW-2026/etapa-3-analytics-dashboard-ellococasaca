import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

function normalizeRoles(publicMetadata: unknown): string[] {
  if (!publicMetadata || typeof publicMetadata !== "object") return [];
  const meta = publicMetadata as { roles?: unknown; role?: unknown };
  const raw = meta.roles ?? meta.role;
  if (Array.isArray(raw)) return raw.filter((r): r is string => typeof r === "string");
  if (typeof raw === "string") return [raw];
  return [];
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const roles = normalizeRoles(user?.publicMetadata);

  if (!roles.includes("admin")) {
    redirect("/unauthorized");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
