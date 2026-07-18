export default function Loading() {
  return (
    <div className="page-wrap section">
      <div className="loading-grid" aria-busy="true" aria-live="polite">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card" />
        <p className="sr-only">Loading content…</p>
      </div>
    </div>
  );
}
