"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
} from "lucide-react";

import {
  INGREDIENT_CATEGORIES,
} from "../../constants/categories";

type InventoryCategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

export default function InventoryCategorySelect({
  value,
  onChange,
  label = "Category",
}: InventoryCategorySelectProps) {
  const [isOpen, setIsOpen] =
    useState(false);

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
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  function handleSelect(
    category: string
  ) {
    onChange(category);
    setIsOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="relative space-y-2"
    >
      {label && (
        <label className="block text-sm font-medium text-[#5A4032]">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() =>
          setIsOpen(
            (current) => !current
          )
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-left text-[#5A4032] shadow-sm transition-all duration-200 focus:border-[#2F6B3C] focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
      >
        <span className="truncate">
          {value}
        </span>

        <ChevronDown
          size={17}
          className={`shrink-0 text-gray-500 transition-transform ${
            isOpen
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute bottom-full left-0 z-[200] mb-2 max-h-56 w-full overflow-y-auto overscroll-contain rounded-xl border border-[#EADCC4] bg-white p-1 shadow-xl"
        >
          {INGREDIENT_CATEGORIES.map(
            (category) => {
              const isSelected =
                category === value;

              return (
                <button
                  key={category}
                  type="button"
                  role="option"
                  aria-selected={
                    isSelected
                  }
                  onClick={() =>
                    handleSelect(
                      category
                    )
                  }
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "bg-[#EEF7F0] font-semibold text-[#245B32]"
                      : "text-[#5A4032] hover:bg-[#FAF8F3]"
                  }`}
                >
                  <span>
                    {category}
                  </span>

                  {isSelected && (
                    <Check
                      size={16}
                      className="shrink-0 text-[#2F6B3C]"
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