"use client";

import {
  Plus,
  ScanBarcode,
} from "lucide-react";

type MobileFABProps = {
  label?: string;
  onClick: () => void;

  showScan?: boolean;
  onScan?: () => void;
};

export default function MobileFAB({
  label = "Add",
  onClick,
  showScan = false,
  onScan,
}: MobileFABProps) {
  return (
    <div className="fixed bottom-[72px] right-5 z-40 flex items-center gap-2 md:hidden">
      {/* Primary Add Action */}
      <button
        type="button"
        onClick={onClick}
        className="flex min-h-[52px] items-center gap-2 rounded-full bg-[#2F6B3C] px-5 text-white shadow-lg transition hover:bg-[#24552F] active:scale-[0.97]"
      >
        <Plus
          size={21}
          strokeWidth={2}
        />

        <span className="font-semibold">
          {label}
        </span>
      </button>

      {/* Barcode Scan */}
      {showScan && (
        <button
          type="button"
          onClick={onScan}
          aria-label="Scan barcode"
          title="Scan barcode"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#E8C987] bg-[#D89B3C] text-white shadow-lg transition hover:bg-[#C8892E] active:scale-95"
        >
          <ScanBarcode
            size={21}
            strokeWidth={1.9}
          />
        </button>
      )}
    </div>
  );
}