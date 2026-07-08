import { ShoppingItem } from "../types/shopping";

export const defaultShopping: ShoppingItem[] = [
  {
    id: "1",
    name: "Milk",
    category: "Dairy",
    quantity: "2 L",
    purchased: false,
  },
  {
    id: "2",
    name: "Eggs",
    category: "Dairy",
    quantity: "30",
    purchased: false,
  },
  {
    id: "3",
    name: "Chicken Breast",
    category: "Meat",
    quantity: "1 kg",
    purchased: false,
  },
  {
    id: "4",
    name: "Tomato",
    category: "Vegetables",
    quantity: "1 kg",
    purchased: true,
  },
  {
    id: "5",
    name: "Rice",
    category: "Grocery",
    quantity: "5 kg",
    purchased: false,
  },
];