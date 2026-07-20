type SnapshotNoticeProps = {
  message?: string;
};

export function SnapshotNotice({
  message = "Showing the latest saved edition.",
}: SnapshotNoticeProps) {
  return (
    <p className="snapshot-notice" role="status">
      {message}
    </p>
  );
}
