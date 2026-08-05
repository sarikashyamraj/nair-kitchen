import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

type KBCardPadding = "none" | "small" | "medium" | "large";

interface KBCardProps<T extends ElementType = "section"> {
  as?: T;
  children: ReactNode;
  className?: string;
  padding?: KBCardPadding;
  interactive?: boolean;
}

const paddingClasses: Record<KBCardPadding, string> = {
  none: "",
  small: "p-3 sm:p-4",
  medium: "p-4 sm:p-6",
  large: "p-5 sm:p-8",
};

export default function KBCard<T extends ElementType = "section">({
  as,
  children,
  className = "",
  padding = "medium",
  interactive = false,
  ...rest
}: KBCardProps<T> &
  Omit<
    ComponentPropsWithoutRef<T>,
    keyof KBCardProps<T>
  >) {
  const Component = as || "section";

  const interactiveClasses = interactive
    ? "transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    : "";

  return (
    <Component
      className={[
        "rounded-3xl border border-[#EADCC4]",
        "bg-white shadow-sm",
        paddingClasses[padding],
        interactiveClasses,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Component>
  );
}