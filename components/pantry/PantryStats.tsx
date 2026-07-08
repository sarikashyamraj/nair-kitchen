type PantryStatsProps = {
  totalItems: number;
  lowStock: number;
  categories: number;
};

export default function PantryStats({
  totalItems,
  lowStock,
  categories,
}: PantryStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-5 mb-8">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <p className="text-gray-500">Total Ingredients</p>
        <h2 className="text-4xl font-bold text-[#2F6B3C] mt-2">
          {totalItems}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <p className="text-gray-500">Low Stock</p>
        <h2 className="text-4xl font-bold text-[#D89B3C] mt-2">
          {lowStock}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <p className="text-gray-500">Categories</p>
        <h2 className="text-4xl font-bold text-[#2F6B3C] mt-2">
          {categories}
        </h2>
      </div>
    </div>
  );
}