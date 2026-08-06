"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
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
  isKitchenRefreshing: boolean;
  refreshKitchen: () => Promise<void>;
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

  const [
    isKitchenLoaded,
    setIsKitchenLoaded,
  ] = useState(false);

  const [
    isKitchenRefreshing,
    setIsKitchenRefreshing,
  ] = useState(false);

  const isMountedRef =
    useRef(true);

  const latestLoadRequestRef =
    useRef(0);

  const hasCompletedInitialLoadRef =
    useRef(false);

  function clearKitchenData() {
    setPantry([]);
    setRecipes([]);
    setShopping([]);
    setPlanner([]);
  }

  async function loadKitchenData(
    options?: {
      forceInitialLoader?: boolean;
    }
  ) {
    const currentRequest =
      ++latestLoadRequestRef.current;

    const shouldShowInitialLoader =
      options?.forceInitialLoader === true ||
      !hasCompletedInitialLoadRef.current;

    if (
      isMountedRef.current &&
      shouldShowInitialLoader
    ) {
      setIsKitchenLoaded(false);
    }

    if (
      isMountedRef.current &&
      !shouldShowInitialLoader
    ) {
      setIsKitchenRefreshing(true);
    }

    try {
      const supabase =
        createClient();

      const {
        data: { session },
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (
        !isMountedRef.current ||
        currentRequest !==
          latestLoadRequestRef.current
      ) {
        return;
      }

      if (sessionError) {
        throw new Error(
          sessionError.message
        );
      }

      /*
       * A missing session is expected on
       * public authentication pages.
       */
      if (!session?.user) {
        clearKitchenData();

        hasCompletedInitialLoadRef.current =
          true;

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

      if (
        !isMountedRef.current ||
        currentRequest !==
          latestLoadRequestRef.current
      ) {
        return;
      }

      setPantry(cloudPantry);
      setRecipes(cloudRecipes);
      setShopping(cloudShopping);
      setPlanner(cloudPlanner);

      hasCompletedInitialLoadRef.current =
        true;
    } catch (error) {
      console.error(
        "Unable to load Kitchen data:",
        error
      );

      /*
       * Preserve previously loaded data during
       * a background refresh failure.
       *
       * Clear data only when the first load
       * has never completed.
       */
      if (
        isMountedRef.current &&
        currentRequest ===
          latestLoadRequestRef.current &&
        !hasCompletedInitialLoadRef.current
      ) {
        clearKitchenData();
      }
    } finally {
      if (
        isMountedRef.current &&
        currentRequest ===
          latestLoadRequestRef.current
      ) {
        setIsKitchenLoaded(true);
        setIsKitchenRefreshing(false);
      }
    }
  }

  async function refreshKitchen() {
    await loadKitchenData();
  }

  useEffect(() => {
    isMountedRef.current = true;

    const supabase =
      createClient();

    void loadKitchenData({
      forceInitialLoader: true,
    });

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (event) => {
          if (
            !isMountedRef.current
          ) {
            return;
          }

          if (
            event === "SIGNED_OUT"
          ) {
            latestLoadRequestRef.current += 1;

            clearKitchenData();

            hasCompletedInitialLoadRef.current =
              false;

            setIsKitchenLoaded(true);
            setIsKitchenRefreshing(false);

            return;
          }

          /*
           * A real sign-in or user change should
           * reload Kitchen data.
           */
          if (
            event === "SIGNED_IN" ||
            event === "USER_UPDATED"
          ) {
            void loadKitchenData();
          }

          /*
           * TOKEN_REFRESHED is intentionally not
           * reloading all Kitchen modules.
           *
           * Refreshing the authentication token
           * does not mean the Pantry, Grocery,
           * Recipes or Planner data changed.
           */
        }
      );

    return () => {
      isMountedRef.current =
        false;

      latestLoadRequestRef.current += 1;

      subscription.unsubscribe();
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
        isKitchenRefreshing,
        refreshKitchen,
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