
"use client";
import { ThemeProvider, useTheme } from "next-themes";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

// Component to enforce dark theme when logged out
function ThemeEnforcer({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Force dark theme when not authenticated
    if (status === "unauthenticated") {
      setTheme("dark");
    }
  }, [status, setTheme]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ThemeEnforcer>
          {children}
        </ThemeEnforcer>
      </ThemeProvider>
    </SessionProvider>
  );
}
