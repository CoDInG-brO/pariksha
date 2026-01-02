
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main className="pt-20 max-w-7xl mx-auto px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
