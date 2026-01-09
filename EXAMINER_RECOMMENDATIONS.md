# Examiner Recommendations (JEE & NEET)

## Overview
The examiner panel evaluated the current JEE-first experience (with NEET support) and provided the following feedback to keep the platform aligned with official test blueprints.

## Immediate Priorities
1. **Deepen the JEE bank**: raise Physics/Chemistry/Math pools to at least 25 curated questions per topic; tag with `difficulty`, `concept`, and `source`.
2. **Launch NEET subject drills**: Biology-specific practice with NCERT chapter selectors and flashcard-style revision prompts.
3. **Attempt tracking**: wire `lib/testStorage.ts` data into profile performance cards so examiners can audit accuracy and speed trends.

## Experience Notes
- **Integrity**: Webcam + alert dialog stack is solid; add low-bandwidth fallback thumbnails before beta review.
- **UX polish**: Timers, sliders, and KPI cards match the visual spec; keep gradient contrast consistent when new sections are added.
- **Copy**: Keep every label explicitly JEE or NEET (`IIT Advanced Target`, `Top Medical Colleges`) so the narrative stays exam-specific.

## Analytics Guidance
- Percentile curves in `lib/percentileCalculator.ts` closely mirror last years distributions; add comments referencing 2023 official reports so auditors can cross-check.
- Display rank ranges alongside percentile for both exams to help students gauge counselling cutoffs.

## QA Checklist Before Release
-  JEE dashboard  section drill  analytics flow is functional.
-  NEET dashboard  full mock  analytics path works end-to-end.
-  NEET subject drill route pending.
-  Profile performance cards not yet wired to attempt history.

## Suggested Enhancements
- Integrate real-time progress indicators inside `/jee/[section]` (bar by accuracy/speed).
- Allow exporting attempt summaries as PDF for coaching centers.
- Add push-friendly metadata (OpenGraph/Twitter cards) once marketing campaign begins.

## Acceptance Criteria
Release fits examiner expectations when:
- Every visible screen references only JEE or NEET.
- Section drills contain structured PCM data with at least 3 difficulty tiers.
- NEET practice mode unlocks dedicated Biology prep.
- Analytics page stores and surfaces at least the last five attempts for each exam mode.
- Profile  Performance summarizes accuracy, percentile trend, and recommended focus area.

## Next Review
Schedule another reviewer pass once NEET subject drills ship and profile metrics populate. Provide screenshots plus a data dictionary for the stored attempt schema at that time.
