
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

const PROFILE_PHOTO_KEY = "iyotaprep_profile_photo";
const PROFILE_STORAGE_KEY = "iyotaprep_user_profile";

const tabs = [];

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

    // Listen for storage updates from profile edit page
    const handleStorageUpdate = () => {
      const updatedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);
      if (updatedPhoto) {
        setProfilePhoto(updatedPhoto);
      }
      const updatedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (updatedProfile) {
        try {
          const parsed = JSON.parse(updatedProfile);
          if (parsed.name) {
            setProfileName(parsed.name);
          }
        } catch (e) {
          console.error("Failed to parse profile:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
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
  if (pathname === "/signup" || pathname === "/login" || pathname === "/" || pathname === "/jee/full-mock" || pathname === "/neet/full-mock") {
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
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-surface via-surface to-background/50 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            {/* Logo - Book Stack SVG */}
            <div className="relative">
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
              >
                {/* Book 1 - Tilted (Orange/Red) */}
                <rect x="4" y="6" width="6" height="20" rx="1" transform="rotate(-12 4 6)" 
                  className="fill-orange-500 drop-shadow-lg" />
                <rect x="5.5" y="8" width="3" height="14" rx="0.5" transform="rotate(-12 5.5 8)" 
                  className="fill-orange-300" />
                
                {/* Book 2 - Tall (Green) */}
                <rect x="11" y="4" width="6" height="22" rx="1" 
                  className="fill-green-500 drop-shadow-lg" />
                <rect x="12.5" y="6" width="3" height="16" rx="0.5" 
                  className="fill-green-300" />
                
                {/* Book 3 - Medium (Yellow) */}
                <rect x="18" y="8" width="5" height="18" rx="1" 
                  className="fill-yellow-500 drop-shadow-lg" />
                <rect x="19.2" y="10" width="2.5" height="12" rx="0.5" 
                  className="fill-yellow-300" />
                
                {/* Book 4 - Short (Blue/Cyan) */}
                <rect x="24" y="10" width="5" height="16" rx="1" 
                  className="fill-cyan-500 drop-shadow-lg" />
                <rect x="25.2" y="12" width="2.5" height="10" rx="0.5" 
                  className="fill-cyan-300" />
                
                {/* Shelf */}
                <rect x="2" y="26" width="28" height="2" rx="1" 
                  className="fill-gray-400 dark:fill-gray-500" />
              </svg>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-cyan-500 rounded-lg opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 -z-10" />
            </div>
            
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-orange-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                IYOTAPREP
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-widest">EXAM PREP</span>
            </div>
          </Link>

          {/* Navigation placeholder - removed tabs */}
          <div className="hidden lg:block" />

          {/* Right Side - Profile & Auth */}
          <div className="flex items-center gap-2 lg:gap-4">
            {session ? (
              <>
                {/* Header action buttons */}
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <span>🏠</span>
                  <span className="hidden lg:inline">Dashboard</span>
                </Link>

                <Link
                  href="/profile/edit"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <span>✏️</span>
                  <span className="hidden lg:inline">Edit Profile</span>
                </Link>

                <Link
                  href="/profile/settings"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <span>⚙️</span>
                  <span className="hidden lg:inline">Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  <span>🚪</span>
                  <span className="hidden lg:inline">Logout</span>
                </button>

                {/* Profile Avatar with dropdown for mobile */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="group relative"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent via-blue-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-40 blur transition-all duration-300 group-hover:duration-200" />
                    <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 border border-white/20 overflow-hidden">
                      {getProfileImage() ? (
                        <img src={getProfileImage()!} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm">{getInitials(session.user?.name)}</span>
                      )}
                    </div>
                  </button>

                  {/* Mobile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-gradient-to-b from-surface to-elevated rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl md:hidden">
                      {/* User Info Header */}
                      <div className="bg-gradient-to-br from-accent/10 via-blue-600/10 to-transparent p-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold overflow-hidden border border-white/20 shadow-lg shadow-accent/20">
                            {getProfileImage() ? (
                              <img src={getProfileImage()!} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <span>{getInitials(session.user?.name)}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{getDisplayName().split(' ')[0]}</p>
                            <p className="text-gray-400 text-xs">Exam Candidate</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link
                          href="/profile/edit"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white group"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">✏️</span>
                          <div>
                            <p className="text-sm font-medium">Edit Profile</p>
                            <p className="text-[11px] text-gray-400">Update information</p>
                          </div>
                        </Link>

                        <Link
                          href="/profile/settings"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 text-gray-300 hover:text-white group"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">⚙️</span>
                          <div>
                            <p className="text-sm font-medium">Settings</p>
                            <p className="text-[11px] text-gray-400">Preferences</p>
                          </div>
                        </Link>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/20 transition-all duration-200 text-red-400 hover:text-red-300 group"
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
                          <p className="text-sm font-medium">Logout</p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="relative group px-6 py-2 font-semibold text-sm text-white overflow-hidden rounded-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent via-blue-500 to-cyan-500 transition-all duration-300 opacity-100 group-hover:opacity-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-accent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <span className="relative">Sign In →</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

