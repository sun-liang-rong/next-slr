"use client"

import { ArticleForm } from "../components/article-form"

export default function CreateArticlePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">新建文章</h1>
        <p className="text-muted-foreground">
          创建一个新的文章内容
        </p>
      </div>
      <div className="border rounded-md p-6 bg-card">
        <ArticleForm />
      </div>
    </div>
  )
}
