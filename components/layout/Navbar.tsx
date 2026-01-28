
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const PROFILE_PHOTO_KEY = "iyotaprep_profile_photo";
const PROFILE_STORAGE_KEY = "iyotaprep_user_profile";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const savedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);
    if (savedPhoto) setProfilePhoto(savedPhoto);
    
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) setProfileName(parsed.name);
      } catch (e) {
        console.error("Failed to parse profile:", e);
      }
    }

    const handleStorageUpdate = () => {
      const updatedPhoto = localStorage.getItem(PROFILE_PHOTO_KEY);
      if (updatedPhoto) setProfilePhoto(updatedPhoto);
      const updatedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (updatedProfile) {
        try {
          const parsed = JSON.parse(updatedProfile);
          if (parsed.name) setProfileName(parsed.name);
        } catch (e) {
          console.error("Failed to parse profile:", e);
        }
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/" || pathname.includes("/jee/full-mock") || pathname.includes("/neet/full-mock")) {
    return null;
  }

  const handleLogout = () => {
    setShowProfileMenu(false);
    router.push("/student/dashboard");
  };

  const getInitials = (name: string | null | undefined) => {
    const displayName = profileName || name;
    if (!displayName) return "U";
    return displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getDisplayName = () => profileName || "Student";
  const getProfileImage = () => profilePhoto || null;

  return (
    <header className="sticky top-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800/80 h-10">
      <div className="h-full max-w-7xl mx-auto px-4">
        <div className="h-full flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/student/dashboard" className="flex items-center gap-2 group">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform group-hover:scale-105"
            >
              <rect x="4" y="6" width="6" height="20" rx="1" transform="rotate(-12 4 6)" className="fill-orange-500" />
              <rect x="11" y="4" width="6" height="22" rx="1" className="fill-green-500" />
              <rect x="18" y="8" width="5" height="18" rx="1" className="fill-yellow-500" />
              <rect x="24" y="10" width="5" height="16" rx="1" className="fill-cyan-500" />
              <rect x="2" y="26" width="28" height="2" rx="1" className="fill-slate-400" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-[13px] bg-gradient-to-r from-orange-500 via-yellow-500 to-cyan-500 bg-clip-text text-transparent">
                IYOTAPREP
              </span>
              <span className="text-[8px] text-slate-500 font-medium tracking-wider">EXAM PREP</span>
            </div>
          </Link>

          {/* Right Side Navigation */}
          <div className="flex items-center gap-1">
            <Link
              href="/student/dashboard"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-[13px]">🏠</span>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/student/profile/edit"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-[13px]">✏️</span>
              <span>Profile</span>
            </Link>

            <Link
              href="/student/profile/settings"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-[13px]">⚙️</span>
              <span>Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <span className="text-[13px]">🚪</span>
              <span>Logout</span>
            </button>

            {/* Profile Avatar */}
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-semibold overflow-hidden hover:ring-2 hover:ring-sky-300 dark:hover:ring-sky-700 transition-all"
              >
                {getProfileImage() ? (
                  <img src={getProfileImage()!} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{getInitials(getDisplayName())}</span>
                )}
              </button>

              {/* Mobile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden md:hidden">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200">{getDisplayName().split(" ")[0]}</p>
                    <p className="text-[9px] text-slate-500">Candidate</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/student/profile/edit"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <span className="text-[12px]">✏️</span>
                      Edit Profile
                    </Link>

                    <Link
                      href="/student/profile/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <span className="text-[12px]">⚙️</span>
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <span className="text-[12px]">🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

