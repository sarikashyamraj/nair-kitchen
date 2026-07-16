# Changelog

All notable changes to Kitchen Brain will be documented in this file.

---

## Version 1.1.0 — Release Candidate

### Added

#### Mobile Experience
- Responsive application layout for desktop, tablet, and mobile devices.
- Mobile navigation drawer.
- Responsive Dashboard cards.
- Reusable Mobile Design System components.
- `MobileListCard` reusable component.
- `MobilePageHeader` reusable component.
- `MobileSearchBar` reusable component.
- `MobileFAB` reusable component.
- `MobileStatCard` reusable component.
- Mobile-friendly Planner cards.
- Mobile-optimized Pantry, Grocery, Recipes, Budget, Profile, and Settings pages.
- Reusable Bottom Sheet component for mobile-friendly workflows.

#### Smart Grocery
- Improved Grocery management experience.
- Grocery item search and category filtering.
- Grocery item add, edit, and delete functionality.
- Purchased and remaining item tracking.
- Grocery completion percentage.
- Shopping Checkout Bottom Sheet.
- Shopping date selection.
- Grocery bill amount recording.
- Shopping notes.
- Purchased-item review before completing shopping.
- Automatic transfer of purchased Grocery items to Pantry.
- Unpurchased items remain in the Grocery list.
- Automatic Grocery expense creation after Checkout.
- Shopping-session history storage.

#### Grocery Budget
- Monthly Grocery Budget management.
- Monthly spending calculation.
- Remaining-budget calculation.
- Over-budget status.
- Budget usage percentage.
- Dynamic budget progress indicator.
- Grocery Transaction History.
- Transaction date, store, amount, description, notes, and item-count tracking.
- Edit Grocery Transaction Bottom Sheet.
- Delete Transaction confirmation.
- Automatic recalculation after editing or deleting transactions.
- Dashboard Monthly Grocery Budget summary.
- Styled validation messages for invalid budget and transaction values.

#### Dashboard
- Dashboard connected to the Weekly Meal Planner.
- Today’s Meal Plan displayed dynamically.
- Morning Drink, Breakfast, Lunch, Snack, and Dinner support.
- Dynamic Pantry statistics.
- Dynamic Recipe statistics.
- Dynamic Grocery statistics.
- Kitchen Health calculation.
- Monthly Grocery Budget summary.
- Dynamic greeting based on the time of day.
- Profile name, role, and image integration.
- Notification centre for:
  - Low-stock Pantry items.
  - Pending Grocery items.
  - Unplanned meals.

#### Settings and Regional Preferences
- Settings page.
- Worldwide country selection.
- Searchable worldwide Currency Picker.
- Currency search by currency code, name, and symbol.
- Country-aware Grocery store suggestions.
- Shared regional store system.
- Recently used Grocery stores.
- Last-used store memory.
- Custom Grocery store support.
- Duplicate-store prevention.
- Generic fallback stores for countries without predefined store lists.
- Shared regional stores in Grocery Checkout and Budget Transaction editing.
- Currency preference integration across Dashboard, Grocery, and Budget.
- Date-format preference support:
  - `DD/MM/YYYY`
  - `MM/DD/YYYY`
  - `YYYY-MM-DD`
- Shared date-formatting utility.
- App-wide date-format integration for visible application dates.
- Week-start preference.
- Measurement-system preference.
- Notification preferences.

#### Profile
- Editable user profile.
- Profile name and role.
- Profile image support.
- Profile information integrated with the application header.
- Initial-based avatar fallback when no profile image is available.

### Changed
- Dashboard optimized for mobile devices.
- Header redesigned for smaller screens.
- Introduced responsive navigation.
- Grocery replaced the previous Shopping route and terminology.
- Recipes now use the shared Kitchen Context.
- Recipe updates are immediately available in the Weekly Planner without requiring a page refresh.
- Grocery Checkout moved from a separate page into a Bottom Sheet.
- Budget and Grocery respond to updated Settings preferences.
- Dashboard currency follows the latest saved Currency preference.
- Budget Transaction History now displays the Grocery store.
- Budget Transaction History follows the selected Date Format.
- Improved validation messages across Grocery Checkout and Budget.
- Improved responsive layouts across all core application modules.
- Improved consistency for cards, forms, buttons, Bottom Sheets, notifications, and confirmation dialogs.

### Fixed
- Fixed Recipe-to-Planner synchronization after editing Recipe meal types.
- Fixed stale Recipe data that previously required a page refresh.
- Fixed Dashboard currency not updating from the latest Settings preference.
- Fixed regional Currency Picker integration.
- Fixed JSX structure errors in the Settings page.
- Fixed Grocery Checkout and Budget store synchronization.
- Fixed custom and recently used Grocery store persistence.
- Fixed date parsing to prevent timezone-related date changes.
- Fixed mobile layout and component-overflow issues identified during responsive testing.

### Removed
- Removed expiry-date tracking from Pantry to simplify ingredient management.
- Removed the obsolete `/shopping` route.
- Removed the temporary `/test-bottom-sheet` development route.
- Removed the separate Grocery Checkout page after Checkout was moved into the Bottom Sheet.
- Removed TypeScript build-error bypass configuration.

### Architecture
- Introduced reusable `components/mobile` folder.
- Expanded the reusable Mobile Design System.
- Added shared Kitchen Context integration across Pantry, Recipes, Grocery, Planner, and Dashboard.
- Added reusable Bottom Sheet architecture.
- Added shared regional Grocery store data.
- Added shared custom-store and recent-store preference utilities.
- Added shared worldwide country data.
- Added shared worldwide Currency data.
- Added shared date-formatting utilities.
- Continued Local Storage persistence for user data and application preferences.

### Quality Assurance
- Completed full functional regression testing for:
  - Dashboard
  - Planner
  - Recipes
  - Pantry
  - Grocery
  - Budget
  - Profile
  - Settings
- Completed data-persistence testing.
- Completed empty-state and validation testing.
- Completed mobile, tablet, and desktop responsive testing.
- Completed UI consistency review.
- Completed local production-mode testing.
- Verified direct route refreshes in production mode.
- Enabled full TypeScript validation during production builds.
- Completed a successful TypeScript-validated production build.
- Verified all active application routes build successfully.

---

## Version 1.0.0 — July 2026

### Added
- Professional Dashboard.
- Pantry management.
- Grocery management.
- Recipe management.
- Weekly Meal Planner.
- Quick Actions.
- Pantry Health Dashboard.
- Reusable UI components.
- Responsive desktop layout.

### Technical
- Next.js 16.
- React 19.
- TypeScript.
- Tailwind CSS.
- Context API.
- Local Storage.
- GitHub repository.

# [0.9.0] - Cloud Core Complete
Date: July 2026

## Added

### Authentication
- User authentication with Supabase
- Password reset
- Session management
- Protected routes

### User Management
- Cloud Profile
- Family Members
- Profile photo uploads
- Family member photo uploads

### Preferences
- Cloud synced user preferences
- Currency
- Date format
- Measurement system preference

### Pantry
- Cloud Pantry
- Add/Edit/Delete ingredients
- Search
- Category filter
- Low stock alerts

### Recipes
- Cloud Recipes
- Recipe ingredients
- Multiple meal types
- Recipe categories

### Weekly Planner
- Cloud Meal Planner
- Planner persistence
- Grocery generation

### Grocery
- Cloud Grocery
- Purchased status
- Planner integration
- Pantry synchronization

### Budget
- Cloud Monthly Budget
- Grocery expense tracking
- Transaction management

### Shopping Sessions
- Shopping session service
- Shopping history architecture

## Architecture

Added cloud service layer:

- profileService
- preferencesService
- pantryService
- recipeService
- plannerService
- groceryService
- budgetService
- shoppingSessionService

Application architecture:

UI
↓
KitchenContext
↓
Services
↓
Supabase

## Security

- Row Level Security
- Supabase Storage
- Secure image uploads
- User isolation

## Fixed

- Planner persistence
- Pantry synchronization
- Grocery synchronization
- Profile image persistence
- Family image persistence
- Avatar synchronization
- Budget persistence
- Password recovery