
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

const PROFILE_PHOTO_KEY = "iyotaprep_profile_photo";
const PROFILE_STORAGE_KEY = "iyotaprep_user_profile";

const tabs = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "CAT", href: "/cat", icon: "📈" },
  { name: "NEET", href: "/neet", icon: "🔬" },
  { name: "Practice Mode", href: "/practice", icon: "✏️" },
  { name: "Analytics", href: "/analytics", icon: "📉" }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch for theme and load profile data
  useEffect(() => {
    setMounted(true);
    // Load profile photo from localStorage
    const savedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
    // Load profile name from localStorage
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) {
          setProfileName(parsed.name);
        }
      } catch (e) {
        console.error("Failed to parse profile:", e);
      }
    }
  }, []);

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

  // Hide navbar on auth pages, landing page, and full-mock exam pages
  if (pathname === "/signup" || pathname === "/login" || pathname === "/" || pathname === "/cat/full-mock" || pathname === "/neet/full-mock") {
    return null;
  }

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await signOut({ callbackUrl: "/login" });
  };

  // Get user initials for avatar
  const getInitials = (name: string | null | undefined) => {
    // Prioritize localStorage name, then session name
    const displayName = profileName || name;
    if (!displayName) return "👤";
    return displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Get display name (localStorage first, then session)
  const getDisplayName = () => {
    return profileName || session?.user?.name || "User";
  };

  // Get profile image (localStorage first, then session)
  const getProfileImage = () => {
    return profilePhoto || session?.user?.image || null;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            {/* Logo - Book Stack SVG */}
            <svg 
              width="28" 
              height="28" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform group-hover:scale-105"
            >
              {/* Book 1 - Tilted (Orange/Red) */}
              <rect x="4" y="6" width="6" height="20" rx="1" transform="rotate(-12 4 6)" 
                className="fill-orange-500" />
              <rect x="5.5" y="8" width="3" height="14" rx="0.5" transform="rotate(-12 5.5 8)" 
                className="fill-orange-300" />
              
              {/* Book 2 - Tall (Green) */}
              <rect x="11" y="4" width="6" height="22" rx="1" 
                className="fill-green-500" />
              <rect x="12.5" y="6" width="3" height="16" rx="0.5" 
                className="fill-green-300" />
              
              {/* Book 3 - Medium (Yellow) */}
              <rect x="18" y="8" width="5" height="18" rx="1" 
                className="fill-yellow-500" />
              <rect x="19.2" y="10" width="2.5" height="12" rx="0.5" 
                className="fill-yellow-300" />
              
              {/* Book 4 - Short (Blue/Cyan) */}
              <rect x="24" y="10" width="5" height="16" rx="1" 
                className="fill-cyan-500" />
              <rect x="25.2" y="12" width="2.5" height="10" rx="0.5" 
                className="fill-cyan-300" />
              
              {/* Shelf */}
              <rect x="2" y="26" width="28" height="2" rx="1" 
                className="fill-gray-400 dark:fill-gray-500" />
            </svg>
            
            <span className="font-bold text-xl text-white tracking-tight">
              IYOTAPREP
            </span>
          </Link>
          
          {/* Profile Menu */}
          {session ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform border-2 border-white/20 overflow-hidden"
              >
                {getProfileImage() ? (
                  <img src={getProfileImage()!} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm">{getInitials(session.user?.name)}</span>
                )}
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-elevated rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* User Info Header */}
                  <div className="bg-gradient-to-br from-accent/20 to-blue-600/20 p-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold text-base overflow-hidden">
                        {getProfileImage() ? (
                          <img src={getProfileImage()!} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>{getInitials(session.user?.name)}</span>
                        )}
                      </div>
                      <p className="text-white font-medium text-sm">{getDisplayName().split(' ')[0]}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1.5">
                    <Link
                      href="/profile/edit"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                    >
                      <span className="text-base">✏️</span>
                      <div>
                        <p className="text-sm font-medium">Edit Profile</p>
                        <p className="text-[10px] text-gray-400">Update your information</p>
                      </div>
                    </Link>

                    <Link
                      href="/profile/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                    >
                      <span className="text-base">⚙️</span>
                      <div>
                        <p className="text-sm font-medium">Settings</p>
                        <p className="text-[10px] text-gray-400">Preferences & notifications</p>
                      </div>
                    </Link>

                    <Link
                      href="/profile/performance"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                    >
                      <span className="text-base">📊</span>
                      <div>
                        <p className="text-sm font-medium">My Performance</p>
                        <p className="text-[10px] text-gray-400">View your progress</p>
                      </div>
                    </Link>

                    <div className="h-px bg-white/10 my-1.5" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                    >
                      <span className="text-base">🚪</span>
                      <p className="text-sm font-medium">Logout</p>
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
        <nav className="flex gap-6 text-[13px] border-t border-white/10 pt-4 overflow-x-auto">
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
                className={`font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  bgClass || (pathname === tab.href
                    ? "text-accent border-b-2 border-accent pb-2"
                    : "text-gray-500 hover:text-accent pb-2")
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

