# Nair Kitchen – Architecture Overview

## Project Overview

Nair Kitchen is a local-first family kitchen management application built using:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

The application helps manage:

- Pantry
- Recipes
- Weekly Meal Planner
- Grocery List
- Dashboard

The architecture focuses on simplicity, maintainability, and modularity.

---

# High-Level Architecture

```
                +--------------------+
                |     Dashboard      |
                +----------+---------+
                           |
                           |
                    KitchenContext
                           |
     --------------------------------------------------
     |            |            |           |          |
     |            |            |           |          |
  Pantry       Recipes      Planner     Grocery    Dashboard
     |            |            |
     |            |            |
     +------------+------------+
                  |
          Shared Services
                  |
    ------------------------------
    |             |             |
categorySuggestion  groceryEngine  ingredientAggregator

```

---

# Core Modules

## Dashboard

Displays:

- Pantry Health
- Grocery Summary
- Weekly Planner Summary

Reads data directly from KitchenContext.

---

## Pantry

Responsibilities:

- Maintain inventory
- Track quantities
- Minimum stock
- Expiry dates
- Category suggestion

---

## Recipes

Responsibilities:

- Store recipes
- Ingredients
- Cooking instructions
- Multiple meal types

Recipes are reusable across the Planner.

---

## Planner

Responsibilities:

- Weekly meal planning
- Recipe selection
- Grocery generation

Acts as the orchestration layer of the application.

---

## Grocery

Responsibilities:

- Shopping management
- Duplicate prevention
- Pantry-aware shopping list

---

# Shared Contexts

## KitchenContext

Acts as the application's single source of truth.

Stores:

- Pantry
- Recipes
- Planner
- Grocery

---

## ToastContext

Provides a global notification service.

Supports:

- Success
- Warning
- Error
- Information

---

# Shared Services

## categorySuggestion

Automatically categorizes ingredients.

Used by:

- Pantry
- Grocery

---

## ingredientAggregator

Combines duplicate ingredients from multiple recipes.

Example:

Onion + Onion → Onion (combined quantity)

---

## groceryEngine

Compares recipe requirements against Pantry inventory and produces the Grocery list.

---

# Shared Constants

The application centralizes reusable configuration.

Examples:

- Units
- Ingredient Categories
- Recipe Categories
- Meal Types

---

# Design Principles

The project follows these principles:

- Single Source of Truth
- Reusable Components
- Reusable Services
- Local-first Architecture
- Minimal Dependencies
- Type Safety
- Separation of Concerns

---

# Future Architecture

Future enhancements may include:

- Authentication
- Cloud Sync
- Family Profiles
- AI Meal Recommendations
- Nutrition Engine
- Mobile App