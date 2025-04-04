"use client"

import { useEffect, useRef } from "react"
import * as monaco from "monaco-editor"
import { Skeleton } from "@/components/ui/skeleton"

interface MonacoEditorProps {
  value: string
  language?: string
  readOnly?: boolean
  height?: string
  loading?: boolean
}

export function MonacoEditor({
  value,
  language = "lua",
  readOnly = true,
  height = "60vh",
  loading = false,
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  useEffect(() => {
    if (loading || !editorRef.current) return

    // Initialize Monaco editor
    monacoInstanceRef.current = monaco.editor.create(editorRef.current, {
      value,
      language,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      readOnly,
      fontSize: 14,
      scrollbar: {
        alwaysConsumeMouseWheel: false,
      },
      lineNumbers: "on",
    })

    // Cleanup on unmount
    return () => {
      if (monacoInstanceRef.current) {
        monacoInstanceRef.current.dispose()
      }
    }
  }, [value, language, readOnly, loading])

  // Update editor content when value changes
  useEffect(() => {
    if (monacoInstanceRef.current && !loading) {
      if (monacoInstanceRef.current.getValue() !== value) {
        monacoInstanceRef.current.setValue(value)
      }
    }
  }, [value, loading])

  if (loading) {
    return <Skeleton className="h-[60vh] w-full" />
  }

  return <div ref={editorRef} style={{ height, width: "100%" }} />
}

