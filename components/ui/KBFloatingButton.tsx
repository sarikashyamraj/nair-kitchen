"use client";

import {
  Plus,
  type LucideIcon,
} from "lucide-react";

type KBFloatingButtonProps = {
  label?: string;
  onClick: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
};

export default function KBFloatingButton({
  label = "Add",
  onClick,
  icon: Icon = Plus,
  disabled = false,
  ariaLabel,
  className = "",
}: KBFloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={
        ariaLabel ?? label
      }
      className={[
        "fixed",
        "right-4",
        "z-[60]",
        "flex",
        "h-14",
        "min-w-14",
        "items-center",
        "justify-center",
        "gap-1.5",
        "rounded-full",
        "bg-[#2F6B3C]",
        "px-4",
        "font-semibold",
        "text-white",
        "shadow-[0_10px_24px_rgba(47,107,60,0.28)]",
        "transition",
        "duration-200",
        "hover:bg-[#245B32]",
        "active:scale-95",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",

        // Sit safely above the fixed
        // Kitchen Brain bottom navigation.
        "bottom-[calc(5.25rem+env(safe-area-inset-bottom))]",

        // Desktop uses page-specific actions
        // rather than the mobile FAB.
        "md:hidden",
        className,
      ].join(" ")}
    >
      <Icon
        size={22}
        strokeWidth={2.2}
      />

      {label && (
        <span className="text-sm">
          {label}
        </span>
      )}
    </button>
  );
}