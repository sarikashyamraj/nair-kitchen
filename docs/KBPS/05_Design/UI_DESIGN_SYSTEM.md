# Kitchen Brain UI Design System

**Document Version:** 1.0  
**Status:** Approved  
**Release:** Kitchen Brain v1.2 – Smart Kitchen  
**Owner:** Kitchen Brain Product Specification (KBPS)

---

# 1. Purpose

The Kitchen Brain UI Design System defines the visual language, interaction patterns, spacing, typography, navigation, and reusable UI principles used throughout the application.

This document serves as the single source of truth for all present and future Kitchen Brain interfaces.

Every new screen, component, and feature must follow this design system.

---

# 2. Design Philosophy

Kitchen Brain is designed around one simple principle:

> **Show the most important decision first.**

Instead of displaying raw information, every screen should immediately answer the user's primary question.

Examples:

| Module | Primary Question |
|----------|------------------|
| Dashboard | How is my kitchen today? |
| Pantry | What needs restocking? |
| Grocery | What do I still need to buy? |
| Planner | What am I cooking this week? |
| Recipes | What can I cook today? |
| Budget | Am I within budget? |

---

# 3. Design Principles

## Mobile First

Every feature is designed for mobile before desktop.

Desktop layouts are responsive adaptations—not separate designs.

---

## Information Before Decoration

Visual elements should support information rather than distract from it.

Users should immediately understand what requires attention.

---

## Consistency

All modules should share the same design language.

Users should never feel they are using different applications.

---

## Action Driven

Every screen should guide the next logical action.

Examples:

- Pantry → Restock ingredients
- Grocery → Complete shopping
- Planner → Cook today's meals
- Budget → Stay within spending

---

## Minimal Cognitive Load

Kitchen Brain should reduce:

- scrolling
- taps
- unnecessary decisions
- visual clutter

---

# 4. Layout Structure

Every major screen follows the same layout hierarchy.

```
Header

↓

Page Title

↓

Search / Filters

↓

Hero Card

↓

Insights

↓

Metric Cards

↓

Main Content

↓

Floating Action Button

↓

Bottom Navigation
```

---

# 5. Spacing System

## Vertical Rhythm

| Section | Spacing |
|----------|---------|
| Header → Title | 12 px |
| Title → Search | 12 px |
| Search → Hero | 16 px |
| Hero → Insights | 16 px |
| Insights → Metrics | 16 px |
| Metrics → Content | 16 px |

---

## Card Padding

16 px

---

## Screen Padding

16–20 px

---

## Card Gap

16 px

---

# 6. Card Types

Kitchen Brain uses only four primary card types.

---

## Hero Card

Purpose:

Display the most important information on the screen.

Contains:

- Primary KPI
- Recommendation
- Progress Bar
- Supporting Summary

Examples:

- Pantry Health
- Shopping Progress
- Weekly Meal Progress
- Budget Health

---

## Insight Card

Purpose:

Highlight important information requiring user attention.

Examples:

- Needs Attention
- Upcoming Meals
- Budget Warning
- Expiring Ingredients

---

## Metric Card

Purpose:

Display quick statistics.

Maximum:

4 cards per row.

Examples:

- Total
- Completed
- Running Low
- Out of Stock

---

## Item Card

Purpose:

Represent a single record.

Examples:

- Ingredient
- Grocery Item
- Recipe
- Meal
- Budget Entry

Standard Layout:

```
Title

Status

Primary Details

Secondary Details

Actions
```

---

# 7. Navigation System

## Desktop

Primary navigation uses the left sidebar.

---

## Mobile

Primary navigation uses a fixed bottom navigation bar.

Modules:

- Dashboard
- Pantry
- Grocery
- Recipes
- Planner

Secondary modules remain accessible through the menu.

Examples:

- Budget
- Settings
- Profile
- Help

---

# 8. Floating Action Button (FAB)

Purpose:

Primary action on each screen.

Location:

Bottom-right corner.

Rules:

- Never overlap important content.
- Maintain consistent spacing from screen edges.
- Use throughout the application.

Label:

```
+ Add
```

---

# 9. Typography

| Style | Size |
|--------|------|
| Hero Value | 28 px |
| Section Title | 22 px |
| Card Title | 18 px |
| Body | 16 px |
| Secondary | 13 px |
| Caption | 12 px |

Typography should remain consistent throughout the application.

---

# 10. Color System

## Primary Green

Used for:

- Positive status
- Success
- Kitchen Health

---

## Accent Gold

Used for:

- Branding
- Highlights

---

## Warning Amber

Used for:

- Running Low
- Attention

---

## Critical Red

Used for:

- Out of Stock
- Errors
- Critical Alerts

---

## Neutral Gray

Used for:

- Secondary Information
- Disabled States

---

## Background

Warm Cream

Used consistently across the application.

---

# 11. Status Colors

| Status | Color |
|---------|-------|
| Healthy | Green |
| Warning | Amber |
| Critical | Red |
| Information | Blue |
| Inactive | Gray |

---

# 12. Border Radius

| Component | Radius |
|------------|--------|
| Cards | 20 px |
| Inputs | 14 px |
| Buttons | 14 px |
| FAB | Circular |
| Badges | Pill (999 px) |

---

# 13. Shadows

Light Shadow

- Cards

Medium Shadow

- Dialogs

Strong Shadow

- Floating Action Button

Shadow usage should remain subtle.

---

# 14. Icons

Kitchen Brain uses **Lucide Icons** throughout the application.

Emoji should not be used in production UI except for:

- Toast notifications
- Empty states
- Celebration screens

---

# 15. Search Pattern

Every searchable page should contain:

- Search Box
- Category Filter

Future enhancements:

- Sort
- Voice Search
- Barcode Scanner

---

# 16. Hero Pattern

Every primary module begins with a Hero Card.

The Hero Card should contain:

- KPI
- Recommendation
- Progress
- Quick Summary

---

# 17. Empty States

Empty screens should always:

- Explain why no data exists.
- Suggest the next action.

Never display blank pages.

---

# 18. Animation Guidelines

Animation Duration:

200–300 ms

Recommended:

- Fade
- Slide
- Progress Fill
- Button Press

Avoid:

- Bounce
- Heavy Motion
- Long Transitions

---

# 19. Accessibility

Minimum touch target:

44 px

Contrast:

WCAG AA

Support:

- Dynamic Text
- Keyboard Navigation
- Screen Readers

---

# 20. Component Standards

Shared styling should be maintained for:

- Cards
- Buttons
- Badges
- Inputs
- Dialogs
- Navigation

Components should be reusable across all modules.

---

# 21. Future Enhancements

The design system will expand to include:

- Dark Mode
- Tablet Optimizations
- Landscape Mode
- Widgets
- Voice Interaction
- AI Assistant

---

# 22. Revision History

| Version | Sprint | Notes |
|----------|---------|------|
| 1.0 | Sprint 18 | Initial Kitchen Brain Design System established following Pantry UI redesign. |

---

# 23. Approval

This document is the official UI design reference for Kitchen Brain.

Any future UI changes should be reviewed against this design system before implementation.