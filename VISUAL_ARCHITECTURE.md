# 📱 Visual Architecture - CAT & NEET Platform

## Navigation Structure

```
┌─────────────────────────────────────────────────────┐
│           Pariksha            [Profile Icon]        │
├─────────────────────────────────────────────────────┤
│ 📊 CAT | 🔬 NEET | Dashboard | Take Test | Practice | Analytics │
└─────────────────────────────────────────────────────┘
```

---

## User Journey Map

### For CAT Aspirants
```
CAT Tab (📊)
├── Dashboard
│   ├── Quantitative Aptitude (22 Q, 40 min)
│   ├── DI-LR (22 Q, 40 min)
│   └── Verbal (22 Q, 40 min)
└── Full Mock Test (66 Q, 120 min)
    └── Analytics → Check Percentile & IIM Prediction
```

### For NEET Aspirants
```
NEET Tab (🔬)
├── Dashboard
│   ├── Physics (45 Q, 180 marks)
│   ├── Chemistry (45 Q, 180 marks)
│   └── Biology (90 Q, 360 marks)
└── Full Mock Test (180 Q, 180 min)
    └── Analytics → Check Percentile & College Prediction
```

---

## Component Tree

```
App Layout
├── Navbar (Updated with CAT/NEET)
├── Main Content
│   ├── /cat/page.tsx .......................... CAT Dashboard
│   ├── /neet/page.tsx ......................... NEET Dashboard
│   ├── /analytics/page.tsx .................... Analytics Page
│   ├── /dashboard/page.tsx .................... General Dashboard
│   ├── /take-test/page.tsx .................... Test Page
│   └── /practice/page.tsx ..................... Practice Page
├── Lib Functions
│   └── percentileCalculator.ts
│       ├── calculateCATPercentile()
│       ├── calculateNEETPercentile()
│       ├── calculateCATSectionPercentile()
│       ├── calculateNEETSubjectPercentile()
│       ├── estimateIIMCategory()
│       └── estimateCollegeCategory()
└── Utils
    └── Color schemes, animations, helpers
```

---

## Data Flow for Percentile Calculation

```
User Score Input
    ↓
[Analytics Page]
    ↓
Select Exam Type (CAT/NEET)
    ↓
Slide Score Input
    ↓
percentileCalculator.ts
├── If CAT:
│   └── calculateCATPercentile(score)
│       ├── Compare with CAT distribution (200K candidates)
│       ├── Calculate percentile rank
│       ├── Estimate rank
│       └── Get IIM recommendations
└── If NEET:
    └── calculateNEETPercentile(score)
        ├── Compare with NEET distribution (1.6M candidates)
        ├── Calculate percentile rank
        ├── Estimate rank
        └── Get College recommendations
    ↓
Display Results
├── Percentile score
├── Rank estimation
├── College recommendations
├── Performance interpretation
└── Score distribution graph
```

---

## Page Components Breakdown

### 1. CAT Dashboard (`/cat`)
```
┌──────────────────────────────────────┐
│ 📊 CAT Section-wise Tests            │
├──────────────────────────────────────┤
│ Stats: 120 min | 66 Q | 198 Marks   │
├──────────────────────────────────────┤
│ [🔢 Quant] [📊 DI-LR] [📖 Verbal]  │
│ 40 min      40 min     40 min       │
│ 22 Q        22 Q       22 Q         │
├──────────────────────────────────────┤
│ [🎯 Full CAT Mock - 120 Minutes]    │
├──────────────────────────────────────┤
│ 💡 CAT Tips & Strategies             │
└──────────────────────────────────────┘
```

### 2. NEET Dashboard (`/neet`)
```
┌──────────────────────────────────────┐
│ 🔬 NEET Subject-wise Practice        │
├──────────────────────────────────────┤
│ Stats: 180 min | 180 Q | 720 Marks  │
├──────────────────────────────────────┤
│ [⚛️ Physics]  [🧪 Chemistry]         │
│ 45 Q, 180M    45 Q, 180M             │
│ [🧬 Biology]                         │
│ 90 Q, 360M (50% of exam)             │
├──────────────────────────────────────┤
│ [🎯 Full NEET Mock - 180 Minutes]   │
├──────────────────────────────────────┤
│ 💡 NEET Tips & Strategies            │
└──────────────────────────────────────┘
```

### 3. Analytics Page (`/analytics`)
```
┌────────────────────────────────────────┐
│ Percentile & Performance Analytics     │
├────────────────────────────────────────┤
│ [📊 CAT] [🔬 NEET] (Tab Select)       │
├────────────────────────────────────────┤
│ Enter Score: [====75====] 150/198     │
├────────────────────────────────────────┤
│ ┌──────────┬──────────┬──────────┐    │
│ │ 75.1 %ile│ 150 Pts  │ #50,000  │    │
│ │Percentile│  Score   │   Rank   │    │
│ └──────────┴──────────┴──────────┘    │
├────────────────────────────────────────┤
│ 📊 Your Performance Analysis:         │
│ "Good score! Top 25% - IIM L, I, K"  │
├────────────────────────────────────────┤
│ 🎓 IIM Categories:                    │
│ □ IIM L  □ IIM I  □ IIM K  □ Others  │
├────────────────────────────────────────┤
│ 📈 Score Distribution:                │
│ Excellent: ████░░░░░░ 1%             │
│ Very Good: █████░░░░░ 5%             │
│ Good:      ███████░░░ 15%            │
│ Average:   ██████████ 25%            │
│ Below Avg: ████████░░ 55%            │
└────────────────────────────────────────┘
```

---

## Score Distribution Visualization

### CAT Distribution (200K candidates)
```
Score    | Count | Percentile
---------|-------|----------
180-198  |  2K   | 1%
160-179  | 10K   | 5%
140-159  | 30K   | 15%
120-139  | 60K   | 30%
100-119  | 100K  | 50%
 80-99   | 30K   | 65%
 60-79   | 20K   | 75%
 40-59   | 20K   | 85%
 20-39   | 14K   | 92%
  0-19   | 14K   | 100%
```

### NEET Distribution (1.6M candidates)
```
Score    | Count   | Percentile
---------|---------|----------
680-720  |  8K     | 0.5%
650-679  | 24K     | 1.5%
620-649  | 56K     | 3.5%
600-619  | 96K     | 6%
580-599  | 160K    | 10%
560-579  | 240K    | 15%
... (continues)
```

---

## Key Metrics by Exam Type

### CAT
```
┌─────────────────────────────┐
│ Total Candidates: 200,000   │
│ Top 1%: 2,000 candidates    │
│ Top 10%: 20,000 candidates  │
│ Your Rank: #50,000          │
│ Percentile: 75              │
│ Colleges: IIM L, I, K       │
└─────────────────────────────┘
```

### NEET
```
┌─────────────────────────────┐
│ Total Candidates: 1,600,000 │
│ Top 1%: 16,000 candidates   │
│ Top 10%: 160,000 candidates │
│ Your Rank: #160,000         │
│ Percentile: 90              │
│ Colleges: Govt. Medical     │
└─────────────────────────────┘
```

---

## Color Scheme

```
CAT (Blue Theme)
├── Primary: #3B82F6 (Blue-500)
├── Gradient: from-blue-500 to-blue-600
└── Accent: Hover effects

NEET (Green Theme)
├── Primary: #10B981 (Green-500)
├── Gradient: from-green-500 to-green-600
└── Accent: Hover effects

General (Indigo Accent)
├── Primary: #6366F1 (Accent)
├── Background: #0B0F19 (Dark)
└── Surface: #111827 (Slightly lighter)
```

---

## Animation Effects

```
Page Load
├── Header: Fade in + Y translation
├── Cards: Staggered fade in + Y translation
├── Progress bars: Animated width from 0 to final value
└── Buttons: Scale on hover

Interactions
├── Card hover: Y translation (lift effect)
├── Button hover: Scale + shadow
├── Score slider: Real-time updates
└── Results: Fade in + scale animation
```

---

## Responsive Design

```
Desktop (1024px+)
├── 3-column grids
├── Full navigation visible
└── Side-by-side layouts

Tablet (768px-1023px)
├── 2-column grids
├── Collapsible menus
└── Optimized spacing

Mobile (<768px)
├── 1-column grids
├── Stack all elements
├── Touch-friendly buttons
└── Horizontal scroll for tables
```

---

## File Dependencies

```
pages/
├── cat/page.tsx
│   └── depends on: Navbar.tsx, Motion (framer-motion)
├── neet/page.tsx
│   └── depends on: Navbar.tsx, Motion (framer-motion)
├── analytics/page.tsx
│   ├── depends on: Navbar.tsx, Motion (framer-motion)
│   └── imports: percentileCalculator.ts (all functions)
└── dashboard/page.tsx
    └── depends on: Navbar.tsx, Motion (framer-motion)

lib/
└── percentileCalculator.ts (No dependencies)

components/
└── layout/Navbar.tsx (Updated)
    └── imports: Link, usePathname
```

---

## Next Phase - Section-wise CAT Test

```
┌──────────────────────────────────────┐
│ Section: Quantitative (1/3)          │
│ Time Remaining: 35:42                │
├──────────────────────────────────────┤
│ Question 5 of 22                      │
├──────────────────────────────────────┤
│ [Question Content]                   │
│ □ Option 1                           │
│ □ Option 2                           │
│ □ Option 3                           │
│ □ Option 4                           │
├──────────────────────────────────────┤
│ ⚠️ Section locked - Cannot go back   │
│ After 40 min, moves to next section  │
└──────────────────────────────────────┘
```

---

## Next Phase - NEET Subject Practice

```
┌──────────────────────────────────────┐
│ Physics | Chemistry | Biology         │ (Tabs)
├──────────────────────────────────────┤
│ Chapter: Mechanics (Physics)          │
│ Difficulty: [Easy] [Medium] [Hard]   │
│ Questions: 20                        │
├──────────────────────────────────────┤
│ Question Content                      │
│ [Answer Options]                      │
│ ☆ Bookmark this question             │
├──────────────────────────────────────┤
│ [Previous] [Next] [Review]           │
└──────────────────────────────────────┘
```

---

**Platform Status**: 🟢 Ready for Testing
**Last Updated**: January 2, 2026
**Version**: 1.0
