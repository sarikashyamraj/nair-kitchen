import { PantryItem } from "../../types/pantry";

type PantryAlertsProps = {
  items: PantryItem[];
};

export default function PantryAlerts({ items }: PantryAlertsProps) {
  const lowStockItems = items.filter((item) => {
    const minimum = item.minQuantity ?? item.minQuantity ?? 1;
    return item.quantity <= minimum;
  });

  if (lowStockItems.length === 0) {
    return (
      <div className="mb-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-700">
        ✅ Pantry looks good. No low stock items.
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
      <h3 className="font-bold text-yellow-800">
        ⚠️ Low Stock Alert
      </h3>

      <p className="mt-2 text-yellow-700">
        You are running low on:{" "}
        {lowStockItems.map((item) => item.name).join(", ")}
      </p>
    </div>
  );
}