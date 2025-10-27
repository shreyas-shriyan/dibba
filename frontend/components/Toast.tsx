import { useState, useEffect, useContext } from "preact/hooks";
import { createContext } from "preact";
import { JSX } from "preact";

interface ToastContextType {
  addToast: (message: string, type?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
  addToast: (message: string, type = "info", duration = 3000) => {},
});

const Toast = ({ message, type = "info", duration = 3000, onClose }: {
  message: string;
  type?: string;
  duration?: number;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      class={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${styles[type]} animate-slide-in`}
    >
      <span class="text-lg font-bold">{icons[type]}</span>
      <p class="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: JSX.Element }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message: string, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  addToast: (message: string, type?: string, duration?: number) => void;
} => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const success = (message: string, duration = 3000) => context.addToast(message, "success", duration);
  const error = (message: string, duration = 3000) => context.addToast(message, "error", duration);
  const warning = (message: string, duration = 3000) => context.addToast(message, "warning", duration);
  const info = (message: string, duration = 3000) => context.addToast(message, "info", duration);

  return {
    success,
    error,
    warning,
    info,
    addToast: context.addToast,
  };
};
