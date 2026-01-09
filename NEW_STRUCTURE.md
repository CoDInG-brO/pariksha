# Updated Project Structure (JEE + NEET)

```
mockexam-ai-ui/
 app/
    globals.css
    layout.tsx
    page.tsx
    providers.tsx
    dashboard/
       page.tsx                    # General overview tiles
    jee/
       page.tsx                    # JEE dashboard (PCM cards + CTA)
       [section]/page.tsx          # Physics/Chemistry/Mathematics drills
       full-mock/page.tsx          # 180-minute PCM simulation (+4/-1)
    neet/
       page.tsx                    # NEET dashboard (subject emphasis)
       [subject]/page.tsx          # Subject drills (scaffolding)
       full-mock/page.tsx          # 180-question NEET mock
    analytics/page.tsx              # Percentile, rank, college intel
    practice/page.tsx               # Mixed-mode practice (JEE/NEET)
    take-test/page.tsx              # Generic coding test harness
    profile/
       edit/page.tsx               # Profile editor (targets, details)
       performance/page.tsx        # Test history + charts (to retheme)
       settings/page.tsx
    login|signup|auth routes        # NextAuth entry
    api/auth/[...nextauth]/route.ts

 components/
    layout/Navbar.tsx               # Exam toggles + nav
    AlertDialog.tsx                 # Confirmations (back-out, etc.)
    WebcamPreview.tsx               # Proctoring surface for mocks
    icons/                          # Shared SVG iconography

 lib/
    percentileCalculator.ts         # `calculateJEEPercentile`, `estimateIITCategory`, etc.
    jeeQuestionBank.ts              # Central PCM dataset (20 Q/subject)
    testStorage.ts                  # Local attempt ledger
    auth.ts                         # NextAuth helpers
    sounds.ts / percentile helpers  # UX utilities

 middleware.ts                       # Auth protection for dashboard routes
 CHANGES_SUMMARY.md                  # Release log (needs JEE wording)
 IMPLEMENTATION_CHECKLIST.md         # Phase tracker
 QUICK_REFERENCE.md                  # File map (updated)
 VISUAL_ARCHITECTURE.md              # UI + flow diagram
 ...config files (Tailwind, PostCSS, tsconfig, etc.)
```

## Highlights
- `/app/jee` now carries the dedicated PCM-focused dashboards, section drills, and full mock experiences.
- `/app/practice` pulls from `lib/jeeQuestionBank.ts` when the JEE toggle is active, keeping paper sets centralized.
- `/app/analytics` now references JEE vs NEET percentile engines plus IIT/medical recommendations.
- Navbar exposes JEE and NEET as the primary exam tabs with matching gradients and iconography.

## Features Delivered
- JEE dashboard + full mock using +4/-1 scoring and 180-minute timers
- Shared PCM bank powering JEE practice + mock
- NEET dashboard + full mock with accurate subject weights
- Analytics workflow with IIT/medical guidance
- Local attempt persistence for downstream analytics/profile use

## Outstanding
- Flesh out `/app/neet/[subject]` for chapter-wise drills
- Expand `lib/jeeQuestionBank.ts` toward the full 75-question blueprint
- Keep `VISUAL_ARCHITECTURE.md`, `CHANGES_SUMMARY.md`, and `IMPLEMENTATION_CHECKLIST.md` aligned with the JEE/NEET narrative
- Connect profile performance cards to saved attempts
- Replace placeholder `/take-test` content with exam-ready material or retire it
