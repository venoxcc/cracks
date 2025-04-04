"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// This component will be client-side for search functionality
export default function CracksPage() {
  const [crackFiles, setCrackFiles] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch crack files from the server
  useEffect(() => {
    async function fetchCrackFiles() {
      try {
        const response = await fetch("/api/cracks")
        if (response.ok) {
          const data = await response.json()
          setCrackFiles(data.files)
        } else {
          console.error("Failed to fetch crack files")
        }
      } catch (error) {
        console.error("Error fetching crack files:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCrackFiles()
  }, [])

  // Filter files based on search query
  const filteredFiles = crackFiles.filter((file) => file.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Crack Files</h1>
        <p className="text-muted-foreground">Browse and access crack Lua scripts.</p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search crack files..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] rounded-md border">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading crack files...</p>
          </div>
        ) : (
          <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <Card key={file} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">{file}</CardTitle>
                      </div>
                      <Badge>crack</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <CardDescription className="text-xs">Lua crack script</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-end">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/cracks/${file.replace(".lua", "")}`}>View File</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center py-8 text-muted-foreground">
                {crackFiles.length === 0 ? "No crack files found." : "No matching files found."}
              </p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

