export default function JournalLoading() {
  return (
    <div
      className="min-h-[40vh] flex items-center justify-center"
      role="status"
      aria-label="Loading journal"
    >
      <p className="text-slate-400" aria-live="polite">
        Loading journal...
      </p>
    </div>
  );
}
