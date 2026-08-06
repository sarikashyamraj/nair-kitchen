"use client";

type MobilePageHeaderProps = {
  title: string;
  subtitle?: string;
};

export default function MobilePageHeader({
  title,
  subtitle,
}: MobilePageHeaderProps) {
  return (
    <div className="mb-3 md:hidden">
      <h1 className="text-[22px] font-bold leading-tight text-[#245B32]">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}