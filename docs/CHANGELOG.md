# Changelog

All notable changes to Nair Kitchen will be documented in this file.

The project follows a simplified semantic versioning approach.

---

# v1.0.0-alpha

## Added

### Dashboard

- Dashboard summary cards
- Pantry statistics
- Grocery summary
- Planner summary

### Pantry

- Add/Edit ingredients
- Quantity tracking
- Unit dropdown
- Expiry tracking
- Minimum stock
- Smart category suggestion

### Recipes

- Recipe management
- Multiple meal types
- Ingredient unit selection
- Recipe editing
- Grocery integration

### Planner

- Weekly meal planning
- Morning Drink support
- Recipe selection
- Planner persistence
- Grocery generation

### Grocery

- Shopping management
- Duplicate detection
- Quantity + Unit support
- Category suggestion
- Merge duplicate items

### Infrastructure

- KitchenContext
- ToastContext
- ConfirmModal
- Shared Constants
- Shared Services

### Documentation

- Architecture Decision Records
- Architecture Overview
- Changelog

---

## Changed

- Replaced browser alerts with Toast notifications.
- Replaced browser confirm dialogs with reusable ConfirmModal.
- Centralized categories and units.
- Improved Planner workflow.
- Improved Grocery generation.

---

## Fixed

- Duplicate Grocery items.
- Recipe meal type handling.
- Planner integration.
- Pantry category consistency.
- Unit selection consistency.