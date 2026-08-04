"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  KBAnimation,
  KBColors,
  KBRadius,
  KBShadows,
  KBSpacing,
  KBTypography,
} from "../../styles/tokens";

export type KBButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "ghost";

export type KBButtonSize =
  | "sm"
  | "md"
  | "lg";

interface KBButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: KBButtonVariant;
  size?: KBButtonSize;
  loading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantStyles: Record<
  KBButtonVariant,
  CSSProperties
> = {
  primary: {
    backgroundColor: KBColors.primary,
    color: KBColors.text.white,
    borderColor: KBColors.primary,
  },

  secondary: {
    backgroundColor: KBColors.secondaryLight,
    color: KBColors.text.primary,
    borderColor: KBColors.border,
  },

  success: {
    backgroundColor: KBColors.success,
    color: KBColors.text.white,
    borderColor: KBColors.success,
  },

  danger: {
    backgroundColor: KBColors.error,
    color: KBColors.text.white,
    borderColor: KBColors.error,
  },

  warning: {
    backgroundColor: KBColors.warning,
    color: KBColors.text.white,
    borderColor: KBColors.warning,
  },

  ghost: {
    backgroundColor: "transparent",
    color: KBColors.primary,
    borderColor: "transparent",
    boxShadow: "none",
  },
};

const sizeStyles: Record<
  KBButtonSize,
  CSSProperties
> = {
  sm: {
    minHeight: "36px",
    padding: `${KBSpacing.sm}px ${KBSpacing.md}px`,
    fontSize: KBTypography.caption.size,
  },

  md: {
    minHeight: "44px",
    padding: `${KBSpacing.sm}px ${KBSpacing.lg}px`,
    fontSize: KBTypography.body.size,
  },

  lg: {
    minHeight: "52px",
    padding: `${KBSpacing.md}px ${KBSpacing.xl}px`,
    fontSize: KBTypography.body.size,
  },
};

const KBButton = forwardRef<
  HTMLButtonElement,
  KBButtonProps
>(function KBButton(
  {
    children,
    variant = "primary",
    size = "md",
    loading = false,
    loadingText,
    icon,
    iconPosition = "left",
    fullWidth = false,
    disabled = false,
    className = "",
    style,
    type = "button",
    ...buttonProps
  },
  ref
) {
  const isDisabled =
    disabled || loading;

  const buttonStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: `${KBSpacing.sm}px`,
    width: fullWidth
      ? "100%"
      : undefined,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: `${KBRadius.md}px`,
    boxShadow:
      variant === "ghost"
        ? "none"
        : KBShadows.card,
    fontWeight:
      KBTypography.label.weight,
    lineHeight: 1.2,
    cursor: isDisabled
      ? "not-allowed"
      : "pointer",
    opacity: isDisabled
      ? 0.6
      : 1,
    transition: [
      `transform ${KBAnimation.fast} ${KBAnimation.easing}`,
      `opacity ${KBAnimation.fast} ${KBAnimation.easing}`,
      `box-shadow ${KBAnimation.normal} ${KBAnimation.easing}`,
    ].join(", "),
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      style={buttonStyle}
      className={[
        "select-none",
        "outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-offset-2",
        "active:scale-[0.98]",
        "hover:opacity-90",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...buttonProps}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          />

          <span>
            {loadingText ??
              "Please wait..."}
          </span>
        </>
      ) : (
        <>
          {icon &&
            iconPosition === "left" && (
              <span
                aria-hidden="true"
                className="inline-flex shrink-0 items-center justify-center"
              >
                {icon}
              </span>
            )}

          <span>{children}</span>

          {icon &&
            iconPosition === "right" && (
              <span
                aria-hidden="true"
                className="inline-flex shrink-0 items-center justify-center"
              >
                {icon}
              </span>
            )}
        </>
      )}
    </button>
  );
});

export default KBButton;