"use client";

import { ReactNode, useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({
  isOpen,
  title,
  onClose,
  children,
}: BottomSheetProps) {
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
          isOpen
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >
        <div className="mx-auto max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl">

          {/* Drag Handle */}
          <div className="flex justify-center pt-3">
            <div className="h-1.5 w-14 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="border-b border-[#F4E8D0] px-6 py-5">
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-[#2F6B3C]">
                  {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review your information before continuing.
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-full p-2 transition hover:bg-[#F4E8D0]"
              >
                ✕
              </button>

            </div>
          </div>

          {/* Content */}
          <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}