"use client"

import React from 'react'
import { Editor as BytemdEditor } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/github.css'

interface MarkdownEditorProps {
  value: string
  onChange: (markdown: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  // 插件配置
  const plugins = [gfm(), highlight()]

  return (
    <div className="overflow-hidden rounded-md border">
      <BytemdEditor
        value={value}
        onChange={onChange}
        plugins={plugins}
        placeholder={placeholder || '请输入Markdown内容...'}
        mode="split"
      />
    </div>
  )
}
