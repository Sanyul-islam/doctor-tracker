"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 10, 20, 50],
}) {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const safeTotalItems = Math.max(0, Number(totalItems) || 0);
  const safePageSize = Math.max(1, Number(pageSize) || 10);

  const safeCurrentPage = Math.min(
    Math.max(1, Number(currentPage) || 1),
    safeTotalPages,
  );

  if (safeTotalItems === 0) return null;

  const startItem = (safeCurrentPage - 1) * safePageSize + 1;
  const endItem = Math.min(safeCurrentPage * safePageSize, safeTotalItems);

  const pages = [];
  const maxButtons = 5;

  let startPage = Math.max(1, safeCurrentPage - Math.floor(maxButtons / 2));

  let endPage = Math.min(safeTotalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-3 rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 shadow-[0_2px_12px_rgba(186,230,253,0.12)] text-sm text-slate-600">
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-bold text-slate-900">{startItem}</span>{" "}
          to <span className="font-bold text-slate-900">{endItem}</span> of{" "}
          <span className="font-bold text-slate-900">{safeTotalItems}</span>{" "}
          records
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-slate-500 font-medium">
              Per page:
            </span>

            <select
              value={safePageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-sky-200 text-xs rounded-lg px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          aria-label="Previous Page"
          className="flex items-center justify-center p-2 rounded-xl border border-sky-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-xl text-xs font-semibold border border-sky-200 bg-white hover:bg-sky-50 text-slate-700"
            >
              1
            </button>

            {startPage > 2 && <span className="px-1 text-slate-400">…</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === safeCurrentPage ? "page" : undefined}
            className={cn(
              "w-8 h-8 rounded-xl text-xs font-bold transition-all",
              page === safeCurrentPage
                ? "bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25"
                : "border border-sky-200 bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-700",
            )}
          >
            {page}
          </button>
        ))}

        {endPage < safeTotalPages && (
          <>
            {endPage < safeTotalPages - 1 && (
              <span className="px-1 text-slate-400">…</span>
            )}

            <button
              onClick={() => onPageChange(safeTotalPages)}
              className="w-8 h-8 rounded-xl text-xs font-semibold border border-sky-200 bg-white hover:bg-sky-50 text-slate-700"
            >
              {safeTotalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= safeTotalPages}
          aria-label="Next Page"
          className="flex items-center justify-center p-2 rounded-xl border border-sky-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
