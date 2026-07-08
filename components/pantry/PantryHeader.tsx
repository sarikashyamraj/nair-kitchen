type PantryHeaderProps = {
  onAddItem: () => void;
};

export default function PantryHeader({ onAddItem }: PantryHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-[#2F6B3C]">
          🥫 Pantry
        </h1>

        <p className="text-[#5A4032] mt-2">
          Manage your kitchen inventory
        </p>
      </div>

      <button
        onClick={onAddItem}
        className="bg-[#2F6B3C] text-white px-5 py-3 rounded-xl hover:bg-[#255732] transition"
      >
        + Add Ingredient
      </button>
    </div>
  );
}