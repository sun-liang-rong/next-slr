"use client"

import { useEffect, useState, use } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { ArticleForm } from "../components/article-form"
import { Article } from "@/types/article"

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${id}`)
        if (!response.ok) {
          throw new Error("获取文章详情失败")
        }
        const data = await response.json()
        setArticle(data.data)
      } catch (error) {
        console.error("获取文章详情失败:", error)
        toast.error("获取文章详情失败")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <h2 className="text-xl font-semibold">未找到文章</h2>
        <p className="text-muted-foreground">该文章可能已被删除</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-none">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">编辑文章</h1>
        <p className="text-muted-foreground">
          编辑文章内容和属性
        </p>
      </div>
      <div className="p-6 w-full rounded-md border bg-card">
        <ArticleForm article={article} isEditing={true} />
      </div>
    </div>
  )
}
