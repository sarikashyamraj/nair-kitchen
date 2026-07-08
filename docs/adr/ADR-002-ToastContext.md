# ADR-002 – ToastContext: Global Notification System

## Status

Accepted

---

## Context

During early development, each page displayed feedback using browser-native dialogs such as:

- alert()
- confirm()

These dialogs were inconsistent with the application's design, blocked user interaction, and produced an unpolished user experience.

As more modules were added (Planner, Pantry, Recipes, Grocery), notification logic became duplicated across components.

A centralized solution was required.

---

## Decision

Introduce a global React Context named **ToastContext**.

ToastContext provides a single notification service that can be accessed from any component using:

```tsx
const { showToast } = useToast();
```

Notifications are displayed through a reusable Toast component rather than browser dialogs.

Each toast contains:

- Notification type
  - Success
  - Warning
  - Error
  - Information
- Message text

The ToastProvider is registered once within the application's root layout.

---

## Benefits

- Consistent user experience.
- Eliminates duplicated notification logic.
- Removes browser alert dialogs.
- Easy to use from any module.
- Supports future visual enhancements without changing business logic.

---

## Trade-offs

- Requires a Context Provider.
- Slight increase in application complexity.

The benefits significantly outweigh the additional complexity.

---

## Alternatives Considered

### Browser alert()

Rejected because:

- Blocks user interaction.
- Poor visual appearance.
- Not customizable.

### Local component notifications

Rejected because notification logic became duplicated across multiple pages.

---

## Consequences

All modules now use the same notification mechanism.

Examples include:

- Planner
- Pantry
- Recipes
- Grocery

Future modules should also use ToastContext for user feedback.

---

## Future Improvements

Potential enhancements include:

- Toast titles.
- Action buttons.
- Queue multiple notifications.
- Progress notifications.
- Success animations.
- Undo actions.