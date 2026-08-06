# ADR-001 – KitchenContext: Centralized Global State Management

## Status

Accepted

---

## Context

Initially, each module of Nair Kitchen managed its own data independently using local component state and browser localStorage.

Examples included:

- Pantry
- Recipes
- Grocery
- Planner

Each page loaded and saved its own data independently.

As development progressed, these modules needed to interact.

Examples:

- Planner generates Grocery items.
- Dashboard displays Pantry statistics.
- Recipes use Pantry ingredients.
- Grocery reflects Planner selections.

Managing isolated state across multiple pages was becoming increasingly difficult and resulted in duplicated logic.

---

## Decision

Introduce a global React Context named **KitchenContext**.

KitchenContext acts as the application's single source of truth for shared kitchen data.

The context manages:

- Pantry
- Recipes
- Grocery
- Planner

Each module reads and updates data directly through the context.

Persistent storage remains in localStorage.

KitchenContext automatically synchronizes state changes with localStorage.

---

## Benefits

- Single source of truth.
- Eliminates duplicated state.
- Simplifies communication between modules.
- Dashboard automatically reflects current data.
- Planner can generate Grocery without passing props.
- Easier future expansion.

---

## Trade-offs

- Larger Context Provider.
- More frequent context updates.
- Requires careful state management.

These trade-offs are acceptable for the size of the application.

---

## Alternatives Considered

### Local Component State

Rejected because modules needed to share data.

### Redux

Rejected because it introduced unnecessary complexity for a medium-sized application.

### Zustand

Considered, but React Context provides sufficient functionality for the current project.

---

## Consequences

KitchenContext became the architectural foundation of the application.

Future modules should integrate through KitchenContext whenever shared data is required.

---

## Future Improvements

Potential future enhancements include:

- Context splitting for performance.
- IndexedDB persistence.
- Cloud synchronization.
- Multi-user support.
- Offline-first synchronization.