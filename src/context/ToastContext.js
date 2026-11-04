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
            success: "bg-emerald-950/90 text-emerald-200 border-emerald-800 shadow-emerald-950/40",
            error: "bg-rose-950/90 text-rose-200 border-rose-800 shadow-rose-950/40",
            warning: "bg-amber-950/90 text-amber-200 border-amber-800 shadow-amber-950/40",
            info: "bg-sky-950/90 text-sky-200 border-sky-800 shadow-sky-950/40",
          }[item.type] || "bg-slate-900/90 text-slate-200 border-slate-700";

          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
            info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
          }[item.type];

          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${typeStyles}`}
            >
              {icons}
              <div className="flex-1 min-w-0">
                {item.title && (
                  <h4 className="text-sm font-semibold tracking-tight text-white mb-0.5">
                    {item.title}
                  </h4>
                )}
                <p className="text-xs leading-relaxed text-slate-300">{item.message}</p>
              </div>
              <button
                onClick={() => removeToast(item.id)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg"
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

