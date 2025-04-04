import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "scriptvenox - lua scripts",
  description: "Modern repository for Lua scripts and cracks",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 border-b bg-background">
              <div className="flex h-16 items-center px-4 sm:px-8">
                <MainNav />
                <div className="flex md:hidden">
                  <MobileNav />
                </div>
              </div>
            </header>
            <main className="flex-1">
              <div className="px-4 sm:px-8 py-6 md:py-10">{children}</div>
            </main>
            <footer className="border-t py-6 md:py-0">
              <div className="px-4 sm:px-8 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm text-muted-foreground md:text-left">
                scriptvenox &copy; {new Date().getFullYear()} - All rights reserved
                </p>
                <p className="text-center text-sm text-muted-foreground md:text-right">
                  The modern Lua scripts repository
                </p>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

