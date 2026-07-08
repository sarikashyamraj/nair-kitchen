# ADR-004 – Smart Category Suggestion Service

## Status

Accepted

---

## Context

Users frequently add the same ingredients to both Pantry and Grocery.

Examples include:

- Milk
- Chicken
- Rice
- Tomatoes
- Paneer
- Turmeric

Requiring users to manually select a category for every item resulted in repetitive work and increased the likelihood of incorrect categorization.

Examples:

Milk → Dairy

Chicken → Meat

Rice → Grains

These mappings are predictable and should not require manual input every time.

---

## Decision

Introduce a reusable Category Suggestion Service.

Location:

services/categorySuggestion.ts

The service provides:

```ts
suggestCategory(itemName: string): string | null
```

The function uses a centralized keyword mapping to automatically suggest the appropriate ingredient category.

The matching strategy consists of:

1. Exact Match
2. Partial Keyword Match

Examples:

Milk → Dairy

Full Cream Milk → Dairy

Chicken Breast → Meat

Brown Rice → Grains

Turmeric Powder → Spices

The service is currently used by:

- Pantry
- Grocery

---

## Benefits

- Reduces manual data entry.
- Provides consistent categorization.
- Improves user experience.
- Reusable across multiple modules.
- Easy to extend by updating a single mapping.

---

## Trade-offs

- Relies on a manually maintained keyword dictionary.
- New ingredients require updating the mapping.

These trade-offs are acceptable for a local-first family kitchen application.

---

## Alternatives Considered

### Manual category selection

Rejected because it requires repetitive user input.

### Artificial Intelligence categorization

Rejected because it introduces unnecessary complexity and external dependencies for a deterministic problem.

---

## Consequences

Both Pantry and Grocery now automatically suggest categories while still allowing manual override.

Future modules can reuse the same service without duplicating logic.

---

## Future Improvements

Potential enhancements include:

- Ingredient aliases.
- Multi-language support.
- Synonym recognition.
- User-defined mappings.
- Machine learning categorization for unknown ingredients.