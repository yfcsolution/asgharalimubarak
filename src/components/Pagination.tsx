import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

function pageHref(basePath: string, page: number): string {
  if (page <= 1) return basePath;
  const separator = basePath.includes("?") ? "&" : "?";
  return `${basePath}${separator}page=${page}`;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <nav className="pagination" aria-label="Pagination">
      {prevPage ? (
        <Link href={pageHref(basePath, prevPage)} className="pagination-link" rel="prev">
          Previous
        </Link>
      ) : (
        <span className="pagination-link disabled" aria-disabled="true">
          Previous
        </span>
      )}

      <p className="pagination-status">
        Page {currentPage} of {totalPages}
      </p>

      {nextPage ? (
        <Link href={pageHref(basePath, nextPage)} className="pagination-link" rel="next">
          Next
        </Link>
      ) : (
        <span className="pagination-link disabled" aria-disabled="true">
          Next
        </span>
      )}
    </nav>
  );
}
