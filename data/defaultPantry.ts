import { PantryItem } from "../types/pantry";

export const defaultPantry: PantryItem[] = [
  {
    id: "1",
    name: "Rice",
    quantity: 5,
    unit: "kg",
    minQuantity: 2,
    category: "Grains",
  },
  {
    id: "2",
    name: "Milk",
    quantity: 1,
    unit: "L",
    minQuantity: 2,
    category: "Dairy",
  },
  {
    id: "3",
    name: "Eggs",
    quantity: 12,
    unit: "pcs",
    minQuantity: 6,
    category: "Dairy",
  },
  {
    id: "4",
    name: "Tomatoes",
    quantity: 500,
    unit: "g",
    minQuantity: 250,
    category: "Vegetables",
  },
  {
    id: "5",
    name: "Chicken",
    quantity: 2,
    unit: "kg",
    minQuantity: 1,
    category: "Meat",
  },
];