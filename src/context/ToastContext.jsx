"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ title, message, type = "info", duration = 4000 }) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, title, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    success: (message, title = "Success") => addToast({ title, message, type: "success" }),
    error: (message, title = "Error") => addToast({ title, message, type: "error" }),
    info: (message, title = "Information") => addToast({ title, message, type: "info" }),
    warning: (message, title = "Warning") => addToast({ title, message, type: "warning" }),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((item) => {
          const typeStyles = {
            success: "bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-200/40",
            error: "bg-rose-50 text-rose-800 border-rose-200 shadow-rose-200/40",
            warning: "bg-amber-50 text-amber-800 border-amber-200 shadow-amber-200/40",
            info: "bg-sky-50 text-sky-800 border-sky-200 shadow-sky-200/40",
          }[item.type] || "bg-white text-slate-800 border-slate-200";

          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
            info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
          }[item.type];

          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${typeStyles}`}
            >
              {icons}
              <div className="flex-1 min-w-0">
                {item.title && (
                  <h4 className="text-sm font-semibold tracking-tight text-slate-900 mb-0.5">
                    {item.title}
                  </h4>
                )}
                <p className="text-xs leading-relaxed text-slate-600">{item.message}</p>
              </div>
              <button
                onClick={() => removeToast(item.id)}
                className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}

