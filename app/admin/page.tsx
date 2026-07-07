import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/admin-auth";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

export const metadata = {
  title: "Verwaltung — staffontime",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = await verifyAdminSessionToken(token);

  if (!authenticated) {
    return (
      <div lang="de">
        <AdminLogin />
      </div>
    );
  }

  return (
    <div lang="de">
      <AdminDashboard />
    </div>
  );
}
