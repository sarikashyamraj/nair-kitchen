import { PantryItem } from "../../types/pantry";
import PantryDesktopTable from "./PantryDesktopTable";
import PantryMobileCards from "./PantryMobileCards";

type PantryTableProps = {
  items: PantryItem[];
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
};

export default function PantryTable({
  items,
  onEdit,
  onDelete,
}: PantryTableProps) {
  return (
    <>
      <PantryMobileCards items={items} onEdit={onEdit} onDelete={onDelete} />
      <PantryDesktopTable items={items} onEdit={onEdit} onDelete={onDelete} />
    </>
  );
}