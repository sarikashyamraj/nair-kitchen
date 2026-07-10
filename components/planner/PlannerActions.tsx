type PlannerActionsProps = {
  onSave: () => void;
  onGenerateGrocery: () => void;
};

export default function PlannerActions({
  onSave,
  onGenerateGrocery,
}: PlannerActionsProps) {
  return (
    <div className="sticky bottom-3 z-20 flex gap-2 rounded-2xl border border-[#EADCC4] bg-white/95 p-3 shadow-lg backdrop-blur md:static md:justify-end md:border-0 md:bg-transparent md:p-0 md:shadow-none">
      <button
        type="button"
        onClick={onSave}
        className="min-h-11 flex-1 rounded-xl border border-[#EADCC4] bg-white px-3 py-2 text-sm font-semibold text-[#5A4032] md:flex-none md:px-5 md:py-3"
      >
        💾 Save Week
      </button>

      <button
        type="button"
        onClick={onGenerateGrocery}
        className="min-h-11 flex-1 rounded-xl bg-[#2F6B3C] px-3 py-2 text-sm font-semibold text-white md:flex-none md:px-5 md:py-3"
      >
        🛒 Generate Grocery
      </button>
    </div>
  );
}