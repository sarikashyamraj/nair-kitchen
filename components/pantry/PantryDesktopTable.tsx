import { PantryItem } from "../../types/pantry";

import {
  getPantryStatusClasses,
  getPantryStatusLabel,
  getPantryStockStatus,
} from "../../lib/pantry/pantryStatus";

type PantryDesktopTableProps = {
  items: PantryItem[];
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
};

export default function PantryDesktopTable({
  items,
  onEdit,
  onDelete,
}: PantryDesktopTableProps) {
  if (items.length === 0) {
    return (
      <div className="hidden rounded-2xl border border-[#EADCC4] bg-white p-8 text-center shadow-sm md:block">
        <div
          aria-hidden="true"
          className="text-3xl"
        >
          🔎
        </div>

        <p className="mt-3 font-semibold text-[#2F6B3C]">
          No Items found
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Try changing your search term or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-[#EADCC4] bg-white shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left">
          <thead className="bg-[#F4E8D0] text-[#5A4032]">
            <tr>
              <th className="px-4 py-4">
                Item
              </th>

              <th className="px-4 py-4">
                Current Stock
              </th>

              <th className="px-4 py-4">
                Minimum
              </th>

              <th className="px-4 py-4">
                Category
              </th>

              <th className="px-4 py-4">
                Status
              </th>

              <th className="px-4 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const status =
                getPantryStockStatus(item);

              const statusLabel =
                getPantryStatusLabel(status);

              const statusClasses =
                getPantryStatusClasses(status);

              return (
                <tr
                  key={item.id}
                  className="border-t border-[#F4E8D0] transition hover:bg-[#FAF8F3]"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold text-[#2F6B3C]">
                        {item.name}
                      </p>

                      {item.notes && (
                        <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 font-semibold text-[#5A4032]">
                    {item.quantity}{" "}
                    {item.unit}
                  </td>

                  <td className="px-4 py-4 text-[#5A4032]">
                    {item.minQuantity}{" "}
                    {item.unit}
                  </td>

                  <td className="px-4 py-4 text-[#5A4032]">
                    {item.category}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses.badge}`}
                    >
                      {statusLabel}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(item)
                        }
                        className="rounded-lg px-2 py-1 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-800"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(item.id)
                        }
                        className="rounded-lg px-2 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-800"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}