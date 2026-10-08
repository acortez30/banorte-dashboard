import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "@/styles/common/TablePagination.css";
import PageSizeSelect from "@/components/common/PageSizeSelect";

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;

  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;

  pageSizeOptions?: number[];
}

type PaginationItem =
  | number
  | "ellipsis-start"
  | "ellipsis-end";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "ellipsis-end",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [
    10,
    20,
    50,
    100,
  ],
}: TablePaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(
      total / pageSize,
    ),
  );

  const currentPage = Math.min(
    Math.max(
      page,
      1,
    ),
    totalPages,
  );

  const start =
    total === 0
      ? 0
      : (
          currentPage - 1
        ) *
          pageSize +
        1;

  const end = Math.min(
    currentPage * pageSize,
    total,
  );

  const paginationItems =
    getPaginationItems(
      currentPage,
      totalPages,
    );

  const handlePrevious = () => {
    if (currentPage <= 1) {
      return;
    }

    onPageChange(
      currentPage - 1,
    );
  };

  const handleNext = () => {
    if (
      currentPage >= totalPages
    ) {
      return;
    }

    onPageChange(
      currentPage + 1,
    );
  };

  const handlePageSizeChange = (
    value: number,
  ) => {
    onPageSizeChange(value);
  };

  return (
    <footer className="table-pagination">
      {/* ===================================================
          LEFT
          =================================================== */}
<PageSizeSelect
  value={pageSize}
  options={pageSizeOptions}
  onChange={handlePageSizeChange}
  label="Resultados por página"
/>

      {/* ===================================================
          RIGHT
          =================================================== */}
      <div className="table-pagination__navigation">
        <span className="table-pagination__page-status">
          Página{" "}
          <strong>
            {currentPage}
          </strong>{" "}
          de{" "}
          <strong>
            {totalPages}
          </strong>
        </span>

        <div className="table-pagination__pages">
          {/* PREVIOUS */}
          <button
            type="button"
            className="table-pagination__button table-pagination__button--arrow"
            disabled={
              currentPage <= 1
            }
            onClick={
              handlePrevious
            }
            aria-label="Página anterior"
            title="Página anterior"
          >
            <ChevronLeft
              size={16}
              strokeWidth={2}
            />
          </button>

          {/* PAGE NUMBERS */}
          <div className="table-pagination__numbers">
            {paginationItems.map(
              (item) => {
                if (
                  typeof item !==
                  "number"
                ) {
                  return (
                    <span
                      key={item}
                      className="table-pagination__ellipsis"
                    >
                      …
                    </span>
                  );
                }

                const isActive =
                  item ===
                  currentPage;

                return (
                  <button
                    key={item}
                    type="button"
                    className={`
                      table-pagination__button
                      ${
                        isActive
                          ? "table-pagination__button--active"
                          : ""
                      }
                    `}
                    onClick={() => {
                      onPageChange(
                        item,
                      );
                    }}
                    aria-label={`Ir a la página ${item}`}
                    aria-current={
                      isActive
                        ? "page"
                        : undefined
                    }
                  >
                    {item}
                  </button>
                );
              },
            )}
          </div>

          {/* NEXT */}
          <button
            type="button"
            className="table-pagination__button table-pagination__button--arrow"
            disabled={
              currentPage >=
              totalPages
            }
            onClick={
              handleNext
            }
            aria-label="Página siguiente"
            title="Página siguiente"
          >
            <ChevronRight
              size={16}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </footer>
  );
}