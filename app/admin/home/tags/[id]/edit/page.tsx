"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tag as TagType } from "@/types/article"

export default function TagEditPage() {
  const params = useParams()
  const router = useRouter()
  const tagId = params.id as string
  const isEditMode = tagId !== "new"

  const [tagName, setTagName] = useState("")
  const [loading, setLoading] = useState(isEditMode)
  const [error, setError] = useState("")

  const getTag = async (id: string): Promise<TagType | null> => {
    try {
      const response = await fetch(`/api/tags/${id}`)
      if (!response.ok) {
        throw new Error('获取标签详情失败')
      }
      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("获取标签数据失败:", error)
      return null
    }
  }

  const saveTag = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!tagName.trim()) {
      setError("标签名称不能为空")
      return
    }

    try {
      const url = isEditMode ? `/api/tags/${tagId}` : "/api/tags"
      const method = isEditMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tagName.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '保存标签失败')
      }

      router.push("/admin/home/tags")
    } catch (error: any) {
      setError(error.message || "保存标签失败")
    }
  }

  useEffect(() => {
    if (isEditMode) {
      const fetchTag = async () => {
        try {
          const tag = await getTag(tagId)
          if (tag) {
            setTagName(tag.name)
          }
        } catch (error) {
          console.error("获取标签详情失败:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchTag()
    }
  }, [isEditMode, tagId])

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* 顶部导航栏 */}
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEditMode ? "编辑标签" : "新建标签"}
        </h1>
      </header>

      {/* 内容区域 */}
      <main className="flex-1 overflow-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{isEditMode ? "编辑标签" : "新建标签"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveTag} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="tag-name">标签名称</Label>
                <Input
                  id="tag-name"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="请输入标签名称"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => router.back()}>
                  取消
                </Button>
                <Button type="submit">
                  {isEditMode ? "保存修改" : "创建标签"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}