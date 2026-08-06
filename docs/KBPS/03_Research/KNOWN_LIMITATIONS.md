# Kitchen Brain Product Specification (KBPS)

## Research Document – Known Limitations

---

## Document Information

| Property | Value |
|----------|-------|
| Document | Known Limitations |
| Version | 1.0 |
| Status | Active |
| Owner | Sarika |
| Last Updated | 06 August 2026 |

---

# Purpose

This document records the known product, technical, data, UX and operational limitations of Kitchen Brain.

The purpose is to maintain an honest view of the current product and prevent unresolved limitations from being forgotten as new features are developed.

A limitation does not automatically represent a defect.

Some limitations are intentional boundaries of the current release, while others represent technical debt, missing infrastructure or future roadmap work.

Known limitations should be reviewed during:

- Sprint planning.
- Architecture reviews.
- Regression testing.
- Release preparation.
- Product retrospectives.
- App Store readiness reviews.

---

# Limitation Management Principles

## Rule 1 — Be Explicit

Known limitations should be documented clearly rather than hidden behind optimistic product language.

---

## Rule 2 — Distinguish Limitations from Bugs

A bug is behaviour that contradicts the approved specification.

A limitation is an acknowledged boundary of the current implementation.

Example:

- The Grocery progress bar showing the wrong percentage is a bug.
- Grocery prediction not yet existing is a limitation.

---

## Rule 3 — Prioritise by User Impact

Limitations that risk data loss, broken workflows, poor performance or user confusion should receive higher priority.

---

## Rule 4 — Avoid Temporary Workarounds Becoming Permanent

Temporary implementation decisions should be reviewed before each major release.

---

## Rule 5 — Do Not Overstate Capabilities

Product copy, onboarding and release notes must reflect what Kitchen Brain can reliably do today.

Planned AI, predictive, nutrition or collaboration capabilities should not be presented as released functionality.

---

# Status Definitions

| Status | Meaning |
|--------|---------|
| Open | Limitation currently exists |
| Under Review | Scope and solution are being evaluated |
| Planned | Resolution belongs to an approved roadmap item |
| Accepted | Intentionally retained for the current product scope |
| Resolved | Limitation has been addressed |
| Deferred | Resolution is intentionally postponed |

---

# Severity Definitions

| Severity | Meaning |
|----------|---------|
| Critical | Risks data loss, security, privacy or core workflow failure |
| High | Significantly affects an important user journey |
| Medium | Noticeable but has a practical workaround |
| Low | Minor inconvenience or future refinement |
| Informational | Documented product boundary rather than a defect |

---

# 1. Product Scope Limitations

---

## 1.1 Kitchen Brain Is Not Yet a Native Mobile Application

**Status:** Open  
**Severity:** High  
**Target:** Future App Store preparation

Kitchen Brain currently runs as a Next.js web application.

Although the interface is mobile responsive, it is not yet packaged and validated as a native iOS or Android application.

Current implications:

- No App Store distribution.
- No native push notifications.
- No native home-screen widgets.
- No native barcode scanner.
- No guaranteed background synchronization.
- Limited access to device-specific capabilities.
- Mobile browser behaviour may differ from installed-app behaviour.

Before App Store release, a deliberate mobile architecture decision will be required.

Possible approaches include:

- Progressive Web App.
- Capacitor.
- React Native.
- Expo.
- A dedicated native client using shared backend services.

The final choice should be made through an Architecture Decision Record.

---

## 1.2 Public Release Readiness Is Incomplete

**Status:** Open  
**Severity:** High  
**Target:** Before public beta

Kitchen Brain has not yet completed a full public-release readiness process.

Missing or incomplete areas may include:

- Privacy Policy.
- Terms of Service.
- Account deletion workflow.
- Data export.
- Support contact.
- Production analytics.
- Crash reporting.
- Security review.
- Accessibility audit.
- App Store metadata.
- Device screenshots.
- Production monitoring.
- User onboarding.
- Public feedback workflow.

The application should not be treated as App Store-ready until these items are completed and verified.

---

## 1.3 Current Product Design Is Primarily Based on One Household

**Status:** Open  
**Severity:** Medium  
**Target:** Before wider user testing

Many workflows have been designed using the requirements of the initial household.

This has helped create a practical product, but it may introduce assumptions that do not generalise to all users.

Potential assumptions include:

- Household size.
- Meal structure.
- Cuisine preferences.
- Weekly shopping behaviour.
- Grocery units.
- Currency.
- Planning habits.
- Pantry categories.
- Budget practices.

Broader user testing is required before general public release.

---

## 1.4 Multi-Household Support Does Not Exist

**Status:** Deferred  
**Severity:** Informational  
**Target:** Version 2.1 or later

The current architecture assumes one primary kitchen per authenticated user.

The product does not yet support:

- Multiple homes.
- Multiple kitchens.
- Holiday-home kitchens.
- Shared apartments.
- Office kitchens.
- Switching between households.

Adding this capability would affect ownership, permissions, navigation, synchronization and database relationships.

---

# 2. Authentication and Account Limitations

---

## 2.1 Household Membership and Roles Are Limited

**Status:** Open  
**Severity:** Medium  
**Target:** Family Collaboration

Current profile and family-member functionality does not yet provide full household collaboration.

Missing capabilities include:

- Inviting household members.
- Shared account access.
- Role-based permissions.
- Individual authentication for family members.
- Household ownership transfer.
- Activity history by member.
- Approval rules.

Family members currently function primarily as profile information rather than independent application users.

---

## 2.2 Account Recovery and Account Management Require Full Validation

**Status:** Under Review  
**Severity:** High  
**Target:** Before public beta

Authentication flows should be fully tested for:

- Sign up.
- Sign in.
- Sign out.
- Password reset.
- Email verification.
- Session expiry.
- Token refresh.
- Deleted accounts.
- Disabled accounts.
- Multiple-device sessions.

The current application should not assume that a successful development login proves production-grade account reliability.

---

## 2.3 Account Deletion and Data Export Are Not Fully Defined

**Status:** Open  
**Severity:** High  
**Target:** Before public release

Users should eventually be able to:

- Delete their account.
- Export their data.
- Understand what data is retained.
- Understand how long deleted data remains in backups.

These workflows are important for privacy, trust and App Store readiness.

---

# 3. Data and Synchronization Limitations

---

## 3.1 Offline Support Is Incomplete

**Status:** Open  
**Severity:** High  
**Target:** Future offline architecture

Kitchen Brain uses cloud data and selected local caching, but it is not currently a complete offline-first application.

Possible offline limitations include:

- Edits may fail without connectivity.
- Cached dashboard information may become stale.
- Forms may not queue changes.
- Conflict resolution is not implemented.
- Users may not know whether displayed data is current.
- Reconnection behaviour may vary by module.

A proper offline strategy requires:

- Local persistent database.
- Mutation queue.
- Sync status.
- Conflict resolution.
- Retry handling.
- Last-synced indicators.
- Data versioning.

---

## 3.2 Multi-Device Conflict Resolution Is Not Defined

**Status:** Open  
**Severity:** Medium  
**Target:** Future synchronization work

If the same kitchen data is modified from two devices, Kitchen Brain does not yet have a formal conflict-resolution strategy.

Examples:

- Two users edit the same Pantry Item.
- Grocery purchase status changes on two phones.
- Meal plans are updated at the same time.
- A transaction is edited from multiple devices.

A future synchronization design must define whether the system uses:

- Last write wins.
- Field-level merging.
- Version numbers.
- Conflict prompts.
- Activity history.

---

## 3.3 Some Legacy Local Storage Assumptions May Remain

**Status:** Under Review  
**Severity:** Medium  
**Target:** Ongoing cleanup

Kitchen Brain evolved from local storage toward Supabase cloud persistence.

Some services or types may still contain compatibility logic for older local identifiers or workflows.

Example:

- Local shopping-session identifiers may not be valid cloud UUIDs.
- Some records may have been created before cloud ownership rules were introduced.
- Old cached data may not match the latest schema.

Legacy compatibility code should be reviewed and removed only after safe migration.

---

## 3.4 Database Migration Process Is Not Yet Formalised

**Status:** Open  
**Severity:** High  
**Target:** Before production scale

Schema changes currently require careful manual coordination.

A formal migration process should eventually include:

- Versioned SQL migrations.
- Development and production environments.
- Rollback planning.
- Data backfills.
- Migration testing.
- Schema documentation.
- Backup verification.

This is especially important before adding expiry, nutrition, family collaboration or AI-related entities.

---

## 3.5 Data Retention Rules Are Not Defined

**Status:** Open  
**Severity:** Medium  
**Target:** Before public release

Kitchen Brain has not yet formally defined retention periods for:

- Grocery history.
- Budget transactions.
- AI conversations.
- Deleted Pantry Items.
- Deleted recipes.
- Account activity.
- User feedback.
- Uploaded images.
- Receipt scans.

Retention should balance usefulness, privacy and storage cost.

---

# 4. Pantry Limitations

---

## 4.1 Expiry Intelligence Is Not Yet Implemented

**Status:** Planned  
**Severity:** High  
**Target:** Sprint 18

The current Pantry primarily tracks inventory quantity and minimum stock.

It does not yet reliably support:

- Purchase date.
- Expiry date.
- Opened date.
- Shelf life.
- Use Soon status.
- Expires Today status.
- Expired status.
- Storage location.
- Freshness guidance.
- Waste-risk estimation.

Until Sprint 18 is complete, Pantry Intelligence is limited mainly to stock quantity.

---

## 4.2 Quantity and Unit Normalisation Is Limited

**Status:** Open  
**Severity:** High  
**Target:** Smart Pantry and Better Grocery Engine

Pantry quantities may use different representations.

Examples:

- `1 kg`
- `1000 g`
- `1 packet`
- `2 pcs`
- `1 Nos`
- `1 tbsp`

Kitchen Brain does not yet provide a complete unit-conversion and normalisation engine.

This affects:

- Duplicate detection.
- Recipe availability.
- Grocery generation.
- Cost calculation.
- Pantry deduction.
- Quantity prediction.

A reliable unit strategy is required before advanced pantry and grocery intelligence can be considered accurate.

---

## 4.3 Pantry Consumption Is Not Automatically Tracked

**Status:** Open  
**Severity:** Medium  
**Target:** Future Pantry Intelligence

Kitchen Brain does not yet know when ingredients are consumed unless users manually update quantities or another workflow explicitly updates them.

This limits:

- Predictive Grocery.
- Consumption forecasting.
- Waste calculation.
- Household usage patterns.
- Reorder timing.
- AI learning.

Automatic deduction from planned or cooked recipes should not be implemented without user control because planned meals do not always equal consumed meals.

---

## 4.4 Pantry Categories Are Not Fully Customisable

**Status:** Open  
**Severity:** Low  
**Target:** Future refinement

Current Pantry categories are primarily based on predefined application constants and category suggestions.

Users may eventually need:

- Custom categories.
- Category renaming.
- Category ordering.
- Regional category templates.
- Household-specific categories.

Customisation should not reduce consistency required by search and intelligence features.

---

## 4.5 Leftovers and Prepared Food Are Not Properly Modelled

**Status:** Open  
**Severity:** Medium  
**Target:** Future Pantry Intelligence

The current Pantry model is more suitable for ingredients than prepared food.

It does not yet fully represent:

- Leftover meals.
- Prepared sauces.
- Homemade spice mixes.
- Cooked rice.
- Opened packaged food.
- Portion counts.
- Prepared date.
- Safe use-by date.

This limits food-waste prevention beyond raw ingredients.

---

## 4.6 Pantry Health Is Still Simplified

**Status:** Open  
**Severity:** Medium  
**Target:** Sprint 18 and later

Current pantry-related health calculations primarily consider quantity and low-stock status.

A mature Pantry Health model may eventually consider:

- Expiry.
- Waste risk.
- Category coverage.
- Stock balance.
- Frequently missing staples.
- Storage quality.
- Consumption patterns.
- Duplicate products.

The score should not imply scientific precision unless its calculation is clearly documented.

---

# 5. Recipe Limitations

---

## 5.1 Recipe Import Is Limited

**Status:** Open  
**Severity:** Medium  
**Target:** Future Recipe enhancements

Kitchen Brain does not yet provide reliable recipe importing from:

- Websites.
- YouTube descriptions.
- Images.
- PDFs.
- Social media.
- External recipe services.

Manual entry remains the primary workflow.

Future import tools must allow user review before saving extracted information.

---

## 5.2 Recipe Ingredients Are Not Fully Normalised

**Status:** Open  
**Severity:** High  
**Target:** Before advanced AI planning

Recipe ingredient names may not always match Pantry Item names.

Examples:

- Tomato vs Tomatoes.
- Capsicum vs Bell Pepper.
- Curd vs Yogurt.
- Coriander vs Cilantro.
- Chicken Breast vs Chicken.

This limits:

- Pantry matching.
- Grocery generation.
- Recipe availability checks.
- Ingredient substitutions.
- AI recommendations.

A synonym and canonical-ingredient strategy will be needed.

---

## 5.3 Nutrition Data Is Not Yet Available

**Status:** Planned  
**Severity:** Informational  
**Target:** Version 2.0

Recipes currently do not have a complete verified nutrition model.

Missing or incomplete information may include:

- Calories.
- Protein.
- Carbohydrates.
- Fat.
- Fibre.
- Sugar.
- Sodium.
- Serving-based calculation.

Kitchen Brain must not present guessed nutrition values as verified facts.

---

## 5.4 Recipe Video Linking Is Not Yet Implemented

**Status:** Planned  
**Severity:** Informational  
**Target:** Guided Cooking, Version 2.0

Recipes do not yet support structured video references.

Future Guided Cooking may include:

- YouTube links.
- Preferred creators.
- Multiple video options.
- Video source attribution.
- Written instructions alongside video.
- User-selected video preferences.

Third-party video availability and copyright rules must be respected.

---

## 5.5 Recipe Suitability Is Not Yet Personalised

**Status:** Open  
**Severity:** Medium  
**Target:** Version 2.0

Kitchen Brain does not yet fully evaluate recipes against:

- Individual family preferences.
- Allergies.
- Dietary restrictions.
- Medical nutrition requirements.
- Cooking skill.
- Available time.
- Equipment.
- Budget.
- Recent meal repetition.

These should be introduced gradually and with clear user control.

---

# 6. Planner Limitations

---

## 6.1 Planning Is Primarily Manual

**Status:** Open  
**Severity:** Medium  
**Target:** Smart Planning, Version 2.0

Users currently plan meals manually.

Kitchen Brain does not yet generate complete meal plans based on:

- Pantry inventory.
- Expiry.
- Family preferences.
- Nutrition.
- Budget.
- Available time.
- Meal variety.
- Recent meal history.

---

## 6.2 Planner Does Not Fully Represent Servings

**Status:** Under Review  
**Severity:** Medium  
**Target:** Future Planner enhancement

Meal planning may not yet consistently capture:

- Number of servings.
- Which family members are eating.
- Guest meals.
- Child portions.
- Leftover portions.
- Batch cooking.

This limits accurate grocery quantity generation.

---

## 6.3 Planner-to-Grocery Quantities May Be Approximate

**Status:** Open  
**Severity:** High  
**Target:** Better Grocery Engine

Grocery generation depends on recipe quantities, pantry quantities and unit compatibility.

Where units or ingredient names do not match, generated quantities may require manual correction.

The system should clearly distinguish calculated suggestions from confirmed shopping requirements.

---

## 6.4 Meal History Is Limited

**Status:** Open  
**Severity:** Medium  
**Target:** Smart Planning

Kitchen Brain does not yet fully track:

- What was actually cooked.
- What was skipped.
- What was replaced.
- Family feedback.
- Repetition frequency.
- Meal satisfaction.
- Preparation time accuracy.

Without this history, future personalisation remains limited.

---

# 7. Grocery Limitations

---

## 7.1 Grocery Prediction Does Not Yet Exist

**Status:** Planned  
**Severity:** Informational  
**Target:** Version 2.0

Current Grocery functionality manages lists and purchase status.

It does not yet predict:

- When items will run out.
- Purchase frequency.
- Recommended quantities.
- Likely next shopping date.
- Seasonal needs.
- Household consumption changes.

---

## 7.2 Duplicate Detection Is Basic

**Status:** Open  
**Severity:** Medium  
**Target:** Sprint 19

Duplicate detection may rely primarily on item names.

This may fail when items use:

- Singular and plural forms.
- Regional names.
- Different spelling.
- Brand names.
- Package sizes.
- Different units.

A canonical ingredient model is required for stronger duplicate prevention.

---

## 7.3 Finish Shopping Does Not Yet Represent a Full Shopping Session Model

**Status:** Open  
**Severity:** Medium  
**Target:** Better Grocery Engine

The current Finish Shopping flow updates Pantry and Budget, but a mature session model may need:

- Store.
- Start and completion time.
- Purchased quantity.
- Actual price per item.
- Substitutions.
- Skipped items.
- Receipt.
- Payment method.
- Household member.
- Shopping notes.

Shopping-session ownership and cloud relationships should be formalised before advanced analytics.

---

## 7.4 Store Intelligence Is Limited

**Status:** Planned  
**Severity:** Low  
**Target:** Version 1.2 refinement or later

Kitchen Brain does not yet provide complete support for:

- Country-aware store suggestions.
- Favourite stores.
- Recently used stores.
- Store comparison.
- Product availability.
- Price comparison.
- Deals.

Initial store support should remain simple and optional.

---

## 7.5 Grocery Prices Are Not Captured at Item Level

**Status:** Open  
**Severity:** Medium  
**Target:** Budget Intelligence

Budget transactions currently represent overall spending more reliably than item-level prices.

Without item-level price history, Kitchen Brain cannot accurately provide:

- Product price trends.
- Store comparisons.
- Cost per ingredient.
- Cost per recipe.
- Recommended store.
- Inflation insight.

---

# 8. Budget Limitations

---

## 8.1 Budget Categories Are Limited

**Status:** Open  
**Severity:** Medium  
**Target:** Sprint 21

Current Budget functionality primarily tracks monthly grocery spending.

It may not yet support detailed categories such as:

- Fresh produce.
- Meat and seafood.
- Dairy.
- Staples.
- Snacks.
- Household supplies.
- Delivery fees.
- Non-food items.

Category-level reporting depends on reliable item-level transaction data.

---

## 8.2 Budget Forecasting Is Not Yet Implemented

**Status:** Planned  
**Severity:** Informational  
**Target:** Sprint 21

Kitchen Brain does not yet predict:

- End-of-month spending.
- Overspending risk.
- Expected remaining grocery cost.
- Budget requirements for planned meals.
- Seasonal spending changes.

---

## 8.3 Cost per Meal Is Not Yet Available

**Status:** Planned  
**Severity:** Informational  
**Target:** Sprint 21

Cost per meal requires:

- Item-level grocery prices.
- Unit conversion.
- Package-size handling.
- Recipe quantities.
- Serving calculation.
- Pantry valuation rules.

Any future result must be labelled as an estimate unless complete pricing information is available.

---

## 8.4 Waste Cost Is Not Yet Measured

**Status:** Planned  
**Severity:** Informational  
**Target:** Sprint 18 foundation and Sprint 21 analysis

Kitchen Brain does not yet calculate the financial value of expired or discarded food.

This requires:

- Expiry tracking.
- Disposal confirmation.
- Remaining quantity.
- Purchase price.
- Unit conversion.
- Clear distinction between expired and actually wasted.

An expired item should not automatically be counted as wasted unless the user confirms disposal.

---

# 9. Dashboard and Intelligence Limitations

---

## 9.1 Kitchen Health Is a Rule-Based Score

**Status:** Accepted  
**Severity:** Informational  
**Target:** Ongoing refinement

The Kitchen Health Score is currently generated through deterministic rules.

It is not:

- A medical score.
- A nutrition score.
- A scientifically validated household metric.
- A guarantee of kitchen quality.

It is a product guidance indicator based on available Pantry, Grocery, Planner, Recipe and Budget data.

The UI should avoid overstating its precision.

---

## 9.2 Intelligence Quality Depends on Data Completeness

**Status:** Accepted  
**Severity:** Informational

Kitchen Intelligence cannot produce reliable recommendations when key data is missing or outdated.

Examples:

- Pantry quantities not updated.
- Meal Planner unused.
- Budget not configured.
- Grocery purchases not completed.
- Expiry dates unavailable.
- Recipes missing ingredients.

The product should clearly communicate when recommendations are based on limited data.

---

## 9.3 Insight Prioritisation Is Still Basic

**Status:** Open  
**Severity:** Medium  
**Target:** Future Intelligence refinement

Current insights are ordered using numeric priority and severity rules.

The system does not yet fully consider:

- Time sensitivity.
- User behaviour.
- Dismissed recommendations.
- Household preferences.
- Repeated alerts.
- Recommendation confidence.
- User-defined priority.

---

## 9.4 Insight History Is Not Stored

**Status:** Accepted  
**Severity:** Low  
**Target:** Future review

Kitchen Intelligence currently generates insights dynamically.

This means Kitchen Brain may not retain:

- Previously shown insights.
- Dismissed insights.
- Accepted recommendations.
- Recommendation outcomes.
- Historical score changes.

Storing insight history should only be introduced if it provides clear user value and does not create unnecessary data volume.

---

## 9.5 The Developer Intelligence Page Is Not a User-Facing Feature

**Status:** Accepted  
**Severity:** Informational

The `/dev/intelligence` route is intended for development and validation.

It should not be exposed as a permanent public user experience.

Before public release, developer-only routes should be:

- Removed.
- Protected.
- Disabled in production.
- Or replaced with a proper user-facing Insights screen.

---

# 10. AI Limitations

---

## 10.1 The AI Companion Is Not Yet Implemented

**Status:** Planned  
**Severity:** Informational  
**Target:** Version 2.0

Current Kitchen Intelligence is primarily deterministic and rule-based.

Kitchen Brain does not yet provide:

- Natural-language conversations.
- Generative meal suggestions.
- AI planning.
- Conversational grocery assistance.
- Guided cooking dialogue.
- AI explanation beyond predefined message generation.

---

## 10.2 AI Accuracy Cannot Be Guaranteed

**Status:** Accepted  
**Severity:** High  
**Target:** Permanent boundary

Future AI-generated content may be incomplete or incorrect.

AI must not be treated as the source of truth for:

- Pantry inventory.
- Expiry dates.
- Allergies.
- Medical needs.
- Nutrition values.
- Food safety.
- Spending.
- Purchases.

AI responses should be grounded in application data and clearly presented as recommendations.

---

## 10.3 AI Must Not Make Medical Decisions

**Status:** Accepted  
**Severity:** Critical  
**Target:** Permanent boundary

Kitchen Brain may support general wellness and nutrition awareness.

It must not:

- Diagnose medical conditions.
- Prescribe treatment.
- Replace dietitians or doctors.
- Guarantee diabetic safety.
- Guarantee allergy safety without verified data.
- Present generated nutrition advice as medical guidance.

High-risk nutrition features require careful review and appropriate disclaimers.

---

## 10.4 AI Memory and Personalisation Are Not Yet Defined

**Status:** Open  
**Severity:** High  
**Target:** Before Version 2.0

Future AI memory requires explicit decisions around:

- What is remembered.
- How long it is remembered.
- Where it is stored.
- How users review it.
- How users correct it.
- How users delete it.
- Whether it is shared across household members.
- Whether sensitive information is allowed.

AI learning must remain transparent and reversible.

---

## 10.5 AI Costs and Rate Limits Are Unknown

**Status:** Open  
**Severity:** High  
**Target:** Before Version 2.0

Generative AI introduces operational costs and provider limits.

Future implementation must consider:

- Cost per conversation.
- Usage limits.
- Subscription tiers.
- Prompt size.
- Context size.
- Response latency.
- Provider outage.
- Abuse prevention.
- Model changes.

AI features should degrade gracefully when unavailable.

---

# 11. Search Limitations

---

## 11.1 Search Is Currently Module-Specific

**Status:** Planned  
**Severity:** Medium  
**Target:** Sprint 20

Kitchen Brain does not yet provide a unified global search experience.

Users may need to navigate to individual modules before searching.

---

## 11.2 Search Does Not Yet Understand Meaning

**Status:** Open  
**Severity:** Low  
**Target:** Future Search enhancement

Current search primarily relies on text matching.

It may not understand:

- Ingredient synonyms.
- Spelling errors.
- Regional names.
- Related concepts.
- Recipe intent.
- Natural-language queries.

Semantic search should only be introduced when its accuracy and cost are justified.

---

# 12. UX and Accessibility Limitations

---

## 12.1 Accessibility Has Not Yet Been Formally Audited

**Status:** Open  
**Severity:** High  
**Target:** Before public release

The application has not yet completed a formal accessibility review.

Areas requiring validation include:

- Keyboard navigation.
- Focus management.
- Screen-reader labels.
- Colour contrast.
- Touch-target size.
- Form errors.
- Dialog accessibility.
- Reduced motion.
- Zoom and text scaling.
- Mobile assistive technology.

---

## 12.2 Some Desktop Pages May Require Excessive Scrolling

**Status:** Open  
**Severity:** Medium  
**Target:** Ongoing UX refinement

The Dashboard contains many useful sections, but the complete desktop experience may become vertically long.

Future refinement may include:

- Collapsible detail sections.
- Personalised Dashboard ordering.
- Priority-based content.
- Compact views.
- Dedicated Insights page.

Any reduction in scrolling should not hide critical information.

---

## 12.3 Mobile Testing Is Primarily Browser-Based

**Status:** Open  
**Severity:** High  
**Target:** Before native release

Current mobile testing uses browser device emulation and available physical-device checks.

Browser emulation does not fully reproduce:

- Mobile Safari behaviour.
- On-screen keyboard interaction.
- Safe areas.
- Orientation changes.
- Native scrolling.
- Device performance.
- Network transitions.
- Installed-app behaviour.

Physical-device testing is required before release.

---

## 12.4 Loading and Skeleton Behaviour Is Not Yet Standardised Everywhere

**Status:** Open  
**Severity:** Medium  
**Target:** Ongoing Design System adoption

The Dashboard has improved loading and caching behaviour, but every module may not yet follow the same standard.

Future work should standardise:

- Initial loading.
- Background synchronization.
- Empty state.
- Error state.
- Retry state.
- Cached state.
- Stale-data indicator.

---

## 12.5 Dark Mode Is Not Supported

**Status:** Deferred  
**Severity:** Low  
**Target:** Future

Kitchen Brain currently uses a light visual system.

Dark mode should not be added until:

- Design tokens are formalised.
- All components support theme variants.
- Contrast is tested.
- Charts and status colours are validated.
- Images and logos are reviewed.

---

# 13. Performance Limitations

---

## 13.1 Development Mode Performance Is Not Representative of Production

**Status:** Accepted  
**Severity:** Informational

Next.js development mode may include:

- Compilation delays.
- Fast Refresh work.
- Development logging.
- Unoptimised bundles.
- Strict development checks.

Performance conclusions should be based on production builds and realistic devices.

---

## 13.2 Performance Testing Is Not Yet Automated

**Status:** Open  
**Severity:** Medium  
**Target:** Future release process

Kitchen Brain does not yet have automated thresholds for:

- Initial load.
- Largest Contentful Paint.
- Interaction latency.
- Bundle size.
- Query count.
- Memory usage.
- Mobile performance.

A baseline should be created before public launch.

---

## 13.3 Large Data Volumes Have Not Yet Been Validated

**Status:** Open  
**Severity:** Medium  
**Target:** Before scale

Most testing has used household-sized datasets.

The application has not yet been thoroughly validated with:

- Thousands of Pantry Items.
- Large recipe libraries.
- Years of transactions.
- Long shopping histories.
- Multiple household users.
- Large AI conversation histories.

Pagination, indexing and archiving may become necessary.

---

# 14. Security and Privacy Limitations

---

## 14.1 A Formal Security Audit Has Not Been Completed

**Status:** Open  
**Severity:** Critical  
**Target:** Before public release

Kitchen Brain should undergo review for:

- Authentication security.
- Row-Level Security.
- User data isolation.
- Input validation.
- Injection risks.
- File-upload safety.
- Secrets management.
- API abuse.
- Rate limiting.
- Dependency vulnerabilities.
- Production environment configuration.

---

## 14.2 Privacy Classification Is Incomplete

**Status:** Open  
**Severity:** High  
**Target:** Before AI and family features

The product may eventually process:

- Household preferences.
- Family-member profiles.
- Nutrition goals.
- Shopping history.
- Budget data.
- AI conversations.
- Images.
- Receipts.
- Location and regional settings.

The application needs a formal privacy classification and data-handling policy.

---

## 14.3 Sensitive Health Information Requires Additional Controls

**Status:** Open  
**Severity:** Critical  
**Target:** Before Nutrition Engine

If Kitchen Brain stores health-related dietary requirements, additional controls may be needed for:

- Consent.
- Visibility.
- Household sharing.
- AI access.
- Deletion.
- Encryption.
- Data minimisation.
- Legal compliance.

Health information should not be introduced casually as an ordinary preference field.

---

# 15. External Integration Limitations

---

## 15.1 External APIs May Change or Become Unavailable

**Status:** Accepted  
**Severity:** Medium  
**Target:** Permanent operational risk

Future dependencies such as AI, nutrition, YouTube, barcode, OCR, weather or store APIs may experience:

- Pricing changes.
- Rate limits.
- Downtime.
- Coverage gaps.
- Policy changes.
- Regional restrictions.
- Authentication changes.
- Data-quality issues.

Kitchen Brain should avoid making core kitchen management dependent on any single external provider.

---

## 15.2 YouTube Content Cannot Be Controlled

**Status:** Accepted  
**Severity:** Medium  
**Target:** Guided Cooking

External recipe videos may be:

- Removed.
- Renamed.
- Region-restricted.
- Age-restricted.
- Monetised.
- Changed by the creator.
- Inconsistent with Kitchen Brain instructions.

Kitchen Brain should treat video links as optional references and preserve written recipe information where possible.

---

## 15.3 Nutrition Data May Be Incomplete or Inconsistent

**Status:** Accepted  
**Severity:** High  
**Target:** Nutrition Engine

Nutrition values vary based on:

- Ingredient brand.
- Cooking method.
- Portion size.
- Raw vs cooked weight.
- Regional product.
- Recipe interpretation.

Future nutrition results should include source attribution and estimation labels where appropriate.

---

# 16. Testing Limitations

---

## 16.1 Automated Test Coverage Is Limited

**Status:** Open  
**Severity:** High  
**Target:** Before public beta

Kitchen Brain currently relies heavily on manual testing and TypeScript checks.

Automated coverage should eventually include:

- Unit tests.
- Service tests.
- Intelligence-engine tests.
- Integration tests.
- Authentication tests.
- Database tests.
- End-to-end tests.
- Mobile viewport tests.

---

## 16.2 Regression Testing Is Manual

**Status:** Open  
**Severity:** Medium  
**Target:** Release process improvement

The current regression workflow requires manually checking major modules.

This creates risk as the application grows.

A repeatable automated regression suite should be introduced gradually, beginning with critical workflows.

---

## 16.3 No Dedicated Staging Environment Is Documented

**Status:** Open  
**Severity:** High  
**Target:** Before production release

Development and production changes should not share the same operational environment.

A staging environment should support:

- Test users.
- Test data.
- Migration validation.
- Release-candidate testing.
- Preview deployment.
- Safe integration testing.

---

# 17. Documentation Limitations

---

## 17.1 KBPS Documents Are Still Under Review

**Status:** Open  
**Severity:** Informational

The KBPS provides the agreed product direction, but several documents may still have `Review 1` status.

They should not be treated as permanently frozen until:

- Terminology is consistent.
- Cross-references are checked.
- Current implementation status is verified.
- Open questions are reviewed.
- Documents are approved.

---

## 17.2 Documentation May Become Stale

**Status:** Accepted  
**Severity:** Medium

Documentation can diverge from implementation if it is not updated during each sprint.

The Release Checklist should verify updates to:

- Roadmap.
- Feature Specifications.
- Data Model.
- Architecture.
- Changelog.
- Known Limitations.
- Decisions.

---

# 18. Current Highest-Priority Limitations

The following limitations should receive priority before a public beta or App Store release.

| Priority | Limitation |
|----------|------------|
| 1 | Formal security and privacy review |
| 2 | Automated testing for critical workflows |
| 3 | Production-ready account management and deletion |
| 4 | Mobile architecture and physical-device validation |
| 5 | Database migration and staging process |
| 6 | Accessibility audit |
| 7 | Offline and synchronization strategy |
| 8 | Unit and ingredient normalisation |
| 9 | Public onboarding and support workflows |
| 10 | Production monitoring and crash reporting |

These priorities may be revised as the Roadmap evolves.

---

# 19. Limitation Review Template

Use the following format when adding a new limitation.

```markdown
## Limitation Name

**Status:** Open  
**Severity:** Medium  
**Target:** Unassigned

### Description

Describe the current product or technical boundary.

### User Impact

Explain how the limitation affects users.

### Current Workaround

Describe any safe workaround.

### Risks

Describe product, technical, security, privacy or UX risks.

### Proposed Resolution

Describe the intended direction without committing prematurely to implementation details.

### Dependencies

List related modules, roadmap items or external services.

### Decision

Open / Planned / Accepted / Deferred / Resolved