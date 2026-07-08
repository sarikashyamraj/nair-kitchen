# ADR-005 – Planner to Grocery Workflow

## Status

Accepted

---

## Context

One of the primary objectives of Nair Kitchen is to simplify weekly meal planning and grocery shopping.

Without automation, users would need to:

1. Select meals for the week.
2. Open every recipe.
3. List all required ingredients.
4. Combine duplicate ingredients.
5. Compare against Pantry inventory.
6. Manually create a Grocery list.

This process is repetitive, time-consuming, and prone to errors.

---

## Decision

Implement an automated Planner-to-Grocery workflow.

The workflow consists of the following stages:

### 1. Meal Selection

The user assigns recipes to each day of the week.

Supported meal slots include:

- Morning Drink
- Breakfast
- Lunch
- Snack
- Dinner

---

### 2. Recipe Collection

The Planner gathers all selected recipes for the week.

Duplicate recipe selections are permitted.

---

### 3. Ingredient Aggregation

Ingredients from all selected recipes are combined into a single collection.

Duplicate ingredients are aggregated.

Example:

Chicken Curry

- Onion ×2

Paneer Curry

- Onion ×1

Result:

Onion ×3

---

### 4. Pantry Comparison

The aggregated ingredient list is compared against Pantry inventory.

If sufficient stock exists, the ingredient is excluded from the Grocery list.

Only missing or insufficient quantities are included.

---

### 5. Grocery Generation

The resulting Grocery list is merged with any existing shopping items.

Duplicate Grocery entries are updated rather than duplicated.

Users receive a notification summarizing the generated items.

---

## Benefits

- Eliminates manual grocery planning.
- Prevents duplicate shopping items.
- Reduces unnecessary purchases.
- Encourages Pantry utilization.
- Provides a complete weekly shopping list with a single action.

---

## Trade-offs

- Quantity comparison currently relies on matching units entered by the user.
- Pantry quantities must be reasonably accurate for best results.

These trade-offs are acceptable for Version 1.0.

---

## Alternatives Considered

### Manual Grocery Creation

Rejected because it duplicates work already represented in Recipes.

### Automatic Grocery Generation Without Pantry Comparison

Rejected because it would result in unnecessary purchases.

---

## Consequences

The Planner became the central orchestration module of Nair Kitchen.

It integrates:

- Recipes
- Pantry
- Grocery

through a single automated workflow.

---

## Future Improvements

Potential enhancements include:

- Automatic Pantry deduction after cooking.
- Consumption history.
- Weekly shopping cost estimation.
- AI meal optimization.
- Smart grocery recommendations.
- Seasonal ingredient substitutions.
- Multi-family meal planning.