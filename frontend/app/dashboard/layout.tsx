import Sidebar from "@/components/Dashboard/Sidebar";
import AuthGuard from "@/components/Login/AuthGuard";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 return (
  <AuthGuard>
    <div className="min-h-screen bg-[#f5f6fa] flex">
      <Sidebar />

      <main className="min-w-0 flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  </AuthGuard>
);
}