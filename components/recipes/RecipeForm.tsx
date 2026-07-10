"use client";

import { useEffect, useState } from "react";
import { Recipe, RecipeIngredient, MealType } from "../../types/recipe";
import { saveRecipes } from "../../lib/recipeStorage";
import { MEAL_TYPES, RECIPE_CATEGORIES } from "../../constants/categories";
import { UNITS } from "../../constants/units";
import { useToast } from "../../context/ToastContext";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface RecipeFormProps {
  recipe: Recipe | null;
  recipes: Recipe[];
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  onClose: () => void;
}

export default function RecipeForm({
  recipe,
  recipes,
  setRecipes,
  onClose,
}: RecipeFormProps) {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Vegetarian");
  const [mealTypes, setMealTypes] = useState<MealType[]>(["Lunch"]);
  const [cookingTime, setCookingTime] = useState("");
  const [instructions, setInstructions] = useState("");

  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: "", quantity: 1, unit: "" },
  ]);

  useEffect(() => {
    if (recipe) {
      const oldRecipe = recipe as Recipe & { mealType?: MealType };

      setName(recipe.name);
      setCategory(recipe.category);
      setMealTypes(recipe.mealTypes || [oldRecipe.mealType || "Lunch"]);
      setCookingTime(recipe.cookingTime);
      setInstructions(recipe.instructions);
      setIngredients(recipe.ingredients);
    }
  }, [recipe]);

  const toggleMealType = (mealType: MealType) => {
    if (mealTypes.includes(mealType)) {
      setMealTypes(mealTypes.filter((type) => type !== mealType));
    } else {
      setMealTypes([...mealTypes, mealType]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      showToast({
        type: "warning",
        message: "Please enter recipe name.",
      });
      return;
    }

    if (mealTypes.length === 0) {
      showToast({
        type: "warning",
        message: "Please select at least one meal type.",
      });
      return;
    }

    const validIngredients = ingredients.filter(
      (ingredient) =>
        ingredient.name.trim() &&
        ingredient.quantity > 0 &&
        ingredient.unit.trim()
    );

    if (validIngredients.length === 0) {
      showToast({
        type: "warning",
        message: "Please add at least one valid ingredient.",
      });
      return;
    }

    const updatedRecipe: Recipe = {
      id: recipe ? recipe.id : Date.now().toString(),
      name,
      category,
      mealTypes,
      cookingTime,
      ingredients: validIngredients,
      instructions,
    };

    const updatedRecipes = recipe
      ? recipes.map((existingRecipe) =>
          existingRecipe.id === recipe.id ? updatedRecipe : existingRecipe
        )
      : [...recipes, updatedRecipe];

    setRecipes(updatedRecipes);
    saveRecipes(updatedRecipes);

    showToast({
      type: "success",
      message: recipe
        ? "Recipe updated successfully."
        : "Recipe added successfully.",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto mx-3 sm:mx-0">
        <h2 className="text-2xl font-bold text-[#2F6B3C] mb-6">
          {recipe ? "Edit Recipe" : "Add Recipe"}
        </h2>

        <div className="space-y-5">
          <Input
            label="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chicken Curry"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[...RECIPE_CATEGORIES]}
            />

            <Input
              label="Cooking Time"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              placeholder="45 mins"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#5A4032]">
              Suitable For
            </label>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {MEAL_TYPES.map((mealType) => (
                <label
                  key={mealType}
                  className={`flex items-center gap-2 border rounded-xl p-3 cursor-pointer transition ${
                    mealTypes.includes(mealType)
                      ? "border-[#2F6B3C] bg-[#F4E8D0] text-[#2F6B3C]"
                      : "border-[#EADCC4] text-[#5A4032]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={mealTypes.includes(mealType)}
                    onChange={() => toggleMealType(mealType)}
                  />
                  <span>{mealType}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#2F6B3C] mb-4">
              Ingredients
            </h3>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div
  key={index}
  className="grid grid-cols-12 gap-3 items-end"
>
  <div className="col-span-12 sm:col-span-5">
    <Input
      label={index === 0 ? "Ingredient" : undefined}
      placeholder="Ingredient Name"
      value={ingredient.name}
      onChange={(e) => {
        const updated = [...ingredients];
        updated[index].name = e.target.value;
        setIngredients(updated);
      }}
    />
  </div>

  <div className="col-span-4 sm:col-span-2">
    <Input
      label={index === 0 ? "Qty" : undefined}
      type="number"
      value={ingredient.quantity}
      onChange={(e) => {
        const updated = [...ingredients];
        updated[index].quantity = Number(e.target.value);
        setIngredients(updated);
      }}
    />
  </div>

  <div className="col-span-5 sm:col-span-3">
    <Select
      label={index === 0 ? "Unit" : undefined}
      value={ingredient.unit}
      onChange={(e) => {
        const updated = [...ingredients];
        updated[index].unit = e.target.value;
        setIngredients(updated);
      }}
      options={["", ...UNITS]}
    />
  </div>

  <div className="col-span-3 sm:col-span-2">
    <Button
      type="button"
      variant="danger"
      className="w-full px-2"
      onClick={() =>
        setIngredients(
          ingredients.filter((_, i) => i !== index)
        )
      }
    >
      <span className="sm:hidden">🗑</span>
      <span className="hidden sm:inline">Remove</span>
    </Button>
  </div>
</div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setIngredients([
                    ...ingredients,
                    { name: "", quantity: 1, unit: "" },
                  ])
                }
              >
                + Add Ingredient
              </Button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#5A4032]">
              Instructions
            </label>

            <textarea
              rows={5}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-xl border border-[#EADCC4] bg-white px-4 py-3 text-[#5A4032] shadow-sm focus:border-[#2F6B3C] focus:ring-2 focus:ring-[#2F6B3C]/20 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave}>Save Recipe</Button>
        </div>
      </div>
    </div>
  );
}