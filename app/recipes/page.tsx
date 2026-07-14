"use client";

import { useState } from "react";

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

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingRecipe, setEditingRecipe] =
    useState<Recipe | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  function openAddForm() {
    setEditingRecipe(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingRecipe(null);
    setIsFormOpen(false);
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