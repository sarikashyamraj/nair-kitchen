"use client";

type MobileListCardProps = {
  title: string;
  subtitle: string;
  status: string;
  statusType?: "good" | "warning" | "danger";
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function MobileListCard({
  title,
  subtitle,
  status,
  statusType = "good",
  onEdit,
  onDelete,
}: MobileListCardProps) {
  const badgeColor =
    statusType === "warning"
      ? "bg-yellow-100 text-yellow-700"
      : statusType === "danger"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-white rounded-2xl border border-[#EADCC4] shadow-sm p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-[#2F6B3C] truncate">
          {title}
        </h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${badgeColor}`}
        >
          {status}
        </span>
      </div>

      {/* Subtitle */}
      <p className="mt-2 text-sm text-gray-500">
        {subtitle}
      </p>

      {/* Divider */}
      <div className="border-t border-[#F4E8D0] my-4" />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onEdit}
          className="rounded-lg px-3 py-2 text-blue-700 hover:bg-blue-50 transition"
        >
          ✏️ Edit
        </button>

        <button
          onClick={onDelete}
          className="rounded-lg px-3 py-2 text-red-700 hover:bg-red-50 transition"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}