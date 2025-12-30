"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Plus, Search, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Article } from "@/types/article"

interface PaginationData {
  page: number
  limit: number
  total: number
  pages: number
}

interface ArticlesResponse {
  data: Article[]
  pagination: PaginationData
}

export default function ArticlesPage() {
  const router = useRouter()
  const pathname = usePathname()

  const [articles, setArticles] = useState<Article[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  })
  const [loading, setLoading] = useState(true)
  
  // Local state for filters to avoid url updates on every keystroke
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Initialize state from URL on component mount and when URL changes
  useEffect(() => {
    const updateStateFromUrl = () => {
      const url = new URL(window.location.href)
      const page = url.searchParams.get("page") || "1"
      const search = url.searchParams.get("search") || ""
      const status = url.searchParams.get("status") || "all"
      
      setCurrentPage(parseInt(page, 10))
      setSearchQuery(search)
      setStatusFilter(status)
    }
    
    // Initial update
    updateStateFromUrl()
    
    // Listen for URL changes (back/forward navigation)
    window.addEventListener('popstate', updateStateFromUrl)
    window.addEventListener('hashchange', updateStateFromUrl)
    
    return () => {
      window.removeEventListener('popstate', updateStateFromUrl)
      window.removeEventListener('hashchange', updateStateFromUrl)
    }
  }, [])

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      params.set("page", currentPage.toString())
      params.set("limit", "10")
      if (searchQuery) params.set("search", searchQuery)
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter)

      const response = await fetch(`/api/articles?${params.toString()}`)
      if (!response.ok) throw new Error("获取文章列表失败")
      
      const data: ArticlesResponse = await response.json()
      setArticles(data.data)
      setPagination(data.pagination)
    } catch (error) {
      console.error(error)
      toast.error("获取文章列表失败")
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, statusFilter])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const updateFilters = () => {
    const params = new URLSearchParams()
    params.set("page", "1") // Reset to page 1 on filter change
    if (searchQuery) {
      params.set("search", searchQuery)
    }
    
    if (statusFilter && statusFilter !== "all") {
      params.set("status", statusFilter)
    }
    
    router.push(`${pathname}?${params.toString()}`)
    setCurrentPage(1) // Update local state immediately for UI feedback
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams()
    params.set("page", newPage.toString())
    if (searchQuery) {
      params.set("search", searchQuery)
    }
    
    if (statusFilter && statusFilter !== "all") {
      params.set("status", statusFilter)
    }
    
    router.push(`${pathname}?${params.toString()}`)
    setCurrentPage(newPage) // Update local state immediately for UI feedback
  }

  const handleDelete = async (article: Article) => {
    if (!confirm(`确定要删除文章 "${article.title}" 吗？此操作无法撤销。`)) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("删除失败")
      }

      toast.success("文章删除成功")
      fetchArticles()
    } catch (error) {
      console.error(error)
      toast.error("删除失败")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">已发布</Badge>
      case "draft":
        return <Badge variant="secondary">草稿</Badge>
      case "archived":
        return <Badge variant="outline">已归档</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">文章管理</h1>
        <Link href="/admin/home/articles/create">
          <Button>
            <Plus className="mr-2 w-4 h-4" />
            新建文章
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索文章标题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            onKeyDown={(e) => e.key === "Enter" && updateFilters()}
          />
        </div>
        <Select 
          value={statusFilter} 
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有状态</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="archived">已归档</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" onClick={updateFilters}>
          筛选
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">标题</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>标签</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="mr-2 w-6 h-6 animate-spin" />
                    加载中...
                  </div>
                </TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  暂无文章数据
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[300px]" title={article.title}>
                      {article.title}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(article.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {article.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                      {article.tags && article.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{article.tags.length - 3}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(article.created_at).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/home/articles/${article.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="编辑"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(article)}
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
        <div className="flex justify-end items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
            上一页
          </Button>
          <div className="text-sm text-muted-foreground">
            第 {pagination.page} 页 / 共 {pagination.pages} 页
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
          >
            下一页
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
