"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileIcon, GridIcon, ListIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface FileExplorerProps {
  type: "all" | "sources" | "cracks"
}

interface FileItem {
  name: string
  type: "source" | "crack"
}

export function FileExplorer({ type }: FileExplorerProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewType, setViewType] = useState<"card" | "list">("card")

  useEffect(() => {
    async function fetchFiles() {
      setIsLoading(true)
      try {
        let sourceFiles: FileItem[] = []
        let crackFiles: FileItem[] = []

        // Fetch source files if needed
        if (type === "all" || type === "sources") {
          const sourcesResponse = await fetch("/api/sources")
          if (sourcesResponse.ok) {
            const data = await sourcesResponse.json()
            sourceFiles = data.files.map((file: string) => ({
              name: file,
              type: "source" as const,
            }))
          }
        }

        // Fetch crack files if needed
        if (type === "all" || type === "cracks") {
          const cracksResponse = await fetch("/api/cracks")
          if (cracksResponse.ok) {
            const data = await cracksResponse.json()
            crackFiles = data.files.map((file: string) => ({
              name: file,
              type: "crack" as const,
            }))
          }
        }

        // Combine files based on type
        let combinedFiles: FileItem[] = []
        if (type === "all") {
          combinedFiles = [...sourceFiles, ...crackFiles]
        } else if (type === "sources") {
          combinedFiles = sourceFiles
        } else {
          combinedFiles = crackFiles
        }

        setFiles(combinedFiles)
      } catch (error) {
        console.error("Error fetching files:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [type])

  // Filter files based on search query
  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ToggleGroup
          type="single"
          value={viewType}
          onValueChange={(value:string) => value && setViewType(value as "card" | "list")}
        >
          <ToggleGroupItem value="card" aria-label="Card View">
            <GridIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List View">
            <ListIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] rounded-md border">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Loading files...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              {files.length === 0 ? "No files found." : "No matching files found."}
            </p>
          </div>
        ) : viewType === "card" ? (
          <CardView files={filteredFiles} />
        ) : (
          <ListView files={filteredFiles} />
        )}
      </ScrollArea>
    </div>
  )
}

function CardView({ files }: { files: FileItem[] }) {
  return (
    <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {files.map((file) => (
        <Card key={`${file.type}-${file.name}`} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">{file.name}</CardTitle>
              </div>
              <Badge variant={file.type === "source" ? "secondary" : "default"}>{file.type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <CardDescription className="text-xs">
              {file.type === "source" ? "Lua source file" : "Lua crack script"}
            </CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/${file.type === "source" ? "sources" : "cracks"}/${file.name.replace(".lua", "")}`}>
                View File
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function ListView({ files }: { files: FileItem[] }) {
  return (
    <div className="divide-y">
      {files.map((file) => (
        <div key={`${file.type}-${file.name}`} className="p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">Lua {file.type === "source" ? "source" : "crack"} file</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={file.type === "source" ? "secondary" : "default"}>{file.type}</Badge>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/${file.type === "source" ? "sources" : "cracks"}/${file.name.replace(".lua", "")}`}>
                  View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

