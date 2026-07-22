import { useState } from "react";
import { ShoppingItem } from "../../types/shopping";
import ShoppingDesktopTable from "./ShoppingDesktopTable";
import ShoppingMobileCards from "./ShoppingMobileCards";
import ConfirmModal from "../common/ConfirmModal";
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [itemToDelete, setItemToDelete] =
    useState<ShoppingItem | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

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
          purchased: !itemToUpdate.purchased,
        });

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id ? savedItem : item
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

  function deleteItem(id: string) {
    const item = items.find(
      (item) => item.id === id
    );

    if (!item) return;

    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);

      await deleteCloudGroceryItem(
        itemToDelete.id
      );

      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== itemToDelete.id
        )
      );

      showToast({
        type: "success",
        message:
          "Grocery item deleted successfully.",
      });

      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete Grocery item.",
      });
    } finally {
      setIsDeleting(false);
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Grocery Item"
        message={
          itemToDelete
            ? `Are you sure you want to delete "${itemToDelete.name}"?`
            : "Are you sure you want to delete this grocery item?"
        }
        confirmText="Delete"
        cancelText="Cancel"
        loadingText="Deleting..."
        isLoading={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </>
  );
}