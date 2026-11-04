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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!isLoading}>
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            variant === "danger"
              ? "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
              : "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
          }`}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
          {title}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 w-full">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-50 ${
              variant === "danger"
                ? "bg-rose-600 hover:bg-rose-700 active:bg-rose-800 shadow-sm shadow-rose-600/30"
                : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

