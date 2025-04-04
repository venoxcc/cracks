"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Copy, Code, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { MonacoEditor } from "@/components/monaco-editor"

export default function SourcePage() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch(`/sources/raw/${slug}.lua`)
        if (response.ok) {
          // Handle UTF-16LE encoding
          const arrayBuffer = await response.arrayBuffer()
          const decoder = new TextDecoder("utf-16le")
          const text = decoder.decode(arrayBuffer)
          setContent(text)
        } else {
          console.error("Failed to fetch file content")
        }
      } catch (error) {
        console.error("Error fetching file content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [slug])

  const loadstringCode = `loadstring(game:HttpGet("${window.location.origin}/sources/raw/${slug}.lua"))()`

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `${type} has been copied to your clipboard.`,
      })
    })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="outline" size="icon">
          <Link href="/sources">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight truncate">{slug}.lua</h1>
        <Badge variant="secondary">Source</Badge>
      </div>

      <Tabs defaultValue="code" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="code" className="flex items-center gap-1 flex-1 sm:flex-initial">
            <Code className="h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="loadstring" className="flex items-center gap-1 flex-1 sm:flex-initial">
            <Eye className="h-4 w-4" />
            Loadstring
          </TabsTrigger>
        </TabsList>
        <TabsContent value="code" className="mt-4">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-medium">Script Code</h3>
                <p className="text-sm text-muted-foreground">View the raw Lua code for this source</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => copyToClipboard(content, "Code")}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="relative">
              <MonacoEditor value={content} language="lua" loading={loading} height="60vh" />
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="loadstring" className="mt-4">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-medium">Loadstring</h3>
                <p className="text-sm text-muted-foreground">Copy the loadstring to use this script</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => copyToClipboard(loadstringCode, "Loadstring")}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
            <div className="relative">
              <MonacoEditor value={loadstringCode} language="lua" height="150px" />
            </div>
          </Card>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>This loadstring will automatically fetch and execute the script from our server.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

