"use client";

import { useEffect, useState } from "react";
import {
  loadCloudRecipes,
  saveCloudRecipe,
} from "../../services/recipeService";

import { loadRecipes } from "../../lib/recipeStorage";
import { useToast } from "../../context/ToastContext";

import AppLayout from "../../components/AppLayout";

import RecipesHeader from "../../components/recipes/RecipesHeader";
import RecipesStats from "../../components/recipes/RecipesStats";
import RecipesTable from "../../components/recipes/RecipesTable";
import RecipeForm from "../../components/recipes/RecipeForm";

import MobilePageHeader from "../../components/mobile/MobilePageHeader";
import MobileSearchBar from "../../components/mobile/MobileSearchBar";
import MobileFAB from "../../components/mobile/MobileFAB";

import { Recipe } from "../../types/recipe";
import { useKitchen } from "../../context/KitchenContext";

const categories = [
  "All",
  "Vegetarian",
  "Non-Veg",
  "Vegan",
];

export default function RecipesPage() {
  const { recipes, setRecipes } = useKitchen();
const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingRecipe, setEditingRecipe] =
    useState<Recipe | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");
    const [isLoaded, setIsLoaded] = useState(false);
const [loadError, setLoadError] = useState("");
useEffect(() => {
  let isMounted = true;

  async function loadRecipeData() {
    try {
      setLoadError("");

      const cloudRecipes =
        await loadCloudRecipes();

      let resolvedRecipes =
        cloudRecipes;

      if (cloudRecipes.length === 0) {
        const localRecipes =
          loadRecipes();

        if (localRecipes.length > 0) {
          resolvedRecipes =
            await Promise.all(
              localRecipes.map((recipe) =>
                saveCloudRecipe(recipe)
              )
            );
        }
      }

      if (!isMounted) return;

      setRecipes(resolvedRecipes);
    } catch (error) {
      if (!isMounted) return;

      const message =
        error instanceof Error
          ? error.message
          : "Unable to load Recipes.";

      setLoadError(message);

      showToast({
        type: "error",
        message,
      });
    } finally {
      if (isMounted) {
        setIsLoaded(true);
      }
    }
  }

  void loadRecipeData();

  return () => {
    isMounted = false;
  };
}, [setRecipes, showToast]);
  function openAddForm() {
    setEditingRecipe(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingRecipe(null);
    setIsFormOpen(false);
  }
if (!isLoaded) {
  return (
    <AppLayout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-semibold text-[#2F6B3C]">
          Loading Recipes...
        </p>
      </div>
    </AppLayout>
  );
}

if (loadError) {
  return (
    <AppLayout>
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
        {loadError}
      </div>
    </AppLayout>
  );
}
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Sticky Mobile Header and Search */}
        <div className="sticky top-0 z-30 -mx-4 bg-[#FFFDF8] px-4 pb-3 pt-1 md:hidden">
          <MobilePageHeader
            title="Recipes"
            subtitle={`${recipes.length} Recipes`}
          />

          <div className="mt-3">
            <MobileSearchBar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              categoryValue={selectedCategory}
              categories={categories}
              onCategoryChange={setSelectedCategory}
              placeholder="Search recipes..."
            />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <RecipesHeader
            onAdd={openAddForm}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <RecipesStats recipes={recipes} />

        <RecipesTable
          recipes={recipes}
          setRecipes={setRecipes}
          onEdit={(recipe) => {
            setEditingRecipe(recipe);
            setIsFormOpen(true);
          }}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />

        {isFormOpen && (
          <RecipeForm
            recipe={editingRecipe}
            recipes={recipes}
            setRecipes={setRecipes}
            onClose={closeForm}
          />
        )}
      </div>

      <MobileFAB
        label="Add Recipe"
        onClick={openAddForm}
      />
    </AppLayout>
  );
}