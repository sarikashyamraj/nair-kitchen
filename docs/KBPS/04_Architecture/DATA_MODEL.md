# Kitchen Brain Product Specification (KBPS)

## Chapter 3 – Data Model

---

## Document Information

| Property | Value |
|----------|-------|
| Document | Data Model |
| Version | 1.0 |
| Status | Review 1 |
| Owner | Sarika |
| Technical Architect | ChatGPT |
| Last Updated | 06 August 2026 |

---

# Purpose

The Data Model defines how information is organized within Kitchen Brain.

Rather than describing database tables or TypeScript interfaces, this document defines the business entities that power the application.

The goal is to ensure consistency, scalability and clear ownership as Kitchen Brain evolves from a smart kitchen manager (Version 1.x) into an AI-powered household assistant (Version 2.x).

---

# Table of Contents

1. Data Philosophy
2. Data Ownership Principles
3. Business Domains
4. Core Entities
5. Entity Relationships
6. Data Lifecycle
7. Derived Data
8. AI Data
9. Synchronization Strategy
10. Future Data Model
11. Dependencies
12. Revision History

---

# 1. Data Philosophy

Kitchen Brain treats data as long-lived product assets.

Every piece of information should:

- Have one owner.
- Exist only once.
- Be reusable across modules.
- Support intelligent recommendations.
- Remain independent from UI implementation.

Pages display information.

Domains own information.

---

# 2. Data Ownership Principles

The following rules apply throughout the application.

## Rule 1 – One Owner

Every entity has exactly one owner.

Examples:

| Entity | Owner |
|---------|-------|
| Pantry Item | Pantry Domain |
| Recipe | Recipe Domain |
| Meal Plan | Planning Domain |
| Grocery Item | Grocery Domain |
| Budget Entry | Budget Domain |

---

## Rule 2 – Read Before Duplicate

Modules should consume existing information rather than storing duplicate copies.

Example:

Planner reads Pantry inventory.

Planner never stores Pantry inventory.

---

## Rule 3 – Derived Data Is Calculated

The following values should never be permanently stored:

- Kitchen Health Score
- Pantry Health
- Grocery Progress
- Budget Progress
- Shopping Completion
- Weekly Planning Completion

These values are generated whenever required.

---

## Rule 4 – AI Never Owns Product Data

AI reads data.

AI recommends actions.

AI explains recommendations.

AI never becomes the permanent owner of business information.

---

# 3. Business Domains

Kitchen Brain is organized around domains instead of pages.

## Pantry Domain

Owns:

- Pantry Items
- Stock Levels
- Expiry
- Storage
- Consumption

---

## Recipe Domain

Owns:

- Recipes
- Ingredients
- Instructions
- Cuisine
- Difficulty

Future:

- Nutrition
- Cooking Videos

---

## Planning Domain

Owns:

- Weekly Plans
- Daily Meals
- Meal History

---

## Grocery Domain

Owns:

- Shopping Lists
- Purchased Status
- Shopping History

---

## Budget Domain

Owns:

- Monthly Budget
- Spending
- Budget History

---

## Intelligence Domain

Owns no permanent data.

Produces:

- Kitchen Health
- Insights
- Recommendations

---

## AI Domain (Version 2)

Owns:

Conversation History

Reads:

Everything else.

---

# 4. Core Entities

---

## Pantry Item

Purpose

Represents one ingredient stored in the household.

Primary Fields

- Name
- Category
- Quantity
- Unit
- Minimum Quantity
- Expiry Date
- Purchase Date
- Storage Location
- Notes
- Status

Owned By

Pantry Domain

---

## Recipe

Purpose

Represents one reusable recipe.

Primary Fields

- Name
- Category
- Meal Type
- Ingredients
- Instructions
- Preparation Time
- Cooking Time
- Difficulty
- Servings

Future Fields

- Nutrition
- Cooking Videos
- Ratings

Owned By

Recipe Domain

---

## Meal Plan

Purpose

Represents meals planned for a day.

Primary Fields

- Date
- Meal Type
- Recipe
- Servings

Owned By

Planning Domain

---

## Grocery Item

Purpose

Represents one shopping requirement.

Primary Fields

- Ingredient
- Quantity
- Unit
- Purchased
- Category

Owned By

Grocery Domain

---

## Budget

Purpose

Represents household grocery spending.

Primary Fields

- Monthly Budget
- Amount Spent
- Currency
- Spending History

Owned By

Budget Domain

---

## Recommendation

Purpose

Represents temporary guidance produced by Kitchen Intelligence.

Examples

- Buy Milk
- Use Tomatoes Soon
- Plan Weekend Meals

Owned By

No module.

Generated dynamically.

---

# 5. Entity Relationships

```text
Kitchen

│

├── Pantry

│      │

│      └── Pantry Items

│

├── Recipes

│      │

│      └── Ingredients

│

├── Planner

│      │

│      └── Meal Plans

│

├── Grocery

│      │

│      └── Grocery Items

│

├── Budget

│

├── Kitchen Intelligence

│

└── AI Assistant
```

---

# 6. Data Lifecycle

Example

Ingredient Purchased

↓

Added to Pantry

↓

Used in Recipe

↓

Quantity Updated

↓

Planner Recalculates

↓

Grocery Recalculates

↓

Kitchen Intelligence Updates

↓

Dashboard Refreshes

This flow illustrates how information moves through the system while ownership remains unchanged.

---

# 7. Derived Data

Kitchen Brain calculates several values dynamically.

Examples include:

- Kitchen Health Score
- Pantry Health
- Grocery Completion
- Budget Usage
- Weekly Meal Completion
- Pantry Value (Future)

Derived data should never become the primary source of truth.

---

# 8. AI Data

The AI Assistant introduces temporary conversational data.

Examples

- User Questions
- AI Responses
- Suggested Meals
- Shopping Advice

This information should remain separate from permanent business entities.

AI recommendations only become permanent after explicit user confirmation.

---

# 9. Synchronization Strategy

Version 1

Primary storage:

- Supabase
- Local Cache

Future versions may introduce:

- Offline synchronization
- Multi-device synchronization
- Family collaboration
- Conflict resolution

---

# 10. Future Data Model

Future entities may include:

- Nutrition Profile
- Family Member
- Dietary Preference
- Kitchen Appliance
- Shopping Store
- Barcode
- Pantry Image
- Voice Conversation
- Cooking Session

The current architecture should support these entities without requiring structural redesign.

---

# 11. Dependencies

Related KBPS Documents

- PRODUCT_VISION.md
- ARCHITECTURE.md
- DESIGN_SYSTEM.md
- ROADMAP.md
- AI_STRATEGY.md

---

# 12. Open Questions

The following topics require future design decisions:

- Multiple Kitchens
- Shared Family Accounts
- Offline-first Synchronization
- AI Memory Duration
- Pantry Consumption Tracking
- Nutrition Data Sources

---

# 13. Future Considerations

Potential future enhancements include:

- Barcode-based Pantry Items
- Receipt OCR
- Automatic Expiry Detection
- Smart Ingredient Substitution
- Pantry Image Recognition
- AI Shopping Predictions

---

# 14. Revision History

| Version | Date | Summary |
|----------|------|---------|
| 1.0 | 06 Aug 2026 | Initial Data Model Specification |