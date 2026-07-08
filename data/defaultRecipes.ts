import { Recipe } from "../types/recipe";

export const defaultRecipes: Recipe[] = [
  {
    id: "1",
    name: "Chicken Curry",
    category: "Non-Veg",
    mealTypes: ["Lunch", "Dinner"],
    cookingTime: "45 mins",
    ingredients: [
      { name: "Chicken", quantity: 1, unit: "kg" },
      { name: "Onion", quantity: 2, unit: "Nos" },
      { name: "Tomato", quantity: 3, unit: "Nos" },
      { name: "Ginger Garlic Paste", quantity: 2, unit: "tbsp" },
      { name: "Curry Leaves", quantity: 1, unit: "sprig" },
    ],
    instructions:
      "Cook chicken with onion, tomato, spices, ginger garlic paste and curry leaves until tender.",
  },
  {
    id: "2",
    name: "Paneer Paratha",
    category: "Vegetarian",
    mealTypes: ["Breakfast"],
    cookingTime: "30 mins",
    ingredients: [
      { name: "Wheat Flour", quantity: 2, unit: "cups" },
      { name: "Paneer", quantity: 200, unit: "g" },
      { name: "Onion", quantity: 1, unit: "Nos" },
      { name: "Coriander", quantity: 2, unit: "tbsp" },
    ],
    instructions:
      "Prepare paneer stuffing, fill inside dough, roll and cook on tawa.",
  },
  {
    id: "3",
    name: "Egg Fried Rice",
    category: "Non-Veg",
    mealTypes: ["Lunch", "Dinner"],
    cookingTime: "25 mins",
    ingredients: [
      { name: "Rice", quantity: 2, unit: "cups" },
      { name: "Eggs", quantity: 3, unit: "Nos" },
      { name: "Carrot", quantity: 1, unit: "Nos" },
      { name: "Beans", quantity: 100, unit: "g" },
      { name: "Soy Sauce", quantity: 1, unit: "tbsp" },
    ],
    instructions:
      "Stir fry vegetables, add eggs and rice, then season lightly.",
  },
];