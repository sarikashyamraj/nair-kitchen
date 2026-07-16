import { ShoppingItem } from "../../types/shopping";
import ShoppingDesktopTable from "./ShoppingDesktopTable";
import ShoppingMobileCards from "./ShoppingMobileCards";
import {
  deleteCloudGroceryItem,
  saveCloudGroceryItem,
} from "../../services/groceryService";

import { useToast } from "../../context/ToastContext";
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
  const { showToast } = useToast();
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  async function togglePurchased(id: string) {
  const itemToUpdate = items.find(
    (item) => item.id === id
  );

  if (!itemToUpdate) return;

  try {
    const savedItem =
      await saveCloudGroceryItem({
        ...itemToUpdate,
        purchased:
          !itemToUpdate.purchased,
      });

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? savedItem
          : item
      )
    );
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to update Grocery item.",
    });
  }
}

  async function deleteItem(id: string) {
  if (!confirm("Delete this item?")) return;

  try {
    await deleteCloudGroceryItem(id);

    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== id
      )
    );

    showToast({
      type: "success",
      message:
        "Grocery item deleted.",
    });
  } catch (error) {
    showToast({
      type: "error",
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete Grocery item.",
    });
  }
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