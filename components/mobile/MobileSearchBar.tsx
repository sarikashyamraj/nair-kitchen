"use client";

type MobileSearchBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  categoryValue?: string;
  categories?: string[];
  onCategoryChange?: (value: string) => void;
  placeholder?: string;
};

export default function MobileSearchBar({
  searchValue,
  onSearchChange,
  categoryValue,
  categories = [],
  onCategoryChange,
  placeholder = "Search...",
}: MobileSearchBarProps) {
  return (
    <div className="md:hidden space-y-3 mb-5">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
      />

      {categories.length > 0 && onCategoryChange && (
        <select
          value={categoryValue}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-xl border border-[#EADCC4] px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6B3C]/20"
        >
          {categories.map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}