"use client";

import { ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type KBBadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
};

const variantClasses = {
  success:
    "bg-green-100 text-green-700 border-green-200",

  warning:
    "bg-yellow-100 text-yellow-700 border-yellow-200",

  danger:
    "bg-red-100 text-red-700 border-red-200",

  info:
    "bg-blue-100 text-blue-700 border-blue-200",

  neutral:
    "bg-gray-100 text-gray-700 border-gray-200",
};

const sizeClasses = {
  sm: "px-2 py-1 text-[11px]",

  md: "px-3 py-1.5 text-xs",
};

export default function KBBadge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}: KBBadgeProps) {
  return (
    <span
      className={[
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-full",
        "border",
        "font-semibold",
        "whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}