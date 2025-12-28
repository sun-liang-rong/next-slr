"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LoadingSpinner, LoadingDots } from "@/components/ui/loading"
import { Tag as TagType } from "@/types/article"

export default function TagsPage() {
  const [tags, setTags] = useState<TagType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const getTags = async (search?: string): Promise<TagType[]> => {
    try {
      let url = '/api/tags'
      const params = new URLSearchParams()
      if (search) {
        params.set('search', search)
      }
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('获取标签列表失败')
      }
      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("获取标签数据失败:", error)
      return []
    }
  }

  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    setSearchLoading(true)
    try {
      const result = await getTags(term)
      setTags(result)
    } catch (error) {
      console.error("搜索标签失败:", error)
    } finally {
      setSearchLoading(false)
    }
  }

  const deleteTag = async (id: string) => {
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('删除标签失败')
      }
      setTags(tags.filter(tag => tag.id !== id))
    } catch (error) {
      console.error("删除标签失败:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsData = await getTags()
        setTags(tagsData)
      } catch (error) {
        console.error("获取数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      {/* 顶部导航栏 */}
      <header className="flex h-16 items-center border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">标签管理</h1>
        </div>
      </header>

      {/* 内容区域 */}
      <main className="flex-1 overflow-auto p-6">
        {/* 操作栏 */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索标签..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchLoading && (
              <div className="absolute right-2.5 top-2.5">
                <LoadingDots />
              </div>
            )}
          </div>
          <Link href="/admin/home/tags/new">
            <Button>
              <Plus className="mr-2 size-4" />
              新建标签
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>标签列表</CardTitle>
          </CardHeader>
          <CardContent>
            {(loading || searchLoading) ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : tags.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="text-4xl text-muted-foreground mb-4">🏷️</div>
                <h3 className="text-lg font-medium mb-1">暂无标签</h3>
                <p className="text-sm text-muted-foreground mb-6">还没有任何标签，点击下方按钮创建第一个标签</p>
                <Link href="/admin/home/tags/new">
                  <Button variant="default" size="sm">
                    新建标签
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>标签名称</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>更新时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>{tag.name}</TableCell>
                      <TableCell>{new Date(tag.created_at).toLocaleString()}</TableCell>
                      <TableCell>{new Date(tag.updated_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/admin/home/tags/${tag.id}/edit`}>
                                <Button variant="outline" size="icon">
                                  <Edit className="size-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>编辑标签</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="icon"
                                onClick={() => deleteTag(tag.id)}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>删除标签</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}