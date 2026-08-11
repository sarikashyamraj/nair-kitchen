"use client";

import {
  useState,
} from "react";



import AppLayout from "../../components/AppLayout";

import RecipesHeader from "../../components/recipes/RecipesHeader";
import RecipesStats from "../../components/recipes/RecipesStats";
import RecipesTable from "../../components/recipes/RecipesTable";
import RecipeForm from "../../components/recipes/RecipeForm";
import RecipesMobileFilters from "../../components/recipes/RecipesMobileFilters";

import {
  Recipe,
} from "../../types/recipe";

import {
  MEAL_TYPES,
} from "../../constants/categories";

import {
  useKitchen,
} from "../../context/KitchenContext";

const categories = [
  "All",
  "Vegetarian",
  "Non-Veg",
  "Vegan",
];

const mealFilters = [
  "All",
  ...MEAL_TYPES,
];

export default function RecipesPage() {
  const {
    recipes,
    setRecipes,
    isKitchenLoaded,
  } = useKitchen();

  const [
    isFormOpen,
    setIsFormOpen,
  ] = useState(false);

  const [
    editingRecipe,
    setEditingRecipe,
  ] =
    useState<Recipe | null>(
      null
    );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [
    selectedMealType,
    setSelectedMealType,
  ] = useState("All");

  function openAddForm() {
    setEditingRecipe(null);

    setIsFormOpen(
      true
    );
  }

  function closeForm() {
    setEditingRecipe(null);

    setIsFormOpen(
      false
    );
  }

  if (!isKitchenLoaded) {
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

  return (
    <AppLayout>
      <div className="space-y-3 pb-24 md:pb-0">
        {/* Mobile Header */}
<div className="md:hidden">
  <div>
    <h1 className="text-xl font-bold text-[#2F6B3C]">
      Recipes
    </h1>

    <p className="mt-1 text-sm text-[#7A746C]">
      Save, discover and cook your favourite meals.
    </p>
  </div>

  <div className="mt-2.5">
    <RecipesMobileFilters
      searchValue={
        searchTerm
      }
      onSearchChange={
        setSearchTerm
      }
      categoryValue={
        selectedCategory
      }
      categories={
        categories
      }
      onCategoryChange={
        setSelectedCategory
      }
      mealValue={
        selectedMealType
      }
      mealTypes={
        mealFilters
      }
      onMealChange={
        setSelectedMealType
      }
      onAdd={
        openAddForm
      }
    />
  </div>
</div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <RecipesHeader
            onAdd={
              openAddForm
            }
            searchTerm={
              searchTerm
            }
            setSearchTerm={
              setSearchTerm
            }
            selectedCategory={
              selectedCategory
            }
            setSelectedCategory={
              setSelectedCategory
            }
          />
        </div>

        {/* Summary */}
        <RecipesStats
          recipes={
            recipes
          }
        />

        {/* Recipe List */}
        <RecipesTable
          recipes={
            recipes
          }
          setRecipes={
            setRecipes
          }
          onEdit={(
            recipe
          ) => {
            setEditingRecipe(
              recipe
            );

            setIsFormOpen(
              true
            );
          }}
          searchTerm={
            searchTerm
          }
          selectedCategory={
            selectedCategory
          }
          selectedMealType={
            selectedMealType
          }
        />

        {/* Add / Edit */}
        {isFormOpen && (
          <RecipeForm
            recipe={
              editingRecipe
            }
            recipes={
              recipes
            }
            setRecipes={
              setRecipes
            }
            onClose={
              closeForm
            }
          />
        )}
      </div>
    </AppLayout>
  );
}