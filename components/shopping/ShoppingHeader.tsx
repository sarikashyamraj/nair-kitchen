import {
  CheckCircle2,
  Plus,
  Search,
  Share2,
} from "lucide-react";

import {
  INGREDIENT_CATEGORIES,
} from "../../constants/categories";

interface ShoppingHeaderProps {
  onAdd: () => void;
  onFinishShopping: () => void;
  onShare: () => void;

  searchTerm: string;
  setSearchTerm: (
    value: string
  ) => void;

  selectedCategory: string;
  setSelectedCategory: (
    value: string
  ) => void;

  remainingItems?: number;
}

const categories = [
  "All",
  ...INGREDIENT_CATEGORIES,
];

export default function ShoppingHeader({
  onAdd,
  onFinishShopping,
  onShare,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  remainingItems = 0,
}: ShoppingHeaderProps) {
  const canShare =
    remainingItems > 0;

  return (
    <section className="mb-6 space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D89B3C]">
            Kitchen Brain
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#245B32]">
            Grocery
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage, share and complete
            your grocery list.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onShare}
            disabled={!canShare}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2F6B3C] bg-white px-4 py-2.5 text-sm font-semibold text-[#2F6B3C] shadow-sm transition hover:bg-[#F3F8F4] disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            <Share2 size={17} />

            Share List
          </button>

          <button
            type="button"
            onClick={
              onFinishShopping
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D89B3C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C88C31]"
          >
            <CheckCircle2
              size={17}
            />

            Complete Shopping
          </button>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F6B3C] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#245B32]"
          >
            <Plus size={17} />

            Add Item
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#EADCC4] bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search grocery items..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-[#EADCC4] bg-white py-3 pl-11 pr-4 text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
            />
          </div>

          <select
            value={
              selectedCategory
            }
            onChange={(event) =>
              setSelectedCategory(
                event.target.value
              )
            }
            className="rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-[#5A4032] outline-none transition focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/15"
          >
            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>
        </div>
      </div>
    </section>
  );
}