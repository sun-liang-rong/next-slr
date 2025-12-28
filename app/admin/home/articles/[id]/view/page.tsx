"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function ArticleViewPage() {
  const params = useParams<{ id: string }>()
  const { id } = params
  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState({
    title: "",
    status: "",
    content: "",
    created_at: "",
    tags: []
  })

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/articles/${id}`)
        if (!response.ok) {
          throw new Error('获取文章失败')
        }
        const result = await response.json()
        setArticle(result.data)
      } catch (error) {
        console.error("加载文章失败:", error)
        toast.error("加载文章失败")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/home/articles">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold">查看文章</h1>
          </div>
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 主容器 */}
      <div className="container mx-auto px-4 py-8">
        {/* 导航栏 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/home/articles">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold">文章详情</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/admin/home/articles/${id}`}>
              <Button variant="outline" size="sm">
                编辑文章
              </Button>
            </Link>
            <Link href="/admin/home/articles">
              <Button variant="ghost" size="sm">
                返回列表
              </Button>
            </Link>
          </div>
        </div>

        {/* 文章内容 */}
        <article className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
          {/* 文章头部 */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-3xl font-bold tracking-tight mb-4">{article.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>发布于 {new Date(article.created_at).toLocaleDateString()}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${article.status === '已发布' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                {article.status}
              </span>
            </div>
          </div>

          {/* 文章标签 */}
          {article.tags && article.tags.length > 0 && (
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: { id: string; name: string }) => (
                  <span key={tag.id} className="px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-medium">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 文章正文 */}
          <div className="p-8 prose prose-sm sm:prose-base lg:prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: article.content || '' }} />
          </div>
        </article>
      </div>
    </div>
  )
}