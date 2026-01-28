
"use client";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Inter, JetBrains_Mono } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages where sidebar should be hidden
  const hideSidebar = pathname === "/" || pathname.includes("/jee/full-mock") || pathname.includes("/neet/full-mock");

  return (
    <>
      <Navbar />
      <Sidebar />
      <main className={`bg-slate-100/60 dark:bg-slate-950 ${hideSidebar ? 'px-4 max-w-7xl mx-auto' : 'pl-[220px] pr-3'}`}>
        <div className={hideSidebar ? 'pt-4' : 'pt-4 max-w-6xl'}>
          {children}
        </div>
      </main>
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} antialiased font-sans`}>
        <Providers>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Providers>
      </body>
    </html>
  );
}
