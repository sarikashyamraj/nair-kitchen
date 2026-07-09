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
    <div className="md:hidden mb-5">
      <h1 className="text-2xl font-bold text-[#2F6B3C]">
        {title}
      </h1>

      {subtitle && (
        <p className="text-gray-500 mt-1">
          {subtitle}
        </p>
      )}

      <div className="border-b border-[#EADCC4] mt-4" />
    </div>
  );
}