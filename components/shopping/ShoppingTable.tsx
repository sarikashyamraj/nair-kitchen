import { ShoppingItem } from "../../types/shopping";
import ShoppingDesktopTable from "./ShoppingDesktopTable";
import ShoppingMobileCards from "./ShoppingMobileCards";

interface ShoppingTableProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  onEdit: (item: ShoppingItem) => void;
  searchTerm: string;
  selectedCategory: string;
}

export default function ShoppingTable({
  items,
  setItems,
  onEdit,
  searchTerm,
  selectedCategory,
}: ShoppingTableProps) {
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  function togglePurchased(id: string) {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, purchased: !item.purchased }
          : item
      )
    );
  }

  function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;

    setItems(items.filter((item) => item.id !== id));
  }

  if (filteredItems.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
        No grocery items found.
      </div>
    );
  }

  return (
    <>
      <ShoppingMobileCards
        items={filteredItems}
        onTogglePurchased={togglePurchased}
        onEdit={onEdit}
        onDelete={deleteItem}
      />

      <ShoppingDesktopTable
        items={filteredItems}
        onTogglePurchased={togglePurchased}
        onEdit={onEdit}
        onDelete={deleteItem}
      />
    </>
  );
}