import type { ReactNode } from "react";

interface KBSectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function KBSectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = "",
}: KBSectionHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 ${className}`}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-sm font-semibold text-[#C9872F]">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 text-xl font-bold text-[#2F6B3C] sm:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}