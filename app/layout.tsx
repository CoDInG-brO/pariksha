
"use client";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { usePathname } from "next/navigation";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages where sidebar should be hidden
  const hideSidebar = pathname === "/signup" || pathname === "/login" || pathname === "/" || pathname === "/jee/full-mock" || pathname === "/neet/full-mock";

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className={`pt-16 min-h-screen ${hideSidebar ? 'px-6 max-w-7xl mx-auto' : 'pl-56 pr-6'}`}>
        <div className={hideSidebar ? '' : 'max-w-7xl'}>
          {children}
        </div>
      </main>
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${grotesk.variable} ${jetbrains.variable} antialiased`}>
        <Providers>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Providers>
      </body>
    </html>
  );
}
