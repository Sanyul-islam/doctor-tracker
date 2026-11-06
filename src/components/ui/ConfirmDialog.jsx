"use client";

import React from "react";
import { Modal } from "./Modal";
import { AlertTriangle, Loader2 } from "lucide-react";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. Are you sure you want to proceed?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "danger",
}) {
  const isDanger = variant === "danger";

  return (
    <Modal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      size="sm"
      showCloseButton={!isLoading}
    >
      <div className="flex flex-col items-center text-center p-2 sm:p-3">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
            isDanger
              ? "bg-rose-50 text-rose-600 border border-rose-100"
              : "bg-amber-50 text-amber-600 border border-amber-100"
          } dark:border-transparent ${
            isDanger
              ? "dark:bg-rose-950/50 dark:text-rose-400"
              : "dark:bg-amber-950/50 dark:text-amber-400"
          }`}
        >
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Content */}
        <h4 className="text-base font-semibold text-slate-900 mb-2">
          {title}
        </h4>

        <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-7">
          {message}
        </p>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isDanger
                ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-rose-600/20"
                : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-indigo-600/20"
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
