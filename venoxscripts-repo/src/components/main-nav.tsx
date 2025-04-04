import Link from "next/link"
import { Code2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export function MainNav() {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-6 md:gap-10">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">scriptvenox</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={cn("flex items-center text-sm font-medium transition-colors hover:text-primary")}>
            Home
          </Link>
          <Link
            href="/explorer"
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
            )}
          >
            Explorer
          </Link>
          <Link
            href="/sources"
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
            )}
          >
            Sources
          </Link>
          <Link
            href="/cracks"
            className={cn(
              "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
            )}
          >
            Cracks
          </Link>
        </nav>
      </div>
      <div className="hidden md:flex">
        <ModeToggle />
      </div>
    </div>
  )
}

