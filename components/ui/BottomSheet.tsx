"use client";

import {
  ReactNode,
  useEffect,
} from "react";

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
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        "";
    };
  }, [
    isOpen,
    onClose,
  ]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 ${
  isOpen
    ? "visible pointer-events-auto opacity-100"
    : "invisible pointer-events-none opacity-0"
}`}
      />

      {/* Bottom Sheet */}
      <div
  className={`fixed inset-x-0 bottom-0 z-[80] flex justify-center ${
    isOpen
      ? "visible translate-y-0 transition-transform duration-300 ease-out"
      : "invisible translate-y-full"
  }`}
>
        <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
          {/* Drag Handle */}
          <div className="shrink-0 bg-white pt-3">
            <div className="mx-auto h-1.5 w-14 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="shrink-0 border-b border-[#F4E8D0] bg-white px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-[#2F6B3C] sm:text-2xl">
                  {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Review your information
                  before continuing.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-[#F4E8D0]"
              >
                ×
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}