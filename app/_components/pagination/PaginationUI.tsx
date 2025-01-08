import React, { useState } from "react";
import {
  BsChevronRight,
  BsChevronBarRight,
  BsChevronLeft,
  BsChevronBarLeft,
} from "react-icons/bs";

interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

const PaginationUI: React.FC<PaginationProps> = ({
  totalPages,
  currentPage = 1,
  onPageChange,
}) => {
  const [activePage, setActivePage] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setActivePage(page);
    onPageChange(page);
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const start = Math.max(activePage - 1, 1);
    const end = Math.min(activePage + 1, totalPages);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return [
      ...new Set([
        1,
        ...pages,
        totalPages > activePage + 1 ? "........." : null,
        totalPages,
      ]),
    ].filter(Boolean) as (number | string)[];
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {/* First Page */}
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        onClick={() => handlePageChange(1)}
        disabled={activePage === 1}
      >
        <BsChevronBarLeft />
      </button>

      {/* Previous Page */}
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        onClick={() => handlePageChange(activePage - 1)}
        disabled={activePage === 1}
      >
        <BsChevronLeft />
      </button>

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            className={`p-2 rounded ${
              page === activePage
                ? "bg-primary75 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="p-2 text-gray-500 ">
            {page}
          </span>
        )
      )}

      {/* Next Page */}
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        onClick={() => handlePageChange(activePage + 1)}
        disabled={activePage === totalPages}
      >
        <BsChevronRight />
      </button>

      {/* Last Page */}
      <button
        className="p-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        onClick={() => handlePageChange(totalPages)}
        disabled={activePage === totalPages}
      >
        <BsChevronBarRight />
      </button>
    </div>
  );
};

export default PaginationUI;
