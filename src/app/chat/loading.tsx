export default function ChatLoading() {
  return (
    <div
      className="min-h-[40vh] flex items-center justify-center"
      role="status"
      aria-label="Loading companion chat"
    >
      <p className="text-slate-400" aria-live="polite">
        Loading companion...
      </p>
    </div>
  );
}
