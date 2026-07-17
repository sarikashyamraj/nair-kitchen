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

import { createClient } from "../utils/supabase/client";

import { loadCloudPantry } from "../services/pantryService";
import { loadCloudRecipes } from "../services/recipeService";
import { loadCloudGrocery } from "../services/groceryService";
import { loadCloudPlanner } from "../services/plannerService";

type KitchenContextType = {
  pantry: PantryItem[];
  setPantry: React.Dispatch<
    React.SetStateAction<PantryItem[]>
  >;

  recipes: Recipe[];
  setRecipes: React.Dispatch<
    React.SetStateAction<Recipe[]>
  >;

  shopping: ShoppingItem[];
  setShopping: React.Dispatch<
    React.SetStateAction<ShoppingItem[]>
  >;

  planner: MealPlan[];
  setPlanner: React.Dispatch<
    React.SetStateAction<MealPlan[]>
  >;

  isKitchenLoaded: boolean;
};

const KitchenContext =
  createContext<KitchenContextType | null>(
    null
  );

export function KitchenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pantry, setPantry] =
    useState<PantryItem[]>([]);

  const [recipes, setRecipes] =
    useState<Recipe[]>([]);

  const [shopping, setShopping] =
    useState<ShoppingItem[]>([]);

  const [planner, setPlanner] =
    useState<MealPlan[]>([]);

  const [isKitchenLoaded, setIsKitchenLoaded] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadKitchenData() {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (isMounted) {
            setPantry([]);
            setRecipes([]);
            setShopping([]);
            setPlanner([]);
          }

          return;
        }

        const [
          cloudPantry,
          cloudRecipes,
          cloudShopping,
          cloudPlanner,
        ] = await Promise.all([
          loadCloudPantry(),
          loadCloudRecipes(),
          loadCloudGrocery(),
          loadCloudPlanner(),
        ]);

        if (!isMounted) return;

        setPantry(cloudPantry);
        setRecipes(cloudRecipes);
        setShopping(cloudShopping);
        setPlanner(cloudPlanner);
      } catch (error) {
        console.error(
          "Unable to load Kitchen data:",
          error
        );

        if (isMounted) {
          setPantry([]);
          setRecipes([]);
          setShopping([]);
          setPlanner([]);
        }
      } finally {
        if (isMounted) {
          setIsKitchenLoaded(true);
        }
      }
    }

    void loadKitchenData();

    return () => {
      isMounted = false;
    };
  }, []);

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
        isKitchenLoaded,
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
}

export function useKitchen() {
  const context =
    useContext(KitchenContext);

  if (!context) {
    throw new Error(
      "useKitchen must be used inside KitchenProvider"
    );
  }

  return context;
}