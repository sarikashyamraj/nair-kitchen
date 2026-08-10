"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void | Promise<void>;
  onCancel: () => void;

  isLoading?: boolean;
  loadingText?: string;

  requiredConfirmationText?: string;
  confirmationLabel?: string;

  details?: string[];
icon?: string;
imageSrc?: string;
showWarning?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  loadingText = "Deleting...",
  requiredConfirmationText,
  confirmationLabel,
  details = [],
icon = "🗑️",
imageSrc,
showWarning = true,
}: ConfirmModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setConfirmationInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const normalizedRequiredText =
    requiredConfirmationText?.trim().toUpperCase() ?? "";

  const normalizedInput = confirmationInput.trim().toUpperCase();

  const isConfirmationCorrect =
    !requiredConfirmationText ||
    normalizedInput === normalizedRequiredText;

  const isConfirmDisabled = isLoading || !isConfirmationCorrect;

  const handleConfirm = async () => {
    if (isConfirmDisabled) return;

    await onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-3">
          {imageSrc ? (
  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#EADCC4] bg-[#FAF8F3]">
    <Image
      src={imageSrc}
      alt=""
      fill
      sizes="48px"
      className="object-cover"
    />
  </div>
) : (
  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl">
    {icon}
  </div>
)}

          <div>
            <h2
              id="confirm-modal-title"
              className="text-2xl font-bold text-[#5A4032]"
            >
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {message}
            </p>
          </div>
        </div>

        {details.length > 0 && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="mb-2 text-sm font-semibold text-red-800">
              The following will be permanently deleted:
            </p>

            <ul className="space-y-2">
              {details.map((detail) => (
                <li
                  key={detail}
                  className="flex items-center gap-2 text-sm text-red-700"
                >
                  <span aria-hidden="true">✓</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {requiredConfirmationText && (
          <div className="mt-5">
            <label
              htmlFor="confirmation-input"
              className="block text-sm font-medium text-gray-700"
            >
              {confirmationLabel ??
                `Type ${requiredConfirmationText} to continue`}
            </label>

            <input
              id="confirmation-input"
              type="text"
              value={confirmationInput}
              onChange={(event) =>
                setConfirmationInput(event.target.value)
              }
              placeholder={requiredConfirmationText}
              disabled={isLoading}
              autoComplete="off"
              autoFocus
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            />
          </div>
        )}

        {showWarning && (
  <p className="mt-5 text-sm font-semibold text-red-600">
    This action cannot be undone.
  </p>
)}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {isLoading ? loadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}