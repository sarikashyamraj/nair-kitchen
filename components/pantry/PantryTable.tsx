import { PantryItem } from "../../types/pantry";

type PantryTableProps = {
  items: PantryItem[];
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
};

export default function PantryTable({
  items,
  onEdit,
  onDelete,
}: PantryTableProps) {
  return (
    <>
      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {items.map((item) => {
          const isLowStock = item.quantity <= item.minQuantity;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#EADCC4] p-5 shadow-sm"
            >
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#2F6B3C]">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.category}
                  </p>
                </div>

                <span
                  className={`h-fit rounded-full px-3 py-1 text-xs font-medium ${
                    isLowStock
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isLowStock ? "Low Stock" : "Good"}
                </span>
              </div>

              

              <div className="flex gap-3 mt-5 border-t border-[#F4E8D0] pt-4">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2 text-sm font-medium text-blue-700"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => onDelete(item.id)}
                  className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-medium text-red-700"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F4E8D0] text-[#5A4032]">
            <tr>
              <th className="p-4">Ingredient</th>
              <th className="p-4">Current</th>
              <th className="p-4">Minimum</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const isLowStock = item.quantity <= item.minQuantity;

              return (
                <tr key={item.id} className="border-t border-[#F4E8D0]">
                  <td className="p-4 font-medium text-[#5A4032]">
                    {item.name}
                  </td>

                  

                  <td className="p-4 text-[#5A4032]">
                    {item.minQuantity} {item.unit}
                  </td>

                  <td className="p-4 text-[#5A4032]">{item.category}</td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        isLowStock
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isLowStock ? "Low Stock" : "Good"}
                    </span>
                  </td>

                  

                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}