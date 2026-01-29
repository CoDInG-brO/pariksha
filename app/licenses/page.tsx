"use client";
import { useRouter } from "next/navigation";

const featureAccess = [
  { name: "Full Mock Tests", enabled: true },
  { name: "Section-wise Tests", enabled: true },
  { name: "Analytics", enabled: true },
  { name: "AI Recommendations", enabled: false },
  { name: "Daily Practice", enabled: true },
  { name: "Doubt Solving", enabled: false }
];

const history = [
  { plan: "Free", start: "Jan 10, 2025", end: "Feb 10, 2025", amount: "₹0" },
  { plan: "Basic", start: "Feb 11, 2025", end: "May 11, 2025", amount: "₹799" },
  { plan: "Pro", start: "May 12, 2025", end: "Nov 12, 2025", amount: "₹1499" }
];

export default function LicensesPage() {
  const router = useRouter();
  const daysRemaining = 12;
  const mocksUsed = 8;
  const mocksTotal = 10;
  const usagePercent = Math.round((mocksUsed / mocksTotal) * 100);

  return (
    <div className="pt-2 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-lg"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">Licenses & Subscription</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <p className="text-xs text-slate-500">Current Plan</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pro Plan</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Active
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <p className="text-slate-500">Exam Enabled</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">JEE + NEET</p>
              </div>
              <div>
                <p className="text-slate-500">Expiry Date</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">Feb 10, 2026</p>
              </div>
              <div>
                <p className="text-slate-500">Days Remaining</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">{daysRemaining} days</p>
              </div>
              <div>
                <p className="text-slate-500">Status</p>
                <p className="font-medium text-emerald-500">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-xs">
            <p className="font-medium text-amber-600">License expiring in {daysRemaining} days</p>
            <p className="text-amber-700/80">Renew now to avoid interruption.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">License Details</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-500">License ID</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">LIC-JEE-48219</p>
              </div>
              <div>
                <p className="text-slate-500">Purchase Date</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">Feb 10, 2025</p>
              </div>
              <div>
                <p className="text-slate-500">Expiration Date</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">Feb 10, 2026</p>
              </div>
              <div>
                <p className="text-slate-500">Devices</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">2</p>
              </div>
              <div>
                <p className="text-slate-500">Mock Tests Remaining</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">2</p>
              </div>
              <div>
                <p className="text-slate-500">Practice Attempts</p>
                <p className="font-medium text-slate-900 dark:text-slate-100">120</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Feature Access</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {featureAccess.map((feature) => (
                <div key={feature.name} className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 dark:text-slate-400">{feature.name}</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] ${
                    feature.enabled
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-slate-200/60 text-slate-500 border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
                  }`}>
                    {feature.enabled ? "Enabled" : "Locked"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Usage Stats</h2>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Tests Used</span>
                  <span>{mocksUsed}/{mocksTotal}</span>
                </div>
                <div className="h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${usagePercent}%` }} />
                </div>
                <p className="text-amber-600 text-[10px] mt-1">You have used {usagePercent}% of mocks</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Practice Questions Used</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">380 / 500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Time Spent Learning</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">42h</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button className="h-8 px-3 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800">Upgrade Plan</button>
          <button className="h-8 px-3 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800">Renew License</button>
          <button className="h-8 px-3 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800">Buy Add-ons</button>
          <button className="h-8 px-3 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800">Download Invoice</button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">License History</h2>
          <div className="grid grid-cols-4 text-xs text-slate-500 mb-2">
            <span>Plan</span>
            <span>Start</span>
            <span>End</span>
            <span>Amount</span>
          </div>
          <div className="space-y-2">
            {history.map((row) => (
              <div key={row.plan} className="grid grid-cols-4 text-xs">
                <span className="text-slate-700 dark:text-slate-200 font-medium">{row.plan}</span>
                <span className="text-slate-600 dark:text-slate-400">{row.start}</span>
                <span className="text-slate-600 dark:text-slate-400">{row.end}</span>
                <span className="text-slate-700 dark:text-slate-200 font-medium">{row.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
