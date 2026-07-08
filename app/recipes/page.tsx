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
    </AppLayout>
  );
}