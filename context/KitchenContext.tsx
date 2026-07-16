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

import {
  loadCloudPantry,
  saveCloudPantryItem,
} from "../services/pantryService";

import {
  loadCloudRecipes,
  saveCloudRecipe,
} from "../services/recipeService";

import {
  loadCloudGrocery,
  saveCloudGroceryItems,
} from "../services/groceryService";

import {
  loadCloudPlanner,
  saveCloudPlanner,
} from "../services/plannerService";

import { loadPantry } from "../lib/pantryStorage";
import { loadRecipes } from "../lib/recipeStorage";
import { loadShopping } from "../lib/shoppingStorage";
import { loadPlanner } from "../lib/plannerStorage";

import { defaultPantry } from "../data/defaultPantry";
import { defaultRecipes } from "../data/defaultRecipes";
import { defaultShopping } from "../data/defaultShopping";
import { defaultPlanner } from "../data/defaultPlanner";

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

        let resolvedPantry = cloudPantry;
        let resolvedRecipes = cloudRecipes;
        let resolvedShopping = cloudShopping;
        let resolvedPlanner = cloudPlanner;

        if (cloudPantry.length === 0) {
          const localPantry = loadPantry();

          const pantryToMigrate =
            localPantry.length > 0
              ? localPantry
              : defaultPantry;

          resolvedPantry =
            await Promise.all(
              pantryToMigrate.map((item) =>
                saveCloudPantryItem(item)
              )
            );
        }

        if (cloudRecipes.length === 0) {
          const localRecipes =
            loadRecipes();

          const recipesToMigrate =
            localRecipes.length > 0
              ? localRecipes
              : defaultRecipes;

          resolvedRecipes =
            await Promise.all(
              recipesToMigrate.map(
                (recipe) =>
                  saveCloudRecipe(recipe)
              )
            );
        }

        if (cloudShopping.length === 0) {
          const localShopping =
            loadShopping();

          const shoppingToMigrate =
            localShopping.length > 0
              ? localShopping
              : defaultShopping;

          if (
            shoppingToMigrate.length > 0
          ) {
            resolvedShopping =
              await saveCloudGroceryItems(
                shoppingToMigrate
              );
          }
        }

        if (cloudPlanner.length === 0) {
          const localPlanner =
            loadPlanner();

          const plannerToMigrate =
            localPlanner.length > 0
              ? localPlanner
              : defaultPlanner;

          resolvedPlanner =
            await saveCloudPlanner(
              plannerToMigrate
            );
        }

        if (!isMounted) return;

        setPantry(resolvedPantry);
        setRecipes(resolvedRecipes);
        setShopping(resolvedShopping);
        setPlanner(resolvedPlanner);
      } catch (error) {
        console.error(
          "Unable to load Kitchen data:",
          error
        );
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