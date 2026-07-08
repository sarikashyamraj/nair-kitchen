import { ShoppingItem } from "../../types/shopping";

interface ShoppingStatsProps {
  items: ShoppingItem[];
}

export default function ShoppingStats({ items }: ShoppingStatsProps) {
  const totalItems = items.length;

  const purchasedItems = items.filter((item) => item.purchased).length;

  const remainingItems = totalItems - purchasedItems;

  const completion =
    totalItems === 0
      ? 0
      : Math.round((purchasedItems / totalItems) * 100);

  const cards = [
    {
      title: "Total Items",
      value: totalItems,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Purchased",
      value: purchasedItems,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Remaining",
      value: remainingItems,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Completion",
      value: `${completion}%`,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-xl p-5 shadow ${card.color}`}
          >
            <p className="text-sm font-medium">{card.title}</p>

            <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between mb-2">
          <p className="font-semibold text-gray-700">Shopping Progress</p>

          <p className="font-semibold text-gray-700">{completion}%</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-600 h-4 rounded-full transition-all"
            style={{ width: `${completion}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 mt-2">
          {purchasedItems} of {totalItems} items purchased
        </p>
      </div>
    </div>
  );
}