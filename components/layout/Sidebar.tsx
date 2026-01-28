"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const PROFILE_PHOTO_KEY = "iyotaprep_profile_photo";
const PROFILE_STORAGE_KEY = "iyotaprep_user_profile";

type SidebarSubItem = {
  name: string;
  href: string;
  submenu?: SidebarSubItem[];
};

type SidebarItem = {
  name: string;
  href: string;
  icon: string;
  submenu: SidebarSubItem[];
};

const menuItems: SidebarItem[] = [
  {
    name: "Mock Tests",
    href: "/student/mock-tests",
    icon: "📋",
    submenu: []
  },
  {
    name: "Practice Mode",
    href: "/student/practice",
    icon: "✏️",
    submenu: []
  },
  { name: "Prepare Exam", href: "/student/prepare-own", icon: "🛠️", submenu: [] },
  { name: "Analytics", href: "/student/analytics", icon: "📊", submenu: [] },
  { name: "Licenses", href: "/student/licenses", icon: "🎫", submenu: [] }
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

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

  if (pathname === "/" || pathname.includes("/jee/full-mock") || pathname.includes("/neet/full-mock")) {
    return null;
  }

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const getInitials = (name: string | null | undefined) => {
    const displayName = profileName || name;
    if (!displayName) return "U";
    return displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getProfileImage = () => profilePhoto || null;
  const getDisplayName = () => profileName || "Student";

  if (!mounted) return null;

  return (
    <aside className="fixed left-0 top-10 h-[calc(100vh-40px)] w-[220px] bg-slate-50 dark:bg-slate-900/80 border-r border-slate-200/80 dark:border-slate-800/80 overflow-y-auto z-40 flex flex-col">
      {/* Menu Items */}
      <nav className="flex-1 px-2 py-2 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isExpanded = expandedItems.includes(item.name);
          const hasSubmenu = item.submenu.length > 0;
          const isMockMenu = item.name === "Mock Tests";

          return (
            <div key={item.name}>
              <div className={`flex items-center rounded-md ${
                isActive && !hasSubmenu ? "bg-sky-50 dark:bg-sky-900/20" : ""
              }`}>
                <Link
                  href={item.href}
                  onClick={(event) => {
                    if (hasSubmenu && isMockMenu) {
                      event.preventDefault();
                      toggleExpand(item.name);
                    }
                  }}
                  className={`flex-1 flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-medium transition-colors rounded-md ${
                    isActive && !hasSubmenu
                      ? "text-sky-600 dark:text-sky-400"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <span className="text-[18px]">{item.icon}</span>
                  <span className="flex-1">{item.name}</span>
                  {hasSubmenu && (
                    <span className={`text-[9px] text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                  )}
                </Link>
              </div>

              {/* Submenu */}
              {hasSubmenu && isExpanded && (
                <div className="mt-0.5 ml-3 pl-2.5 border-l border-slate-200 dark:border-slate-700/50 space-y-0.5">
                  {item.submenu.map((subitem) => {
                    const subKey = `${item.name}:${subitem.name}`;
                    const subHasSubmenu = "submenu" in subitem && Array.isArray(subitem.submenu) && subitem.submenu.length > 0;
                    const subExpanded = expandedItems.includes(subKey);

                    if (subHasSubmenu) {
                      const subMenuItems = subitem.submenu ?? [];
                      return (
                        <div key={subitem.name}>
                          <button
                            onClick={() => toggleExpand(subKey)}
                            className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <span className="flex-1 text-left">{subitem.name}</span>
                            <span className={`text-[8px] transition-transform ${subExpanded ? "rotate-180" : ""}`}>▼</span>
                          </button>

                          {subExpanded && subMenuItems.length > 0 && (
                            <div className="mt-0.5 ml-2 pl-2 border-l border-slate-200 dark:border-slate-700/50 space-y-0.5">
                              {subMenuItems.map((leaf) => (
                                <Link
                                  key={leaf.name}
                                  href={leaf.href}
                                  className={`block px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                                    pathname === leaf.href || pathname.includes(leaf.href)
                                      ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20"
                                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                  }`}
                                >
                                  {leaf.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className={`block px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                          pathname === subitem.href || pathname.includes(subitem.href)
                            ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        {subitem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Profile Section - Bottom */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-2">
          <Link
            href="/student/profile/edit"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-[10px] font-semibold overflow-hidden flex-shrink-0">
              {getProfileImage() ? (
                <img src={getProfileImage()!} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(getDisplayName())}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200 truncate">{getDisplayName().split(" ")[0]}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate">Candidate</p>
            </div>
          </Link>
        </div>
    </aside>
  );
}
