type PlannerActionsProps = {
  onSave: () => void;
  onGenerateGrocery: () => void;
};

export default function PlannerActions({
  onSave,
  onGenerateGrocery,
}: PlannerActionsProps) {
  return (
    <div className="flex gap-4 justify-end">
      <button
        onClick={onSave}
        className="rounded-xl border px-5 py-3"
      >
        💾 Save Week
      </button>

      <button
        onClick={onGenerateGrocery}
        className="rounded-xl bg-[#2F6B3C] px-5 py-3 text-white"
      >
        🛒 Generate Grocery List
      </button>
    </div>
  );
}