import { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  icon?: ReactNode;
  children: React.ReactNode;
};

export default function DashboardCard({
  title,
  icon,
  children,
}: DashboardCardProps) {
  return (
    <div className="group bg-white border border-[#EADCC4] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#F4E8D0] px-6 py-4">

        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#F4E8D0] flex items-center justify-center text-[#2F6B3C]">
            {icon}
          </div>
        )}

        <h2 className="text-xl font-semibold text-[#2F6B3C]">
          {title}
        </h2>

      </div>

      {/* Body */}
      <div className="p-6">
        {children}
      </div>

    </div>
  );
}