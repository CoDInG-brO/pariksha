# Visual Architecture - JEE & NEET Platform

## Navigation Layout
```

        IYOTAPREP Logo         |   Profile Avatar     
-
  JEE  |  NEET  | Dashboard | Take Test | Practice | Analytics 

```
- JEE tab uses cyan/blue gradient, NEET uses emerald/teal, shared links reuse the indigo accent.
- Mobile drawer mirrors the same ordering with icon + label pairs.

## User Journeys
### JEE Flow
```
JEE Tab
 Dashboard (PCM cards, time & difficulty cues)
    Section drill (Physics/Chemistry/Mathematics)
 Full Mock (180 min, +4/-1)
     Analytics  Percentile, IIT guidance
```
### NEET Flow
```
NEET Tab
 Dashboard (subject weight, chapter readiness)
    Subject drill (upcoming)
 Full Mock (180 Q, +4/-1)
     Analytics  Percentile, college guidance
```

## Component Tree
```
App Layout
 Navbar (JEE/NEET switch + shared links)
 app/
    jee/page.tsx              # PCM dashboard
    jee/[section]/page.tsx    # Subject drills
    jee/full-mock/page.tsx    # 180-minute mock
    neet/page.tsx             # NEET dashboard
    neet/full-mock/page.tsx   # NEET mock
    practice/page.tsx         # Mixed practice
    analytics/page.tsx        # Percentile & rank
    profile/*                 # Account surfaces
 components/
    layout/Navbar.tsx
    AlertDialog.tsx
    WebcamPreview.tsx
 lib/
     jeeQuestionBank.ts
     percentileCalculator.ts
     testStorage.ts
```

## Percentile Data Flow
```
Score Input (slider)  exam toggle (JEE or NEET)
   percentileCalculator.ts
       calculateJEEPercentile  estimateIITCategory
       calculateNEETPercentile  estimateCollegeCategory
   analytics UI (percentile, rank, interpretation, actions)
```

## Page Breakdowns
### JEE Dashboard (`/jee`)
```

 180 min | 75 questions | +4/-1         

 Physics   | Chemistry | Mathematics    
 60 min    | 60 min    | 60 min         
 Focus tips + difficulty tags           

 CTA: Start Section Drill   CTA: Full Mock 

```
### NEET Dashboard (`/neet`)
```

 180 min | 180 questions | +4/-1        

 Physics 45 Q (25%)                     
 Chemistry 45 Q (25%)                   
 Biology 90 Q (50%)                     
 Chapter readiness + NCERT reminders    

 CTA: Subject Practice   CTA: Full Mock 

```
### Analytics (`/analytics`)
- Tabbed cards for JEE vs NEET.
- Score slider + inline percent/percentile/rank chips.
- Recommendation blocks (IIT buckets or Medical tiers).
- Score distribution bars and next-step suggestions.

### Practice (`/practice`)
- Mode toggle (JEE vs NEET) with shared progress chips.
- Uses `lib/jeeQuestionBank.ts` for PCM data, inline arrays for NEET until subject drills ship.

### Full Mock (`/jee/full-mock`, `/neet/full-mock`)
- Hero card with timer, integrity guardrails, camera toggle.
- Question panel + review grid + marked-for-review states.
- Submission modal  summary stats  analytics deep link.

## Score Distributions
### JEE
```
Score    | Percentile (approx)
270-300  | 0-1
250-269  | 1-3
220-249  | 3-7
200-219  | 7-15
180-199  | 15-30
150-179  | 30-50
120-149  | 50-70
90-119   | 70-85
60-89    | 85-95
0-59     | 95-100
```
### NEET
```
Score    | Percentile (approx)
680-720  | 0-0.5
650-679  | 0.5-1.5
620-649  | 1.5-3.5
600-619  | 3.5-6
580-599  | 6-10
560-579  | 10-15
520-559  | 15-30
500-519  | 30-40
450-499  | 40-60
0-449    | 60-100
```

## Color & Motion
- **JEE**: `from-cyan-500 to-blue-600`, star accents, grid overlays.
- **NEET**: `from-emerald-500 to-teal-600`, biology card height bump.
- Buttons animate with scale + shadow; cards fade/slide on mount; timers pulse under one minute.

## Responsive Behavior
- Desktop: three-column grids for dashboard tiles, side-by-side analytics.
- Tablet: two-column layout with condensed CTA rows.
- Mobile: stacked cards, sticky timer bars, bottom sheet review grid in mocks.

## File Dependencies
- Dashboards and analytics share `Navbar`, `framer-motion`, and Tailwind utility stacks.
- `lib/testStorage.ts` is consumed by `/jee/full-mock`, `/neet/full-mock`, `/practice`, and `/analytics`.
- `lib/jeeQuestionBank.ts` feeds `/jee/[section]`, `/practice`, and `/jee/full-mock`.

## Upcoming Work
1. Expand JEE section drills to 25-question pools + difficulty filters.
2. Ship NEET subject practice with NCERT chapter selectors and bookmarking.
3. Connect profile/performance cards to stored attempts for both exams.
