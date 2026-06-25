import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createServerAuthClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/admin/SignOutButton";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/responses", label: "Responses" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // Public auth pages — no session required.
  const PUBLIC_PATHS = ["/admin/login", "/admin/signup", "/admin/forgot-password", "/admin/reset-password"];
  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  const supabase = await createServerAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F9FA" }}>
      {/* Brand bar */}
      <div style={{ backgroundColor: "#E8174B" }} className="text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
              Discount Centre
            </p>
            <h1 className="text-lg font-bold leading-tight">Admin Portal</h1>
          </div>
          <SignOutButton />
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-sm font-semibold border-b-2 transition-colors"
                style={{
                  color: active ? "#E8174B" : "#6b7280",
                  borderBottomColor: active ? "#E8174B" : "transparent",
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
