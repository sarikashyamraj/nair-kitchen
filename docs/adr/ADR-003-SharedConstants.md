# ADR-003 – Shared Constants & Configuration

## Status

Accepted

---

## Context

During the early stages of development, several values were duplicated across multiple components.

Examples included:

- Measurement Units
- Recipe Categories
- Ingredient Categories
- Meal Types

Each component maintained its own list.

Examples:

```ts
const units = ["kg", "g", "Nos"];
```

```ts
const categories = [
  "Vegetables",
  "Fruits",
  "Dairy"
];
```

As the application expanded, maintaining multiple copies of the same data became increasingly difficult.

Any update required modifying several files, increasing the risk of inconsistencies.

---

## Decision

Centralize all reusable static data into dedicated constant files.

Examples include:

- `constants/units.ts`
- `constants/categories.ts`

These files are imported wherever required throughout the application.

Typical shared constants include:

- Measurement Units
- Ingredient Categories
- Recipe Categories
- Meal Types

---

## Benefits

- Single source of truth.
- Eliminates duplicated data.
- Easier maintenance.
- Consistent dropdown values throughout the application.
- Simplifies adding new categories or units.

---

## Trade-offs

- Slight increase in the number of project files.
- Developers must know where shared constants are located.

These trade-offs are minimal compared to the maintainability benefits.

---

## Alternatives Considered

### Hardcoded values inside components

Rejected because:

- Difficult to maintain.
- Easy to introduce inconsistencies.
- Multiple updates required for a single change.

### API-driven configuration

Rejected because Kitchen Brain is currently a local-first application and does not require server-managed configuration.

---

## Consequences

All dropdowns and selection lists now reference shared constants.

Examples include:

- Pantry
- Grocery
- Recipes
- Planner

Future shared values should also be placed inside the `constants` folder.

---

## Future Improvements

Potential enhancements include:

- Internationalization (multi-language labels).
- User-configurable categories.
- Dynamic category management.
- Database-backed configuration.