import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
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

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const supabase = createServerClient();
  const accessToken = allCookies.find((c) => c.name.includes("access-token"))?.value;

  if (!accessToken) {
    redirect("/admin/login");
  }

  const { data: { user } } = await supabase.auth.getUser(accessToken);
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
