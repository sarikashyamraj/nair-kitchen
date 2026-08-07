"use client";

import {
  ChevronDown,
  Check,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type Option = {
  label: string;
  value: string;
};

type KBDropdownProps = {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function KBDropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "Select",
}: KBDropdownProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
  }, []);

  const selected =
    options.find(
      (option) =>
        option.value === value
    );

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      {label && (
        <label className="mb-2 block text-sm font-semibold text-[#5A4032]">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="flex w-full items-center justify-between rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-left shadow-sm transition hover:border-[#2F6B3C]"
      >
        <span className="truncate text-sm font-medium text-[#5A4032]">
          {selected?.label ??
            placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`transition ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-[#EADCC4] bg-white shadow-xl">
          {options.map(
            (option) => {
              const isSelected =
                option.value ===
                value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(
                      option.value
                    );
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${
                    isSelected
                      ? "bg-[#EEF7F0] text-[#2F6B3C]"
                      : "hover:bg-[#FAF8F3]"
                  }`}
                >
                  <span>
                    {
                      option.label
                    }
                  </span>

                  {isSelected && (
                    <Check
                      size={16}
                    />
                  )}
                </button>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}