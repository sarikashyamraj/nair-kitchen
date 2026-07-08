"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { PantryItem } from "../types/pantry";
import { Recipe } from "../types/recipe";
import { ShoppingItem } from "../types/shopping";
import { MealPlan } from "../types/planner";

import { loadPantry, savePantry } from "../lib/pantryStorage";
import { loadRecipes, saveRecipes } from "../lib/recipeStorage";
import { loadShopping, saveShopping } from "../lib/shoppingStorage";
import { loadPlanner, savePlanner } from "../lib/plannerStorage";

import { defaultPantry } from "../data/defaultPantry";
import { defaultRecipes } from "../data/defaultRecipes";
import { defaultShopping } from "../data/defaultShopping";
import { defaultPlanner } from "../data/defaultPlanner";

type KitchenContextType = {
  pantry: PantryItem[];
  setPantry: React.Dispatch<React.SetStateAction<PantryItem[]>>;

  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;

  shopping: ShoppingItem[];
  setShopping: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;

  planner: MealPlan[];
  setPlanner: React.Dispatch<React.SetStateAction<MealPlan[]>>;
};

const KitchenContext = createContext<KitchenContextType | null>(null);

export function KitchenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [shopping, setShopping] = useState<ShoppingItem[]>([]);
  const [planner, setPlanner] = useState<MealPlan[]>([]);

  useEffect(() => {
    setPantry(loadPantry().length ? loadPantry() : defaultPantry);
    setRecipes(loadRecipes().length ? loadRecipes() : defaultRecipes);
    setShopping(loadShopping().length ? loadShopping() : defaultShopping);
    setPlanner(loadPlanner().length ? loadPlanner() : defaultPlanner);
  }, []);

  useEffect(() => {
    savePantry(pantry);
  }, [pantry]);

  useEffect(() => {
    saveRecipes(recipes);
  }, [recipes]);

  useEffect(() => {
    saveShopping(shopping);
  }, [shopping]);

  useEffect(() => {
    savePlanner(planner);
  }, [planner]);

  return (
    <KitchenContext.Provider
      value={{
        pantry,
        setPantry,
        recipes,
        setRecipes,
        shopping,
        setShopping,
        planner,
        setPlanner,
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
}

export function useKitchen() {
  const context = useContext(KitchenContext);

  if (!context) {
    throw new Error("useKitchen must be used inside KitchenProvider");
  }

  return context;
}