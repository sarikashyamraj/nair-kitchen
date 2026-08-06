# Kitchen Brain Product Specification (KBPS)

## Research Document – User Feedback

---

## Document Information

| Property | Value |
|----------|-------|
| Document | User Feedback |
| Version | 1.0 |
| Status | Active |
| Owner | Sarika |
| Last Updated | 06 August 2026 |

---

# Purpose

This document records, organises and evaluates user feedback for Kitchen Brain.

Its purpose is to ensure product decisions are informed by real user needs rather than assumptions, isolated opinions or feature enthusiasm.

Feedback may come from:

- Personal use.
- Household members.
- Test users.
- Public beta users.
- App Store reviews.
- Support messages.
- Usability testing.
- Surveys.
- Interviews.
- Analytics.
- Bug reports.

Feedback should be reviewed alongside the Product Vision, Roadmap, Known Limitations, Feature Specifications and Release Checklist.

---

# Feedback Principles

## Rule 1 — Listen to the Problem, Not Only the Requested Solution

Users often describe a preferred solution before the underlying problem is fully understood.

Example:

> “Add another button to the Dashboard.”

The underlying problem may be:

> “The existing action is difficult to find.”

The product team should first identify the real user problem before deciding how to solve it.

---

## Rule 2 — Repeated Feedback Has Greater Weight

A single request may represent one user’s preference.

Repeated feedback from multiple users may indicate a broader product problem.

Feedback frequency should be considered together with severity and strategic relevance.

---

## Rule 3 — Not Every Request Belongs in the Product

A requested feature should not be implemented automatically.

Every request must be reviewed against:

- Product Vision.
- Target users.
- Architectural fit.
- Design consistency.
- Security and privacy.
- Maintenance cost.
- Roadmap priority.
- Expected benefit to most households.

---

## Rule 4 — Negative Feedback Is Valuable

Critical feedback should be documented without defensiveness.

Feedback that identifies confusion, friction, poor performance or broken expectations is often more valuable than general praise.

---

## Rule 5 — Preserve Context

Feedback should include enough context to understand:

- Who experienced the issue.
- What they were trying to do.
- Which device they used.
- What happened.
- What they expected.
- Whether the issue was repeated.

---

## Rule 6 — Avoid Leading Users

During usability testing, users should be allowed to complete tasks without being told where to click.

The objective is to observe whether the interface is understandable without assistance.

---

# Feedback Status Definitions

| Status | Meaning |
|--------|---------|
| New | Recorded but not yet reviewed |
| Under Review | Being evaluated |
| Validated | Confirmed through repetition, testing or evidence |
| Planned | Accepted into the Roadmap |
| In Development | Currently being addressed |
| Resolved | Improvement has been released |
| Deferred | Valid but postponed |
| Rejected | Does not align with the product direction |
| Needs More Evidence | Insufficient information to decide |

---

# Feedback Type Definitions

| Type | Meaning |
|------|---------|
| Bug | Product behaves differently from the approved specification |
| Usability | User has difficulty understanding or completing a task |
| Performance | Product feels slow or unresponsive |
| Feature Request | User proposes new functionality |
| Enhancement | Improvement to an existing feature |
| Content | Wording, labels, instructions or messaging issue |
| Accessibility | Barrier for users with accessibility needs |
| Reliability | Data, synchronization or workflow reliability concern |
| Privacy | Concern about data handling or user control |
| Positive | Useful confirmation that an experience works well |

---

# Feedback Severity Definitions

| Severity | Meaning |
|----------|---------|
| Critical | Causes data loss, security risk or complete workflow failure |
| High | Prevents or significantly disrupts an important task |
| Medium | Creates friction but has a reasonable workaround |
| Low | Minor inconvenience or refinement |
| Informational | Observation without immediate product impact |

---

# Feedback Priority Framework

Feedback should be prioritised using four factors.

## Frequency

How many users experience the issue?

## Severity

How strongly does it affect the user?

## Strategic Fit

Does resolving it support the Product Vision and Roadmap?

## Effort

What is the estimated implementation and maintenance cost?

A high-frequency, high-severity issue affecting a core workflow should normally receive priority over a low-frequency feature request.

---

# Current Feedback Summary

The following feedback has already influenced Kitchen Brain.

---

## Dashboard Should Provide a Complete Overview Without Excessive Scrolling

**Type:** Usability  
**Status:** Validated  
**Severity:** High  
**Area:** Dashboard  
**Source:** Product testing

### Feedback

The earlier Dashboard required too much vertical scrolling, especially on mobile.

Important information was spread across several large sections.

### Product Response

Dashboard 2.0 introduced:

- Compact Kitchen Snapshot.
- Clear information hierarchy.
- Mobile-first layout.
- Quick Actions.
- Today’s Meals.
- Pantry Alerts.
- Grocery Progress.
- Budget Overview.
- Kitchen Intelligence.

### Outcome

The Dashboard now provides a more complete overview while preserving access to detailed information.

### Remaining Consideration

The Dashboard may still become long as additional intelligence features are added.

Future work should prioritise relevance rather than continuously adding sections.

---

## Duplicate Greeting Created Confusion

**Type:** Bug  
**Status:** Resolved  
**Severity:** Medium  
**Area:** Dashboard and Header  
**Source:** Product testing

### Feedback

The user’s greeting appeared twice after a Dashboard update.

### Product Response

Greeting ownership was clarified so it appears only in the intended header area.

### Lesson

Presentation responsibilities must remain clearly assigned between page-level and layout-level components.

---

## Full-Screen Loading Delayed Access to the Dashboard

**Type:** Performance and Usability  
**Status:** Resolved  
**Severity:** High  
**Area:** Application Loading  
**Source:** Product testing

### Feedback

The application displayed a full-screen “Loading your kitchen” screen for several seconds during refresh or tab navigation.

This made the product feel slower than necessary.

### Product Response

The full-screen loading dependency was reduced.

Improvements included:

- Removing the blocking splash experience.
- Using Dashboard skeletons.
- Displaying cached data.
- Loading cloud information in the background.
- Optimising Supabase queries.
- Separating initial presentation from background synchronisation.

### Lesson

Perceived performance is as important as actual network speed.

Users should see useful structure immediately whenever possible.

---

## Profile Name Appeared After a Delay

**Type:** Usability and Performance  
**Status:** Resolved  
**Severity:** Medium  
**Area:** Profile and Header  
**Source:** Product testing

### Feedback

The user’s full name appeared shortly after the page loaded, creating visible content flicker.

### Product Response

Profile loading and fallback behaviour were improved so the interface presents stable user information earlier.

### Lesson

Identity-related interface elements should avoid switching between placeholders and final values when cached or authenticated metadata is already available.

---

## Dashboard Should Feel Like a Professional Mobile App

**Type:** Enhancement  
**Status:** Validated  
**Severity:** High  
**Area:** Design System  
**Source:** Product direction

### Feedback

The product should not look like a desktop website compressed into a mobile screen.

The mobile Dashboard should present essential actions and information in a compact, polished layout.

### Product Response

The application adopted:

- Mobile-first layouts.
- Compact cards.
- Consistent icons.
- Clear typography.
- Reduced visual clutter.
- Touch-friendly controls.
- Responsive navigation.
- Consistent spacing.

### Lesson

Mobile should be designed as the primary experience rather than treated as a secondary responsive variation.

---

## “Grocery” Is the Preferred Module Name

**Type:** Content  
**Status:** Validated  
**Severity:** Medium  
**Area:** Product Terminology  
**Source:** Product Owner

### Feedback

The module should consistently be called “Grocery,” not “Shopping.”

### Product Response

User-facing labels should use “Grocery.”

Internal technical names may retain older terminology temporarily where changing them would create unnecessary risk, but all new user-facing work must follow the approved term.

### Lesson

Product terminology should remain consistent across navigation, buttons, messages, documentation and future AI responses.

---

## Complete Files Are Safer Than Patch-by-Patch Changes

**Type:** Development Workflow  
**Status:** Validated  
**Severity:** High  
**Area:** Engineering Process  
**Source:** Product development

### Feedback

Applying many small code patches created confusion and increased the chance of editing the wrong location.

### Product Response

For large or structurally important files, complete ready-to-paste replacements are preferred.

Small, isolated changes may still be provided when the target location is clear.

### Lesson

Instructions should match the user’s working style and reduce avoidable implementation risk.

---

## Documentation Structure Should Remain Stable

**Type:** Process and Usability  
**Status:** Validated  
**Severity:** High  
**Area:** KBPS  
**Source:** Product development

### Feedback

Repeated suggestions to rename, move or reorganise documentation files created unnecessary work and made the planning process feel endless.

### Product Response

The KBPS folder structure is now frozen as:

```text
docs/
└── KBPS/
    ├── 01_Strategy/
    ├── 02_Specifications/
    ├── 03_Research/
    ├── CHANGELOG.md
    └── DECISIONS.md