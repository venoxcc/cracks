import Link from "next/link"
import { Code, FileCode, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 max-w-6xl mx-auto">
      <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            <span className="text-primary">scripts - ~welcome!</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            all my cracks, and sources — in one place..
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
            <Button asChild size="lg">
              <Link href="/explorer">Explore Scripts</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sources">View Sources</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid w-full gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <FileCode className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Source Files</CardTitle>
            <CardDescription>Browse and access original Lua source files</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our repository contains a collection of Lua source files that you can view, copy, and use in your
              projects.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/sources">View Sources</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Code className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Crack Files</CardTitle>
            <CardDescription>Access and use crack scripts easily</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Find and use crack scripts with our modern interface. Copy loadstrings with a single click.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cracks">View Cracks</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="w-8 h-8 text-primary mb-2" />
            <CardTitle>Script Explorer</CardTitle>
            <CardDescription>Unified explorer for all scripts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use our unified explorer to browse all scripts in one place. Toggle between code view and loadstring.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/explorer">Open Explorer</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}

