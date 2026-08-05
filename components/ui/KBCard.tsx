"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  KBAnimation,
  KBColors,
  KBRadius,
  KBShadows,
  KBSpacing,
} from "../../styles/tokens";

export type KBCardVariant =
  | "default"
  | "outlined"
  | "elevated"
  | "interactive";

export type KBCardPadding =
  | "compact"
  | "comfortable"
  | "spacious";

interface KBCardProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title"
  > {
  children?: ReactNode;

  image?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;

  actions?: ReactNode;
  footer?: ReactNode;

  variant?: KBCardVariant;
  padding?: KBCardPadding;

  loading?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

const paddingClasses: Record<
  KBCardPadding,
  string
> = {
  compact: "p-4",
  comfortable: "p-5 sm:p-6",
  spacious: "p-6 sm:p-8",
};

const variantStyles: Record<
  KBCardVariant,
  React.CSSProperties
> = {
  default: {
    backgroundColor: KBColors.surface,
    borderColor: KBColors.border,
    boxShadow: KBShadows.card,
  },

  outlined: {
    backgroundColor: KBColors.surface,
    borderColor: KBColors.border,
    boxShadow: "none",
  },

  elevated: {
    backgroundColor: KBColors.surface,
    borderColor: KBColors.border,
    boxShadow: KBShadows.elevated,
  },

  interactive: {
    backgroundColor: KBColors.surface,
    borderColor: KBColors.border,
    boxShadow: KBShadows.card,
  },
};

const KBCard = forwardRef<
  HTMLDivElement,
  KBCardProps
>(function KBCard(
  {
    children,
    image,
    icon,
    title,
    subtitle,
    badge,
    actions,
    footer,

    variant = "default",
    padding = "comfortable",

    loading = false,
    disabled = false,
    selected = false,

    onClick,
    onKeyDown,
    className = "",
    style,

    ...cardProps
  },
  ref
) {
  const isInteractive =
    variant === "interactive" ||
    Boolean(onClick);

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
      <div
        ref={ref}
        aria-busy="true"
        className={[
          "w-full animate-pulse overflow-hidden rounded-2xl border",
          paddingClasses[padding],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          backgroundColor: KBColors.surface,
          borderColor: KBColors.border,
          boxShadow: KBShadows.card,
          ...style,
        }}
        {...cardProps}
      >
        <div className="space-y-4">
          <div className="h-5 w-2/5 rounded-lg bg-gray-200" />
          <div className="h-4 w-3/5 rounded-lg bg-gray-200" />

          <div className="space-y-3 pt-2">
            <div className="h-4 w-full rounded-lg bg-gray-200" />
            <div className="h-4 w-5/6 rounded-lg bg-gray-200" />
            <div className="h-4 w-4/6 rounded-lg bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  const hasHeader =
    Boolean(icon) ||
    Boolean(title) ||
    Boolean(subtitle) ||
    Boolean(badge);

  return (
    <div
      ref={ref}
      role={
        isInteractive
          ? "button"
          : undefined
      }
      tabIndex={
        isInteractive && !disabled
          ? 0
          : undefined
      }
      aria-disabled={
        isInteractive
          ? disabled
          : undefined
      }
      onClick={
        disabled
          ? undefined
          : onClick
      }
      onKeyDown={handleKeyDown}
      className={[
        "w-full overflow-hidden border outline-none",
        "focus-visible:ring-2 focus-visible:ring-[#2F6B3C] focus-visible:ring-offset-2",
        paddingClasses[padding],

        isInteractive && !disabled
          ? "cursor-pointer motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-lg motion-safe:active:translate-y-0"
          : "",

        disabled
          ? "cursor-not-allowed opacity-60"
          : "",

        selected
          ? "ring-2 ring-[#2F6B3C] ring-offset-2"
          : "",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        borderRadius: `${KBRadius.lg}px`,
        transition: [
          `transform ${KBAnimation.fast} ${KBAnimation.easing}`,
          `box-shadow ${KBAnimation.normal} ${KBAnimation.easing}`,
          `border-color ${KBAnimation.normal} ${KBAnimation.easing}`,
          `opacity ${KBAnimation.fast} ${KBAnimation.easing}`,
        ].join(", "),
        ...variantStyles[variant],
        ...style,
      }}
      {...cardProps}
    >
      {image && (
        <div className="-mx-5 -mt-5 mb-5 overflow-hidden sm:-mx-6 sm:-mt-6">
          {image}
        </div>
      )}

      {hasHeader && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF5EC] text-[#2F6B3C]">
                {icon}
              </div>
            )}

            <div className="min-w-0">
              {title && (
                <div className="truncate text-lg font-bold text-[#2F6B3C]">
                  {title}
                </div>
              )}

              {subtitle && (
                <div className="mt-1 text-sm leading-6 text-gray-500">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {badge && (
            <div className="shrink-0">
              {badge}
            </div>
          )}
        </div>
      )}

      {children && (
        <div
          className={
            hasHeader
              ? "mt-5"
              : ""
          }
        >
          {children}
        </div>
      )}

      {actions && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}

      {footer && (
        <div className="mt-5 border-t border-[#E8DDC7] pt-4 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </div>
  );
});

export default KBCard;