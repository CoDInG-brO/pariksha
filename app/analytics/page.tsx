"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from "recharts";
import {
  calculateJEEPercentile,
  calculateNEETPercentile
} from "@/lib/percentileCalculator";


export default function Analytics() {
  const router = useRouter();
  const [examType, setExamType] = useState<"JEE" | "NEET">("JEE");
  const [score, setScore] = useState<number>(150);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const jeeResult = calculateJEEPercentile(score);
  const neetResult = calculateNEETPercentile(score);
  const result = examType === "JEE" ? jeeResult : neetResult;

  const subjectPerformance = examType === "JEE"
    ? [
        { name: "Physics", score: 72 },
        { name: "Chemistry", score: 68 },
        { name: "Mathematics", score: 61 }
      ]
    : [
        { name: "Physics", score: 66 },
        { name: "Chemistry", score: 70 },
        { name: "Biology", score: 74 }
      ];

  const chapterAccuracy = [
    { name: "Electrostatics", score: 78 },
    { name: "Organic Chem", score: 64 },
    { name: "Algebra", score: 59 },
    { name: "Thermodynamics", score: 71 },
    { name: "Trigonometry", score: 54 },
    { name: "Mechanics", score: 83 }
  ];

  const difficultyMix = [
    { level: "Easy", score: 82 },
    { level: "Medium", score: 64 },
    { level: "Hard", score: 48 }
  ];

  const lineData = [52, 58, 61, 64, 62, 68, 72, 71, 75].map((scoreValue, idx) => ({
    label: `T${idx + 1}`,
    score: scoreValue
  }));
  const barData = subjectPerformance.map((item) => ({
    subject: item.name,
    score: item.score
  }));
  const heatmapChapters = [
    "Kinematics", "NLM", "Waves", "Electro", "Optics", "Modern",
    "GOC", "Hydro", "Equilibrium", "Thermo", "Coord", "Biomol"
  ].map((name, idx) => ({
    name,
    score: [82, 69, 55, 74, 88, 61, 43, 67, 79, 58, 46, 71][idx]
  }));

  const strengths = ["Electrostatics", "Waves", "Modern Physics"];
  const weaknesses = ["Trigonometry", "Organic Chem", "Algebra"];

  return (
    <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Analytics</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Actionable insights to guide your next study focus.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["JEE", "NEET"] as const).map(type => (
              <button
                key={type}
                onClick={() => setExamType(type)}
                className={`h-8 px-3 rounded-md text-xs font-semibold transition-all ${
                  examType === type
                    ? (type === "JEE" ? "bg-blue-500 text-white" : "bg-green-500 text-white")
                    : "bg-white/80 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
            <select className="h-8 px-2 rounded-md text-xs bg-white/80 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
            <select className="h-8 px-2 rounded-md text-xs bg-white/80 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200">
              <option>All subjects</option>
              {subjectPerformance.map((item) => (
                <option key={item.name}>{item.name}</option>
              ))}
            </select>
            <select className="h-8 px-2 rounded-md text-xs bg-white/80 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200">
              <option>All difficulty</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <p className="text-xs text-slate-500">Average Score</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{result.score}</p>
            <p className="text-xs text-emerald-500">+3.2% vs last month</p>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <p className="text-xs text-slate-500">Accuracy</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">68%</p>
            <p className="text-xs text-emerald-500">↑ 2.1%</p>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <p className="text-xs text-slate-500">Tests Attempted</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">14</p>
            <p className="text-xs text-slate-500">Last 30 days</p>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <p className="text-xs text-slate-500">Percentile</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{result.percentile.toFixed(1)}</p>
            <p className="text-xs text-slate-500">Rank #{result.rank.toLocaleString("en-US")}</p>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <p className="text-xs text-slate-500">Improvement Trend</p>
            <p className="text-lg font-semibold text-emerald-500">↑ 4.6%</p>
            <p className="text-xs text-slate-500">Last 5 tests</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Subject Performance</h3>
              <span className="text-xs text-slate-500">Avg</span>
            </div>
            <div className="space-y-2">
              {subjectPerformance.map((item) => (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.name}</span>
                    <span>{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Chapter Accuracy</h3>
              <span className="text-xs text-slate-500">Top 6</span>
            </div>
            <div className="space-y-2">
              {chapterAccuracy.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{item.score}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Difficulty Analysis</h3>
              <span className="text-xs text-slate-500">Accuracy</span>
            </div>
            <div className="space-y-2">
              {difficultyMix.map((item) => (
                <div key={item.level}>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.level}</span>
                    <span>{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${item.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Score Progression</h3>
              <span className="text-xs text-slate-500">Last 9 tests</span>
            </div>
            <div className="h-24">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-md bg-slate-200/60 dark:bg-slate-800/40" />
              )}
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Subject Comparison</h3>
            </div>
            <div className="h-24">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                    <XAxis dataKey="subject" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-md bg-slate-200/60 dark:bg-slate-800/40" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Chapter Heatmap</h3>
            <span className="text-xs text-slate-500">Strengths & weaknesses</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {heatmapChapters.map((item) => (
              <div
                key={item.name}
                className={`rounded-md border px-2 py-1 text-xs font-medium text-center ${
                  item.score >= 75
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : item.score >= 60
                    ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                    : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Question Intelligence</h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Avg time / question</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">52s</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Silly mistakes</span>
                <span className="font-medium text-rose-400">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Conceptual errors</span>
                <span className="font-medium text-amber-400">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Skipped vs Attempted</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">14 / 86</span>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Student Insights</h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Accuracy trend</span>
                <span className="font-medium text-emerald-500">↑ 3.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Speed trend</span>
                <span className="font-medium text-sky-500">↑ 6s faster</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Consistency score</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">74 / 100</span>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Strength & Weakness</h3>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-emerald-500 font-medium">Strong chapters</p>
                <p className="text-slate-600 dark:text-slate-400">{strengths.join(", ")}</p>
              </div>
              <div>
                <p className="text-rose-500 font-medium">Weak chapters</p>
                <p className="text-slate-600 dark:text-slate-400">{weaknesses.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3 lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Smart Recommendations</h3>
              <span className="text-xs text-slate-500">Next 7 days</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Revise: Trigonometry, Organic Chem</span>
                <button onClick={() => router.push("/student/practice")} className="h-7 px-3 text-[10px] bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer border-0">Start practice</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Attempt: {examType} Full Mock (timed)</span>
                <button onClick={() => router.push(examType === "JEE" ? "/student/jee/full-mock" : "/student/neet/full-mock")} className="h-7 px-3 text-[10px] bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer border-0">Start mock</button>
              </div>
              <div className="flex items-center justify-between">
                <span>Review: Mistakes from last 3 tests</span>
                <button onClick={() => router.push("/student/analytics/review")} className="h-7 px-3 text-[10px] bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer border-0">Review</button>
              </div>
            </div>
          </div>
          <div className="bg-surface rounded-lg border border-slate-200/60 dark:border-slate-800 p-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Weak topics</h3>
            <div className="space-y-2 text-xs">
              {["Trigonometry", "Organic Chem", "Algebra"].map((topic) => (
                <div key={topic} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">{topic}</span>
                  <button onClick={() => router.push("/student/practice")} className="h-7 px-3 text-[10px] bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer border-0">Practice</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
