"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const PROFILE_PHOTO_KEY = "iyotaprep_profile_photo";
const PROFILE_STORAGE_KEY = "iyotaprep_user_profile";

const menuItems = [
  {
    name: "Mock Tests",
    href: "#",
    icon: "📋",
    submenu: [
      {
        name: "JEE Mocks",
        href: "#",
        submenu: [
          { name: "Full Mock", href: "/jee/full-mock" },
          { name: "Half Mock", href: "/jee/full-mock?mockType=half" },
          { name: "Section-wise", href: "/jee" }
        ]
      },
      {
        name: "NEET Mocks",
        href: "#",
        submenu: [
          { name: "Full Mock", href: "/neet/full-mock" },
          { name: "Half Mock", href: "/neet/full-mock?mockType=half" },
          { name: "Section-wise", href: "/neet" }
        ]
      }
    ]
  },
  {
    name: "Practice Mode",
    href: "/practice",
    icon: "✏️",
    submenu: [
      { name: "Physics", href: "/practice?subject=physics" },
      { name: "Chemistry", href: "/practice?subject=chemistry" },
      { name: "Zoology", href: "/practice?subject=zoology" },
      { name: "Botany", href: "/practice?subject=botany" },
      { name: "Maths", href: "/practice?subject=maths" }
    ]
  },
  { name: "Prepare your Own Exam", href: "/examination/prepare-own", icon: "🛠️", submenu: [] },
  { name: "Analytics", href: "/analytics", icon: "📊", submenu: [] },
  { name: "Licenses", href: "#", icon: "🎫", submenu: [] }
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

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

  // Hide sidebar on auth pages, landing page, and full-mock exam pages
  if (pathname === "/signup" || pathname === "/login" || pathname === "/" || pathname === "/jee/full-mock" || pathname === "/neet/full-mock") {
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
    if (!displayName) return "👤";
    return displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getProfileImage = () => {
    return profilePhoto || session?.user?.image || null;
  };

  const getDisplayName = () => {
    return profileName || session?.user?.name || "User";
  };

  if (!mounted) return null;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-56 bg-gradient-to-b from-surface via-surface to-elevated border-r border-white/10 overflow-y-auto z-40 pointer-events-auto">
      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isExpanded = expandedItems.includes(item.name);
          const hasSubmenu = item.submenu.length > 0;
          const isPracticeMenu = item.name === "Practice Mode";
          const isMockMenu = item.name === "Mock Tests";

          return (
            <div key={item.name}>
              <div className={`flex items-center gap-0 rounded-lg ${
                isActive
                  ? "bg-gradient-to-r from-accent/20 to-blue-600/20 border border-accent/30"
                  : ""
              }`}>
                <Link
                  href={item.href}
                  onClick={(event) => {
                    if (isPracticeMenu || isMockMenu) {
                      event.preventDefault();
                      toggleExpand(item.name);
                    }
                  }}
                  className={`flex-1 flex items-center gap-3 px-4 py-2.5 font-medium text-sm transition-all duration-200 ${
                    !hasSubmenu ? "rounded-lg" : "rounded-l-lg"
                  } ${
                    isActive && !hasSubmenu
                      ? "bg-gradient-to-r from-accent/20 to-blue-600/20 text-white border border-accent/30"
                      : isActive && hasSubmenu
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  } ${
                    !isActive && !hasSubmenu ? "hover:bg-white/5" : ""
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1 text-left">{item.name}</span>
                </Link>
                {hasSubmenu && !isPracticeMenu && !isMockMenu && (
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className={`px-3 py-2.5 rounded-r-lg transition-all duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    <span className={`transition-transform duration-300 text-xs ${isExpanded ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                )}
              </div>

              {/* Submenu */}
              {hasSubmenu && isExpanded && (
                <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4">
                  {item.submenu.map((subitem) => {
                    const subKey = `${item.name}:${subitem.name}`;
                    const subHasSubmenu = Array.isArray(subitem.submenu) && subitem.submenu.length > 0;
                    const subExpanded = expandedItems.includes(subKey);

                    if (subHasSubmenu) {
                      return (
                        <div key={subitem.name}>
                          <button
                            onClick={() => toggleExpand(subKey)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <span className="flex-1 text-left">{subitem.name}</span>
                          </button>

                          {subExpanded && (
                            <div className="mt-1 ml-3 space-y-1 border-l border-white/10 pl-3">
                              {subitem.submenu.map((leaf) => (
                                <Link
                                  key={leaf.name}
                                  href={leaf.href}
                                  className={`block px-3 py-2 rounded-lg text-[11px] font-medium transition-all duration-200 ${
                                    pathname === leaf.href || pathname.includes(leaf.href)
                                      ? "text-accent bg-white/5"
                                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
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
                        className={`block px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                          pathname === subitem.href || pathname.includes(subitem.href)
                            ? "text-accent bg-white/5"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
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

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-4" />

      {/* Profile Section */}
      {session && (
        <div className="p-4">
          <Link
            href="/profile/edit"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-accent/10 to-blue-600/10 border border-white/5 hover:border-white/20 hover:bg-gradient-to-br hover:from-accent/20 hover:to-blue-600/20 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-bold overflow-hidden border border-white/20 flex-shrink-0">
              {getProfileImage() ? (
                <img src={getProfileImage()!} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs">{getInitials(session.user?.name)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{getDisplayName().split(" ")[0]}</p>
              <p className="text-gray-400 text-xs truncate">Exam Candidate</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
