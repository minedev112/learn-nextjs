import Sidebar from "@/components/Dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f5f6fa] flex">
      <Sidebar />

      <main className="min-w-0 flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}