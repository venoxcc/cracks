"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <ModeToggle />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="px-2 py-6 space-y-4">
            <Link href="/" className="flex items-center py-2 text-lg" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/explorer" className="flex items-center py-2 text-lg" onClick={() => setOpen(false)}>
              Explorer
            </Link>
            <Link href="/sources" className="flex items-center py-2 text-lg" onClick={() => setOpen(false)}>
              Sources
            </Link>
            <Link href="/cracks" className="flex items-center py-2 text-lg" onClick={() => setOpen(false)}>
              Cracks
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

