export default function DashboardLoading() {
  return (
    <div
      className="min-h-[40vh] flex items-center justify-center"
      role="status"
      aria-label="Loading dashboard"
      aria-live="polite"
    >
      <p className="text-slate-400">Loading your wellness dashboard...</p>
    </div>
  );
}
