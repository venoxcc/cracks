"use client"

import { useState } from "react"
import { FileExplorer } from "@/components/file-explorer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ExplorerPage() {
  const [activeTab, setActiveTab] = useState<"all" | "sources" | "cracks">("all")

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Script Explorer</h1>
        <p className="text-muted-foreground">Browse all scripts in one place. Click on a file to view its contents.</p>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) => setActiveTab(value as "all" | "sources" | "cracks")}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="cracks">Cracks</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <FileExplorer type="all" />
        </TabsContent>
        <TabsContent value="sources">
          <FileExplorer type="sources" />
        </TabsContent>
        <TabsContent value="cracks">
          <FileExplorer type="cracks" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

