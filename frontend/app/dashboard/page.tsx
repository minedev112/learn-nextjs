import DashboardHeader from "@/components/Dashboard/DashboardHeader";
//trang chủ dashboard
export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" />

      <div className="bg-white rounded-xl p-8 shadow">
        Welcome Dashboard
      </div>
    </>
  );
}