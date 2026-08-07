import {
  HOME_INVENTORY_CATEGORIES,
} from "../../constants/categories";

export type HomeInventoryCategory =
  (typeof HOME_INVENTORY_CATEGORIES)[number];

export type InventoryCategoryMeta = {
  name: HomeInventoryCategory;
  label: string;
  icon: string;
  description: string;
};

export const inventoryCategoryMeta:
  InventoryCategoryMeta[] = [
    {
      name: "Grains",
      label: "Grains",
      icon: "🌾",
      description:
        "Rice, flour, oats and grains",
    },
    {
      name: "Dairy",
      label: "Dairy",
      icon: "🥛",
      description:
        "Milk, paneer, butter and dairy",
    },
    {
      name: "Vegetables",
      label: "Vegetables",
      icon: "🥬",
      description:
        "Fresh vegetables and greens",
    },
    {
      name: "Fruits",
      label: "Fruits",
      icon: "🍎",
      description:
        "Fresh and stored fruits",
    },
    {
      name: "Meat",
      label: "Meat",
      icon: "🍗",
      description:
        "Chicken, mutton and meat",
    },
    {
      name: "Seafood",
      label: "Seafood",
      icon: "🐟",
      description:
        "Fish, prawns and seafood",
    },
    {
      name: "Spices",
      label: "Spices",
      icon: "🌶️",
      description:
        "Spices, masalas and seasonings",
    },
    {
      name: "Snacks",
      label: "Snacks",
      icon: "🍪",
      description:
        "Snacks and quick bites",
    },
    {
      name: "Beverages",
      label: "Beverages",
      icon: "🥤",
      description:
        "Tea, coffee and drinks",
    },
    {
      name: "Frozen",
      label: "Frozen",
      icon: "❄️",
      description:
        "Frozen food and ingredients",
    },
    {
      name: "Bakery",
      label: "Bakery",
      icon: "🍞",
      description:
        "Bread and bakery essentials",
    },
    {
      name: "Household",
      label: "Household",
      icon: "🧴",
      description:
        "Cleaning and home essentials",
    },
    {
      name: "Other",
      label: "Other",
      icon: "📦",
      description:
        "Everything else at home",
    },
  ];