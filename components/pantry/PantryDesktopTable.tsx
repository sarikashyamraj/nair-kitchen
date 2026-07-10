import { PantryItem } from "../../types/pantry";

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
  return (
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
                  {item.quantity} {item.unit}
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
                    {isLowStock ? "Running Low" : "In Stock"}
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
  );
}