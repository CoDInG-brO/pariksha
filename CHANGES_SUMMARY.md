# Summary of Changes - JEE & NEET Platform

## 1. Navigation Shell (`components/layout/Navbar.tsx`)
- Prominent JEE | NEET exam switch anchored to the left, followed by Dashboard, Take Test, Practice, Analytics.
- Gradient badges + emoji cues highlight the active exam across desktop and mobile drawers.
- Shared links reuse the indigo accent while exam tabs keep cyan (JEE) and emerald (NEET) gradients.

## 2. JEE Experience (`app/jee`)
- Dashboard showcases Physics/Chemistry/Mathematics cards with timers, difficulty notes, and quick links to drills or the full 180-minute mock.
- `/jee/[section]` renders focused 60-minute practice blocks (+4/-1) with contextual strategy blurbs and progress states.
- `/jee/full-mock` delivers the PCM simulation with integrity controls (webcam toggle, keyboard/back trapping) and pipes attempts into `lib/testStorage.ts`.

## 3. NEET Experience (`app/neet`)
- Dashboard emphasizes subject weightage (Biology 50%, Physics/Chemistry 25% each) plus chapter mastery cues.
- `/neet/full-mock` mirrors the 180-question (+4/-1) flow with subject ladders and review grids.
- Subject drill routes exist as scaffolding (`/neet/[subject]`) for the upcoming chapter-specific practice layer.

## 4. Practice + Storage
- `/practice` now sources all JEE questions from `lib/jeeQuestionBank.ts`, keeping practice mode aligned with the mock.
- Attempts across mocks persist through `saveTestAttempt()` so analytics, dashboards, and the profile area can reuse exact question/answer payloads.

## 5. Analytics (`app/analytics/page.tsx`)
- Tabbed surface for JEE vs NEET with independent score sliders, percentile math, rank estimates, and IIT/medical recommendations.
- Each report surfaces interpretation text, score distribution, and next-step chips that link back into drills or mocks.

## 6. Percentile & Recommendation Engine (`lib/percentileCalculator.ts`)
- `calculateJEEPercentile()` - 300-point distribution, percentile + rank + IIT guidance via `estimateIITCategory()`.
- `calculateNEETPercentile()` - 720-point scoring curve, percentile + rank + medical college buckets via `estimateCollegeCategory()`.
- Subject-level helpers (`calculateJEESectionPercentile`, `calculateNEETSubjectPercentile`) power analytics cards and upcoming insights.

## 7. File System Highlights
```
app/
  jee/ (dashboard, section drills, full mock)
  neet/ (dashboard, full mock, subject scaffolds)
  practice/, analytics/, dashboard/, profile/
components/
  layout/Navbar.tsx, AlertDialog.tsx, WebcamPreview.tsx, icons/
lib/
  jeeQuestionBank.ts, percentileCalculator.ts, testStorage.ts, auth.ts
```

## 8. Why Separate JEE & NEET?
1. **Format** - JEE enforces PCM parity and 180-minute mocks with +4/-1 scoring; NEET demands 180 biology-heavy questions.
2. **Analytics** - IIT shortlisting (<=10 percentile) vs AIIMS/government counselling (>=90 percentile) need different recommendation copy.
3. **Timing & Integrity** - JEE needs subject locking hints and keyboard guards; NEET prioritizes flexible navigation and bookmarks.
4. **Content Sources** - PCM bank vs NCERT-aligned biology-first datasets require distinct repositories and UI cues.

## 9. How to Test
- `http://localhost:3000/jee` - verify PCM cards, quick links, CTA copy.
- `http://localhost:3000/jee/physics` (swap subjects) - confirm +4/-1 scoring and timer.
- `http://localhost:3000/jee/full-mock` - ensure camera toggle, integrity alerts, scoring summary, analytics save path.
- `http://localhost:3000/neet` and `/neet/full-mock` - validate subject stats, scoring headers, review grid.
- `http://localhost:3000/analytics` - slide both tabs, confirm percentile text, recommendations, and data persistence.

## 10. Sample Outputs
### JEE Example (Score 210/300)
- Percentage: 70%
- Percentile: ~15
- Rank Estimate: ~135,000 of 900,000
- Recommended Institutes: NIT Trichy/Warangal, IIT BHU dual degrees
- Interpretation: "Strong PCM balance - push accuracy to break into the top 10%."

### NEET Example (Score 600/720)
- Percentage: 83%
- Percentile: ~90
- Rank Estimate: ~160,000 of 1.6M
- Recommended Colleges: Government medical colleges, premium private seats
- Interpretation: "Top 10% - maintain Biology precision for AIIMS contention."

## 11. Next Steps
1. Expand `lib/jeeQuestionBank.ts` to cover the full 75-question main pattern and reflect that depth inside `/jee/[section]`.
2. Complete `/neet/[subject]/page.tsx` with NCERT chapter filters, bookmarking, and accuracy tracking.
3. Wire `/profile/performance` to `lib/testStorage.ts` so recent JEE/NEET mocks surface inside the user dashboard.
4. Keep ancillary docs and UI strings aligned with the JEE/NEET narrative as new surfaces ship.
