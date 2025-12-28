"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LoadingSpinner, LoadingDots } from "@/components/ui/loading"
import { toast } from "sonner"

import { Article } from '@/types/article';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)

  const getArticles = async (): Promise<Article[]> => {
    try {
      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('获取文章列表失败');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("获取文章数据失败:", error);
      toast.error("获取文章数据失败");
      return [];
    }
  };

  const deleteArticle = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除文章失败');
      }
      
      return true;
    } catch (error) {
      console.error("删除文章时出错:", error);
      return false;
    }
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setSearchLoading(true);
    try {
      let url = '/api/articles';
      const params = new URLSearchParams();
      if (term) {
        params.set('search', term);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('搜索文章失败');
      }
      const result = await response.json();
      
      setArticles(result.data);
    } catch (error) {
      console.error("搜索文章失败:", error);
      toast.error("搜索文章失败");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return
    
    try {
      const success = await deleteArticle(articleToDelete)
      if (success) {
        setArticles(articles.filter(article => article.id !== articleToDelete))
        toast.success("文章删除成功")
      } else {
        toast.error("删除文章失败")
      }
    } catch (error) {
      console.error("删除文章时出错:", error)
      toast.error("删除文章失败")
    } finally {
      setDeleteDialogOpen(false)
      setArticleToDelete(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setArticleToDelete(id)
    setDeleteDialogOpen(true)
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles()
        setArticles(data);
      } catch (error) {
        console.error("获取文章数据失败:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      {/* 主内容区域 */}
      <div className="flex flex-1 flex-col">
        {/* 顶部导航栏 */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">文章管理</h1>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">文章管理</h2>
            <p className="text-muted-foreground">管理您的所有文章</p>
          </div>

          {/* 操作栏 */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索文章..."
                className="pl-8"
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchLoading && (
                <div className="absolute right-2.5 top-2.5">
                  <LoadingDots />
                </div>
              )}
            </div>
            <Link href="/admin/home/articles/new">
              <Button>
                <Plus className="mr-2 size-4" />
                新建文章
              </Button>
            </Link>
          </div>

          {/* 文章列表 */}
          <Card>
            <CardHeader>
              <CardTitle>文章列表</CardTitle>
            </CardHeader>
            <CardContent>
              {(loading || searchLoading) ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : articles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-4xl text-muted-foreground mb-4">📄</div>
                  <h3 className="text-lg font-medium mb-1">暂无文章</h3>
                  <p className="text-sm text-muted-foreground mb-6">还没有任何文章，点击下方按钮创建第一篇文章</p>
                  <Link href="/admin/home/articles/new">
                    <Button variant="default" size="sm">
                      新建文章
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="h-10 px-4 text-left">标题</th>
                        <th className="h-10 px-4 text-left">日期</th>
                        <th className="h-10 px-4 text-left">状态</th>
                        <th className="h-10 px-4 text-left">标签</th>
                        <th className="h-10 px-4 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {articles.map((article) => (
                        <tr key={article.id} className="h-16">
                          <td className="px-4">
                            <Link href={`/admin/home/articles/${article.id}`} className="font-medium hover:underline">
                              {article.title}
                            </Link>
                          </td>
                          <td className="px-4">
                            {article.created_at ? new Date(article.created_at).toLocaleDateString() : 
                             new Date().toLocaleDateString()}
                          </td>
                          <td className="px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              article.status === "published" || article.status === "已发布"
                                ? "bg-green-100 text-green-800" 
                                : article.status === "draft" || article.status === "草稿"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {article.status === "published" ? "已发布" : 
                               article.status === "draft" ? "草稿" : article.status}
                            </span>
                          </td>
                          <td className="px-4">
                            <div className="flex flex-wrap gap-2">
                              {article.tags?.map((tag) => (
                                <span key={tag.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {tag.name}
                                </span>
                              )) || <span className="text-muted-foreground text-xs">无标签</span>}
                            </div>
                          </td>
                          <td className="px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link href={`/admin/home/articles/${article.id}/view`}>
                                    <Button variant="outline" size="icon">
                                      <Eye className="size-4" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>查看文章</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link href={`/admin/home/articles/${article.id}`}>
                                    <Button variant="outline" size="icon">
                                      <Edit className="size-4" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>编辑文章</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="destructive" 
                                    size="icon"
                                    onClick={() => openDeleteDialog(article.id)}
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>删除文章</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>确认删除</DialogTitle>
                <DialogDescription>
                  确定要删除这篇文章吗？此操作无法撤销。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  取消
                </Button>
                <Button variant="destructive" onClick={handleDeleteArticle}>
                  删除
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}