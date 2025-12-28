"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

export default function TagNewPage() {
  const router = useRouter()
  const [tagName, setTagName] = useState("")
  const [error, setError] = useState("")

  const saveTag = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!tagName.trim()) {
      setError("标签名称不能为空")
      return
    }

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: tagName.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '创建标签失败')
      }

      router.push("/admin/home/tags")
    } catch (error: any) {
      setError(error.message || "创建标签失败")
    }
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
        <h1 className="text-xl font-semibold">新建标签</h1>
      </header>

      {/* 内容区域 */}
      <main className="flex-1 overflow-auto p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>新建标签</CardTitle>
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
                  创建标签
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}