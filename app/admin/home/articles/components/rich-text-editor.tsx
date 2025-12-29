"use client"

import { Editor } from "@tinymce/tinymce-react"
import React from "react"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="rounded-md overflow-hidden border border-border-purple">
      <Editor
        value={value}
        init={{
          height: 500,
          menubar: false,
          branding: false,
          placeholder: placeholder || "请输入内容...",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic underline forecolor | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | removeformat | code preview",
          content_style:
            "body { font-family: Inter, Arial, sans-serif; font-size:14px }",
          language: 'zh_CN',
        }}
        apiKey={process.env.NEXT_PUBLIC_INYMCE_API_KEY}
        onEditorChange={(content) => onChange(content)}
      />
    </div>
  )
}
