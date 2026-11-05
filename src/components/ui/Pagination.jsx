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
  if (totalPages <= 1 && totalItems <= pageSizeOptions[0]) return null;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-3 rounded-2xl bg-white/90 backdrop-blur-md border border-sky-100 shadow-[0_2px_12px_rgba(186,230,253,0.12)] text-sm text-slate-600">
      {/* Items count & Page Size Selector */}
      <div className="flex items-center gap-3">
        <span>
          Showing <span className="font-bold text-slate-900">{startItem}</span> to{" "}
          <span className="font-bold text-slate-900">{endItem}</span> of{" "}
          <span className="font-bold text-slate-900">{totalItems}</span> records
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-slate-500 font-medium">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-sky-200 text-xs rounded-lg px-2 py-1 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center p-2 rounded-xl border border-sky-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-xl text-xs font-semibold border border-sky-200 bg-white hover:bg-sky-50 text-slate-700 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1 text-slate-400">…</span>}
          </>
        )}

        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-8 h-8 rounded-xl text-xs font-bold transition-all",
                isActive
                  ? "bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25"
                  : "border border-sky-200 bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-700"
              )}
            >
              {p}
            </button>
          );
        })}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1 text-slate-400">…</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded-xl text-xs font-semibold border border-sky-200 bg-white hover:bg-sky-50 text-slate-700 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center p-2 rounded-xl border border-sky-200 bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
