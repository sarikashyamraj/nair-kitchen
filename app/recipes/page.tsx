"use client";

import { useEffect, useState } from "react";

import AppLayout from "../../components/AppLayout";

import RecipesHeader from "../../components/recipes/RecipesHeader";
import RecipesStats from "../../components/recipes/RecipesStats";
import RecipesTable from "../../components/recipes/RecipesTable";
import RecipeForm from "../../components/recipes/RecipeForm";

import { Recipe } from "../../types/recipe";

import { defaultRecipes } from "../../data/defaultRecipes";
import { loadRecipes, saveRecipes } from "../../lib/recipeStorage";
import MobilePageHeader from "../../components/mobile/MobilePageHeader";
import MobileSearchBar from "../../components/mobile/MobileSearchBar";
import MobileFAB from "../../components/mobile/MobileFAB";
const categories = [
  "All",
  "Vegetarian",
  "Non-Veg",
  "Vegan",
];
export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] =
    useState<Recipe | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const saved = loadRecipes();

    if (saved.length > 0) {
      setRecipes(saved);
    } else {
      setRecipes(defaultRecipes);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveRecipes(recipes);
    }
  }, [recipes, isLoaded]);

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
    onAdd={() => {
      setEditingRecipe(null);
      setIsFormOpen(true);
    }}
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
            onClose={() => {
              setEditingRecipe(null);
              setIsFormOpen(false);
            }}
          />
        )}
      </div>
      <MobileFAB
  label="Add Recipe"
  onClick={() => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  }}
/>
    </AppLayout>
  );
}