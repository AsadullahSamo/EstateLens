export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="20" height="20" viewBox="0 0 200 200" aria-hidden="true">
        <rect x="64" y="50" width="24" height="100" fill="currentColor" />
        <rect x="64" y="50" width="86" height="24" fill="currentColor" />
        <rect x="64" y="88" width="70" height="24" fill="currentColor" />
        <rect x="64" y="126" width="86" height="24" fill="currentColor" />
      </svg>
      <span className="font-display font-extrabold text-base tracking-tight">
        EstateLens
      </span>
    </div>
  );
}