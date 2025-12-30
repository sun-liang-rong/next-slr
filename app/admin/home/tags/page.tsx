"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tag } from "@/types/article"
import { TagDialog } from "./components/tag-dialog"

interface TagWithCount extends Tag {
  _count?: {
    articles: number
  }
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const fetchTags = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/tags")
      if (!response.ok) throw new Error("获取标签列表失败")
      const data = await response.json()
      setTags(data.data)
    } catch (error) {
      toast.error("获取标签列表失败")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    setEditingTag(null)
    setDialogOpen(true)
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setDialogOpen(true)
  }

  const handleDelete = async (tag: TagWithCount) => {
    if (tag._count?.articles && tag._count.articles > 0) {
      toast.error(`无法删除标签 "${tag.name}"，因为它已被 ${tag._count.articles} 篇文章使用`)
      return
    }

    if (!confirm(`确定要删除标签 "${tag.name}" 吗？此操作无法撤销。`)) {
      return
    }

    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "删除失败")
      }

      toast.success("标签删除成功")
      fetchTags()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("删除失败")
      }
    }
  }

  return (
    <AdminLayout title="标签管理" description="管理文章标签">
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleCreate} className="ml-4">
          <Plus className="mr-2 h-4 w-4" />
          新建标签
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标签名称</TableHead>
              <TableHead>关联文章数</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    加载中...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  暂无标签数据
                </TableCell>
              </TableRow>
            ) : (
              filteredTags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell>{tag._count?.articles || 0}</TableCell>
                  <TableCell>
                    {new Date(tag.created_at).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tag)}
                        title="编辑"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(tag)}
                        title="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TagDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tag={editingTag}
        onSuccess={fetchTags}
      />
    </AdminLayout>
  )
}
