"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import KBCard from "../ui/KBCard";
import type { LucideIcon } from "lucide-react";

export type KBStatCardAccent =
  | "green"
  | "gold"
  | "blue"
  | "red"
  | "purple";

interface KBStatCardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title"
  > {
  icon: LucideIcon;
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  trend?: ReactNode;
  updatedText?: ReactNode;
  accent?: KBStatCardAccent;
  loading?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

const accentStyles: Record<
  KBStatCardAccent,
  {
    iconBackground: string;
    iconColor: string;
    valueColor: string;
    trendBackground: string;
    trendColor: string;
  }
> = {
  green: {
    iconBackground: "bg-green-100",
    iconColor: "text-green-700",
    valueColor: "text-green-800",
    trendBackground: "bg-green-50",
    trendColor: "text-green-700",
  },

  gold: {
    iconBackground: "bg-amber-100",
    iconColor: "text-amber-700",
    valueColor: "text-amber-800",
    trendBackground: "bg-amber-50",
    trendColor: "text-amber-700",
  },

  blue: {
    iconBackground: "bg-blue-100",
    iconColor: "text-blue-700",
    valueColor: "text-blue-800",
    trendBackground: "bg-blue-50",
    trendColor: "text-blue-700",
  },

  red: {
    iconBackground: "bg-red-100",
    iconColor: "text-red-700",
    valueColor: "text-red-800",
    trendBackground: "bg-red-50",
    trendColor: "text-red-700",
  },

  purple: {
    iconBackground: "bg-purple-100",
    iconColor: "text-purple-700",
    valueColor: "text-purple-800",
    trendBackground: "bg-purple-50",
    trendColor: "text-purple-700",
  },
};

const KBStatCard = forwardRef<
  HTMLDivElement,
  KBStatCardProps
>(function KBStatCard(
  {
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    updatedText,
    accent = "green",
    loading = false,
    disabled = false,
    selected = false,
    onClick,
    onKeyDown,
    className = "",
    ...cardProps
  },
  ref
) {
  const isInteractive =
    Boolean(onClick);

  const accentStyle =
    accentStyles[accent];

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    onKeyDown?.(event);

    if (
      event.defaultPrevented ||
      disabled ||
      !isInteractive ||
      !onClick
    ) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  if (loading) {
    return (
      <KBCard
        ref={ref}
        loading
        padding="compact"
        className={className}
        {...cardProps}
      />
    );
  }

  return (
    <KBCard
      ref={ref}
      variant={
        isInteractive
          ? "interactive"
          : "default"
      }
      padding="compact"
      disabled={disabled}
      selected={selected}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={className}
      {...cardProps}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            accentStyle.iconBackground,
            accentStyle.iconColor,
          ].join(" ")}
        >
          <Icon
            size={20}
            aria-hidden="true"
          />
        </div>

        {trend && (
          <div
            className={[
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              accentStyle.trendBackground,
              accentStyle.trendColor,
            ].join(" ")}
          >
            {trend}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p
          className={[
            "text-2xl font-bold sm:text-3xl",
            accentStyle.valueColor,
          ].join(" ")}
        >
          {value}
        </p>

        <p className="mt-1 text-sm font-semibold text-[#2F6B3C]">
          {title}
        </p>

        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {subtitle}
          </p>
        )}

        {updatedText && (
          <p className="mt-3 text-[11px] text-gray-400">
            {updatedText}
          </p>
        )}
      </div>
    </KBCard>
  );
});

export default KBStatCard;