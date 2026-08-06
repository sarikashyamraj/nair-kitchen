# Kitchen Brain Screen Library

**Document Version:** 1.0  
**Status:** Living Document  
**Release:** Kitchen Brain v1.2 – Smart Kitchen

---

# Purpose

The Screen Library contains the officially approved layouts for every major Kitchen Brain screen.

Unlike the UI Design System, which defines design principles and standards, this document serves as the visual reference for implementation.

Every new screen should be reviewed and approved before being added to this library.

---

# Screen Status Legend

| Status | Meaning |
|----------|---------|
| 🟢 Approved | Final design approved for implementation |
| 🟡 In Progress | Design under refinement |
| 🔵 Planned | Planned but not yet designed |
| ⚪ Future | Reserved for future releases |

---

# Mobile Design Principles

All mobile screens follow these principles:

- Mobile-first layout
- Compact vertical spacing
- Hero card at the top
- Insight-driven interface
- Maximum four metric cards
- Floating Action Button
- Fixed Bottom Navigation
- Soft shadows
- Rounded cards
- Warm cream background
- Green primary branding

---

# Desktop Design Principles

Desktop layouts are responsive adaptations of the approved mobile screens.

Desktop should never become a completely different experience.

Additional width should improve readability—not change workflows.

---

# Approved Screen Library

---

# Dashboard

Status

🟡 In Progress

Purpose

Provide a complete overview of today's kitchen.

Primary Question

> How is my kitchen today?

Layout

```
Greeting

Dashboard Hero

Today's Summary

Kitchen Intelligence

Today's Meals

Quick Actions

Insights
```

Notes

Dashboard will be refined after the Pantry redesign is completed to ensure visual consistency.

---

# Pantry

Status

🟢 Approved

Purpose

Help users monitor pantry health and manage ingredients.

Primary Question

> What needs restocking?

Approved Layout

```
Header

Search

Category Filter

Pantry Health Hero

Needs Attention

Summary Cards

Ingredients

Ingredient Cards

Floating Add Button

Bottom Navigation
```

Hero Card

Contains

- Pantry Health Score
- Recommendation
- Progress Bar
- Out of Stock Count
- Running Low Count

Ingredient Card Layout

```
Ingredient Name

Status Badge

Available

Minimum

Category

Actions
```

Visual Notes

- Compact spacing
- Status badge aligned with title
- Rounded cards
- Consistent typography
- Soft shadows
- Mobile-first

---

# Grocery

Status

🔵 Planned

Purpose

Help users efficiently complete shopping.

Primary Question

> What do I still need to buy?

Planned Layout

```
Header

Search

Shopping Progress Hero

Shopping Insights

Summary Cards

Store Filter

Shopping List

Floating Add Button

Bottom Navigation
```

Hero

Shopping Progress

Recommendation

Estimated Budget

Remaining Items

Completion Progress

---

# Recipes

Status

🔵 Planned

Purpose

Help users discover and cook recipes.

Primary Question

> What can I cook today?

Planned Layout

```
Header

Search

Recipe Collection Hero

Quick Filters

Categories

Recipe Cards

Bottom Navigation
```

Hero

Recipe Collection

Suggested Recipes

Available Ingredients

Favorite Recipes

---

# Planner

Status

🔵 Planned

Purpose

Help users organize weekly meals.

Primary Question

> What am I cooking this week?

Planned Layout

```
Header

Weekly Planning Hero

Today's Meals

Weekly Calendar

Meal Cards

Bottom Navigation
```

Hero

Weekly Progress

Meals Planned

Remaining Days

Shopping Status

---

# Budget

Status

⚪ Future

Purpose

Monitor grocery spending.

Primary Question

> Am I within budget?

Planned Layout

```
Header

Budget Health Hero

Monthly Summary

Transactions

Insights

Bottom Navigation
```

---

# Settings

Status

⚪ Future

Purpose

Configure Kitchen Brain.

Primary Question

> How do I personalize my kitchen?

---

# Profile

Status

⚪ Future

Purpose

Manage user profile.

---

# Shared Components

Every approved screen should reuse:

- Hero Card
- Insight Card
- Metric Cards
- Item Cards
- Status Badges
- FAB
- Bottom Navigation
- Search Section

No module should introduce unique component styles unless approved.

---

# Bottom Navigation

Approved Mobile Navigation

```
Dashboard

Pantry

Grocery

Recipes

Planner
```

Budget, Settings and Profile remain accessible from the menu.

---

# Floating Action Button

Approved Style

```
＋ Add
```

Rules

- Bottom-right
- Floating
- Green
- Never overlap content
- Consistent across all modules

---

# Future Screens

Reserved

- AI Kitchen Assistant
- Nutrition Dashboard
- Shopping History
- Family Management
- Store Comparison
- Analytics
- Notifications
- Achievements

---

# Review Process

A screen is added to this library only after:

- Layout approved
- Mobile verified
- Desktop verified
- Responsive verified
- UX reviewed
- Product approved

---

# Revision History

| Version | Sprint | Notes |
|----------|---------|------|
| 1.0 | Sprint 18 | Initial Screen Library created. Pantry added as the first approved screen. |

---

# Approval

This document is the official visual reference for Kitchen Brain.

Any future redesigns should update this library after approval.