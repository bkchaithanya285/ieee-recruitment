"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { FiX, FiCheckCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-slide-in ${
              toast.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
                : toast.type === "error"
                ? "bg-rose-950/80 border-rose-500/30 text-rose-200"
                : toast.type === "warning"
                ? "bg-amber-950/80 border-amber-500/30 text-amber-200"
                : "bg-blue-950/80 border-blue-500/30 text-blue-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              {toast.type === "success" && <FiCheckCircle className="text-emerald-400 shrink-0" size={20} />}
              {toast.type === "error" && <FiAlertTriangle className="text-rose-400 shrink-0" size={20} />}
              {toast.type === "warning" && <FiAlertTriangle className="text-amber-400 shrink-0" size={20} />}
              {toast.type === "info" && <FiInfo className="text-blue-400 shrink-0" size={20} />}
              <span className="text-sm font-medium leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors ml-4 p-1 rounded-md hover:bg-white/5"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
