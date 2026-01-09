# Quick Reference: JEE & NEET Feature Map

## File Locations

### Navigation Shell
File: `components/layout/Navbar.tsx`
- Primary toggles: JEE | NEET | Dashboard | Take Test | Practice | Analytics
- Active-state gradients and icons per exam
- Mobile drawer mirrors the same structure

### JEE Surfaces
File: `app/jee/page.tsx`
- Physics, Chemistry, Mathematics cards with time and difficulty cues
- Section quick-links wired to `/jee/[section]`
- CTA to the full mock and analytics recap panels

File: `app/jee/[section]/page.tsx`
- 60-minute drill per subject with +4/-1 scoring
- Dynamic section metadata and contextual strategy blurbs

File: `app/jee/full-mock/page.tsx`
- 180-minute PCM simulation (20 questions per subject today)
- Autosave to `lib/testStorage.ts` with percentile snapshot
- Camera toggle and integrity guardrails (keyboard/back navigation locks)

### NEET Surfaces
File: `app/neet/page.tsx`
- Physics/Chemistry/Biology emphasis with biology weightage callouts
- Links into `/neet/[subject]` practice (placeholder) and `/neet/full-mock`

File: `app/neet/full-mock/page.tsx`
- 180-minute, 180-question workflow with +4/-1 scoring and subject ladders

### Shared Study Modes
File: `app/practice/page.tsx`
- Randomized drills sourcing from `lib/jeeQuestionBank.ts` (JEE) and inline NEET sets
- Mode toggle and progress chips reused across dashboards

File: `app/take-test/page.tsx`
- Generic coding test harness retained for future interview prep lane

### Analytics & Data
File: `app/analytics/page.tsx`
- Split tabs for JEE vs NEET percentile/rank calculators
- Hooks into `lib/percentileCalculator.ts` and `lib/testStorage.ts`

File: `lib/percentileCalculator.ts`
- `calculateJEEPercentile`, `calculateNEETPercentile`, `estimateIITCategory`, `estimateCollegeCategory`
- Subject helpers: `calculateJEESectionPercentile`, `calculateNEETSubjectPercentile`

File: `lib/jeeQuestionBank.ts`
- Canonical PCM dataset consumed by practice and full-mock flows

---

## Access Paths
```
/jee                     JEE dashboard overview
/jee/[section]           Physics/Chemistry/Mathematics drills
/jee/full-mock           180-minute PCM simulation
/neet                    NEET dashboard overview
/neet/[subject]          Subject drills (scaffolding in progress)
/neet/full-mock          180-question NEET mock
/practice                Mixed-mode practice switcher (JEE or NEET)
/analytics               Percentile and rank analytics
```

---

## Exam Specifications

### JEE (Main style)
- Total questions: 90 (75 attempted) | Max score: 300
- Duration: 180 minutes (60 per subject in UI)
- Scoring: +4 correct, -1 incorrect, 0 skipped
- Subjects: Physics, Chemistry, Mathematics (equal weight)
- Current implementation: 20 curated MCQs per subject with shared explanations, stopwatch, and review grid

### NEET
- Total questions: 180 | Max score: 720
- Duration: 180 minutes
- Scoring: +4 correct, -1 incorrect, 0 skipped
- Subjects: Physics (45), Chemistry (45), Biology (90)
- Current implementation: Full mock plus dashboard guidance, subject practice scaffolding underway

---

## Key Features Implemented

### JEE Track
- Section cards with realistic timers and topic cues
- Full mock with integrity locks, camera toggle, and analytics wiring
- Shared PCM bank powering both practice mode and the full mock
- Score calculation uses JEE weights (+4/-1) with percentile and IIT bucket estimates

### NEET Track
- Subject emphasis blocks with biology dominance messaging
- Full mock reflecting NEET timings and scoring
- Analytics copy tailored to NEET counselling tiers (AIIMS, government, private)

### Analytics and Storage
- Unified slider/input feeding exam-specific percentile math
- Local test ledger via `lib/testStorage.ts` for recent attempts
- IIT/medical college recommendation chips derived from percentile outputs

---

## Integration Points

```ts
interface TestResult {
  examType: "JEE" | "NEET";
  score: number;
  maxScore: number;
  percentage: number;
  percentile: number;
  timeSpent: number;       // seconds
  sectionScores?: Record<string, number>;   // Physics/Chemistry/Mathematics
  subjectScores?: Record<string, number>;   // Physics/Chemistry/Biology
  selectedAnswers: (number | null)[];
  questions: Array<{
    id: number;
    section: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}
```

Use `saveTestAttempt()` from `lib/testStorage.ts` to persist this envelope and feed `/analytics` or `/profile/performance` once wired.

---

## Sample Percentile Outputs

### JEE score: 210/300
```
Percentage: 70%
Percentile: ~15
Rank estimate: ~135,000 of 900,000
Recommendations: NIT Trichy/Warangal core branches, IIT BHU dual degrees
Interpretation: "Strong PCM balance--push accuracy to break into the top 10%."
```

### NEET score: 600/720
```
Percentage: 83%
Percentile: ~90
Rank estimate: ~160,000 of 1.6M
Recommendations: Government medical colleges, premium private seats
Interpretation: "Top 10%--maintain Biology precision for AIIMS contention."
```

---

## Design Details
- JEE palette: cyan to blue (Physics), amber to orange (Chemistry), purple to indigo (Mathematics)
- NEET palette: emerald to teal gradients per subject, biology cards double height
- Accent: indigo #6366F1 for shared CTAs and sliders
- Motion: Framer Motion fade/scale on cards, timer badges pulse below 60 seconds
- Typography: 40-48px display for hero stats, 16px body, monospace timers

---

## Deployment Checklist
- [x] Navigation and route scaffolding live
- [x] Percentile and analytics stack aligned to JEE/NEET
- [x] Practice and full mock leverage shared PCM data
- [ ] Expand NEET subject drill pages
- [ ] Persist analytics history per user session
- [ ] Connect to real auth/storage backend

---

## Documentation Map
1. `VISUAL_ARCHITECTURE.md` -- topology and flows
2. `NEW_STRUCTURE.md` -- file/folder layout
3. `CHANGES_SUMMARY.md` -- release notes for the JEE rebrand
4. `EXAMINER_RECOMMENDATIONS.md` -- exam-specific product guidance
5. `IMPLEMENTATION_CHECKLIST.md` -- phased delivery tracker

---

## Next Priorities
1. Expand `lib/jeeQuestionBank.ts` to full 75-question coverage and sync timers/UI to the official pattern.
2. Stand up `/neet/[subject]/page.tsx` with NCERT chapter filters and bookmarking to match the JEE experience parity.
3. Wire `/profile/performance` to `lib/testStorage.ts` so recent JEE/NEET mocks surface inside the profile area.
