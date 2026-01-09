# Implementation Checklist - JEE & NEET Platform

## Phase 1: Core Surfaces (✅ Complete)
- Navigation: JEE | NEET tabs, shared dashboard/practice/analytics links, mobile drawer parity.
- JEE Dashboard: PCM cards, 180-minute mock CTA, timers and section blurbs.
- NEET Dashboard: Physics/Chemistry/Biology emphasis, weightage callouts, mock CTA.
- Practice Mode: JEE pulls from `lib/jeeQuestionBank.ts`, NEET keeps inline sets.
- Analytics: Tabbed JEE/NEET percentile sliders, rank estimates, IIT or medical college chips.
- Percentile Engine: `calculateJEEPercentile`, `calculateNEETPercentile`, subject-level helpers, storage via `lib/testStorage.ts`.
- Documentation: NEW_STRUCTURE, VISUAL_ARCHITECTURE, QUICK_REFERENCE, EXAMINER_RECOMMENDATIONS, CHANGES_SUMMARY.

## Phase 2: Section-wise JEE Drill (⏳ In Progress)
- [ ] Flesh out `/app/jee/[section]/page.tsx` with 25-question pools per subject.
- [ ] Lock subject navigation to preserve single-subject focus.
- [ ] Timer + review grid parity with full mock.
- [ ] Save attempt slices (per subject score + accuracy) to `testStorage`.
- [ ] Add difficulty filters and strategy tips per section.

## Phase 3: NEET Subject Practice (⏳ In Progress)
- [ ] Build `/app/neet/[subject]/page.tsx` with NCERT chapter selector.
- [ ] Support question difficulty tiers, bookmarking, and solution reveals.
- [ ] Track per-subject accuracy + attempt counts for analytics reuse.
- [ ] Provide biology emphasis modules (Botany vs Zoology) inside the same route.

## Phase 4: Data & Accounts (🟡 Planned)
- [ ] Persist attempts to a real database (tests, responses, bookmarks, performance tables).
- [ ] NextAuth-backed signup/login plus profile preferences (target exam, study goals).
- [ ] API layer (`/api/tests`, `/api/results`, `/api/performance`) for dashboards and analytics.
- [ ] Notification hooks (email/push) for scheduled mocks or reminders.

## Phase 5: Advanced Insights (🟢 Backlog)
- AI study coach (weak area detection, plan generation).
- Historical graphs + peer comparison for both exams.
- Gamification: streaks, badges, leaderboard cards.
- Mobile polish + React Native shell once web flows are locked.

## Testing & Deployment
- Smoke test routes: `/jee`, `/jee/[section]`, `/jee/full-mock`, `/neet`, `/neet/full-mock`, `/practice`, `/analytics`.
- Validate `saveTestAttempt` payloads after every mock to ensure analytics stays in sync.
- Keep docs in sync after feature drops (CHANGES_SUMMARY, QUICK_REFERENCE, VISUAL_ARCHITECTURE).
- Deployment gate: run through manual full-mock plus analytics handoff before pushing to production.
