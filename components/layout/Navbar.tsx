
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

const tabs = [
  { name: "CAT", href: "/cat" },
  { name: "NEET", href: "/neet" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Take Test", href: "/take-test" },
  { name: "Practice Mode", href: "/practice" },
  { name: "Analytics", href: "/analytics" }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await signOut({ callbackUrl: "/login" });
  };

  // Get user initials for avatar
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "👤";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="font-bold text-xl text-white">MockExam AI</Link>
          
          {/* Profile Menu */}
          {session ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform border-2 border-white/20 overflow-hidden"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm">{getInitials(session.user?.name)}</span>
                )}
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-elevated rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* User Info Header */}
                  <div className="bg-gradient-to-br from-accent/20 to-blue-600/20 p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                        {session.user?.image ? (
                          <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>{getInitials(session.user?.name)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{session.user?.name || "User"}</p>
                        <p className="text-gray-400 text-sm">{session.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/profile/edit"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                    >
                      <span className="text-xl">✏️</span>
                      <div>
                        <p className="font-medium">Edit Profile</p>
                        <p className="text-xs text-gray-400">Update your information</p>
                      </div>
                    </Link>

                    <Link
                      href="/profile/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                    >
                      <span className="text-xl">⚙️</span>
                      <div>
                        <p className="font-medium">Settings</p>
                        <p className="text-xs text-gray-400">Preferences & notifications</p>
                      </div>
                    </Link>

                    <Link
                      href="/profile/performance"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                    >
                      <span className="text-xl">📊</span>
                      <div>
                        <p className="font-medium">My Performance</p>
                        <p className="text-xs text-gray-400">View your progress</p>
                      </div>
                    </Link>

                    <div className="h-px bg-white/10 my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                    >
                      <span className="text-xl">🚪</span>
                      <p className="font-medium">Logout</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-gradient-to-r from-accent to-blue-600 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-8 text-sm border-t border-white/10 pt-4 overflow-x-auto">
          {tabs.map(tab => {
            let bgClass = "";
            if (tab.name === "CAT" && pathname.startsWith("/cat")) {
              bgClass = "bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg";
            } else if (tab.name === "NEET" && pathname.startsWith("/neet")) {
              bgClass = "bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg";
            }

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`font-medium transition-colors whitespace-nowrap ${
                  bgClass || (pathname === tab.href
                    ? "text-white border-b-2 border-accent pb-2"
                    : "text-gray-400 hover:text-white pb-2")
                }`}
              >
                {tab.name === "CAT" && "📊 "}{tab.name === "NEET" && "🔬 "}{tab.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

