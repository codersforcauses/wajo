import { PaginationProps } from "@/types/question";

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  className,
}: PaginationProps) {
  const siblings = 1;

  const getPaginationItems = () => {
    const items: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show the first page
      items.push(1);

      // Case for the first page
      if (currentPage === 1) {
        items.push(2, 3, "...");
        items.push(totalPages);
      }
      // Case for the last page
      else if (currentPage === totalPages) {
        items.push("...", totalPages - 2, totalPages - 1);
        items.push(totalPages);
      }
      // Case for pages in between
      else {
        if (currentPage > siblings + 2) {
          items.push("...");
        }

        const start = Math.max(2, currentPage - siblings);
        const end = Math.min(totalPages - 1, currentPage + siblings);

        for (let i = start; i <= end; i++) {
          items.push(i);
        }

        if (currentPage < totalPages - siblings - 1) {
          items.push("...");
        }

        items.push(totalPages);
      }
    }

    return items;
  };

  const paginationItems = getPaginationItems();

  return (
    <nav className={`${className}`} aria-label="Pagination">
      <ul className="inline-flex space-x-1">
        <li>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`flex h-7 w-24 items-center justify-center rounded-lg border bg-yellow ${
              currentPage === 1
                ? "cursor-not-allowed bg-gray-300 text-gray-400"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 4L9 11L4.5 7.5L9 4Z" fill="currentColor"></path>
            </svg>
            <span>Previous</span>
          </button>
        </li>

        {paginationItems.map((item, index) =>
          typeof item === "number" ? (
            <li key={index}>
              <button
                onClick={() => onPageChange(item)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                  currentPage === item
                    ? "bg-yellow text-black"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {item}
              </button>
            </li>
          ) : (
            <li
              key={index}
              className="flex items-center justify-center text-xs text-gray-500"
            >
              {item}
            </li>
          ),
        )}

        <li>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`flex h-7 w-24 items-center justify-center rounded-lg border bg-yellow ${
              currentPage === totalPages
                ? "cursor-not-allowed bg-gray-300 text-gray-400"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
          >
            <span>Next</span>
            <svg
              className="h-4 w-4"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 11L6 4L10.5 7.5L6 11Z" fill="currentColor"></path>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
