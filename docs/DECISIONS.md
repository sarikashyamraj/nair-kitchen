# Nair Kitchen – Product Decisions

This document records significant product and architecture decisions made during the development of Nair Kitchen.

The goal is to preserve the reasoning behind decisions so future development remains consistent.

---

# Decision 001

## Title
Automatic Pantry Item Merge

## Status
✅ Accepted

## Version
v1.1

## Decision

When a pantry item is added:

- Compare by Name (case-insensitive)
- Compare by Category
- Compare by Unit

If all three match:

- Automatically merge the quantities.
- Update minimum quantity if changed.
- Preserve existing notes unless new notes are provided.

No confirmation dialog will be shown.

## Reason

Nair Kitchen is a family kitchen management application, not an inventory management system.

Automatic merging keeps the pantry clean, reduces duplicate entries, and minimizes user interaction.

---

# Decision 002

## Title
Remove Expiry Date Tracking

## Status
✅ Accepted

## Version
v1.1

## Decision

Remove expiry date tracking from Pantry items.

## Reason

During product evaluation it became clear that expiry dates are rarely maintained in a household pantry, especially for:

- Fruits
- Vegetables
- Milk
- Daily groceries

The information adds complexity without providing meaningful value.

The application will instead focus on:

- Quantity tracking
- Minimum stock alerts
- Grocery generation

---

# Decision 003

## Title
Mobile-First Design System

## Status
✅ Accepted

## Version
v1.1

## Decision

Build reusable mobile UI components before converting application pages.

Components include:

- MobilePageHeader
- MobileSearchBar
- MobileStatCard
- MobileListCard
- MobileFAB

## Reason

A reusable design system reduces duplication, improves consistency, and accelerates development of future mobile screens.

---

# Decision 004

## Title
Keep AI Features Out of Version 1.x

## Status
✅ Accepted

## Version
v1.1

## Decision

Artificial Intelligence features will not be included in Version 1.x.

## Reason

The primary objective is to validate the usefulness of the core application for everyday family use.

AI features will only be considered after the core workflow has proven reliable and valuable.

---

# Future Decisions

This section will grow as Nair Kitchen evolves.