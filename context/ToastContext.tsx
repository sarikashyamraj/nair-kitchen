"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import Toast from "../components/common/Toast";

type ToastType = "success" | "error" | "warning" | "info";

type ToastMessage = {
  message: string;
  type?: ToastType;
};

type ToastContextType = {
  showToast: (toast: ToastMessage) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  function showToast(toastMessage: ToastMessage) {
    setToast(toastMessage);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type || "success"}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}