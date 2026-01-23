
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${grotesk.variable} ${jetbrains.variable} antialiased`}>
        <Providers>
          <Navbar />
          <main className="pt-16 max-w-7xl mx-auto px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
