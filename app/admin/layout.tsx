import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the anon client with the cookie-based session for auth checks
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Build a minimal auth check using the service client
  const supabase = createServerClient();
  const accessToken = allCookies.find((c) => c.name.includes("access-token"))?.value;

  if (!accessToken) {
    redirect("/admin/login");
  }

  const { data: { user } } = await supabase.auth.getUser(accessToken);
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg">QR Review Admin</h1>
        <div className="flex gap-4 text-sm">
          <a href="/admin" className="text-gray-600 hover:text-black">Dashboard</a>
          <a href="/admin/responses" className="text-gray-600 hover:text-black">Responses</a>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
