"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mock_credits_v1";
const DEFAULT_CREDITS = {
  JEE: {
    full: 2,
    half: 2
  },
  NEET: {
    full: 2,
    half: 2
  }
};

const mockLinks = {
  JEE: {
    full: "/student/jee/full-mock",
    half: "/student/jee/full-mock?mockType=half",
    section: "/student/jee"
  },
  NEET: {
    full: "/student/neet/full-mock",
    half: "/student/neet/full-mock?mockType=half",
    section: "/student/neet"
  }
};

const cardStyles = {
  JEE: {
    border: "border-orange-400/40",
    bg: "bg-orange-500/5",
    badge: "bg-orange-100 text-orange-700",
    button: "text-orange-700 border-orange-300/50 hover:border-orange-400/70 hover:bg-orange-100/70",
    disabled: "text-orange-300 border-orange-200/40 bg-orange-50/40",
    iconBg: "from-orange-500 to-red-500"
  },
  NEET: {
    border: "border-emerald-400/40",
    bg: "bg-emerald-500/5",
    badge: "bg-emerald-100 text-emerald-700",
    button: "text-emerald-700 border-emerald-300/50 hover:border-emerald-400/70 hover:bg-emerald-100/70",
    disabled: "text-emerald-300 border-emerald-200/40 bg-emerald-50/40",
    iconBg: "from-green-500 to-teal-500"
  }
};

function ActionButton({
  label,
  accent,
  disabled,
  badge,
  onClick
}: {
  label: string;
  accent: typeof cardStyles.JEE;
  disabled?: boolean;
  badge?: string;
  onClick: () => void;
}) {
  const content = (
    <span className="flex items-center justify-between gap-3 w-full">
      <span className="text-xs font-semibold">{label}</span>
      {badge && (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${accent.badge}`}>
          {badge}
        </span>
      )}
    </span>
  );

  if (disabled) {
    return (
      <div className={`px-3 py-2 rounded-lg border text-xs font-semibold opacity-60 cursor-not-allowed ${accent.disabled}`}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${accent.button}`}
    >
      {content}
    </button>
  );
}

export default function MockTestsPage() {
  const router = useRouter();
  const [credits, setCredits] = useState(DEFAULT_CREDITS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCredits(parsed);
      } catch {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CREDITS));
        setCredits(DEFAULT_CREDITS);
      }
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CREDITS));
    setCredits(DEFAULT_CREDITS);
  }, []);

  const handleStart = (exam: "JEE" | "NEET", type: "full" | "half" | "section") => {
    if (!mounted) return;
    const links = mockLinks[exam];
    const target = type === "section" ? links.section : type === "full" ? links.full : links.half;
    if (type === "section") {
      router.push(target);
      return;
    }

    const remaining = credits[exam][type];
    if (remaining <= 0) return;

    const updated = {
      ...credits,
      [exam]: {
        ...credits[exam],
        [type]: Math.max(0, remaining - 1)
      }
    };
    setCredits(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    router.push(target);
  };

  return (
    <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Mock Tests</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Pick an exam and choose the mock type.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["JEE", "NEET"] as const).map((exam) => {
            const accent = cardStyles[exam];
            const inventory = credits[exam];

            return (
              <motion.div
                key={exam}
                whileHover={{ scale: 1.01 }}
                className={`p-5 rounded-2xl border ${accent.border} ${accent.bg}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accent.iconBg} flex items-center justify-center shadow-md text-white text-lg`}>
                    {exam === "JEE" ? "📘" : "🧬"}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{exam} Mocks</h2>
                    <p className="text-gray-300 text-sm">Full, half and section-wise practice</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <ActionButton
                    label="Full Mock"
                    accent={accent}
                    disabled={inventory.full <= 0}
                    badge={`${inventory.full} left`}
                    onClick={() => handleStart(exam, "full")}
                  />
                  <ActionButton
                    label="Half Mock"
                    accent={accent}
                    disabled={inventory.half <= 0}
                    badge={`${inventory.half} left`}
                    onClick={() => handleStart(exam, "half")}
                  />
                  <ActionButton
                    label="Section-wise (Free)"
                    accent={accent}
                    onClick={() => handleStart(exam, "section")}
                  />
                </div>

                {(inventory.full <= 0 || inventory.half <= 0) && (
                  <p className="mt-3 text-[11px] text-slate-500">
                    Full/Half mocks require purchase when credits are exhausted.
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
