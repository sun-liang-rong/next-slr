"use client"

import { useState, useEffect } from "react"
import { BarChart3, FileText, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import StatCard from "@/components/StatCard"

import { Article } from '@/types/article';

export default function AdminDashboard() {
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [articleCount, setArticleCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

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
      return [];
    }
  };

  const getArticleCount = async (): Promise<number> => {
    try {
      const response = await fetch('/api/articles/count');
      if (!response.ok) {
        throw new Error('获取文章数量失败');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("获取文章数量失败:", error);
      return 0;
    }
  };

  // 统计数据
  const stats = [
    { title: "总文章数", value: articleCount.toString(), description: "+3 新增本周", icon: <FileText className="size-4 text-muted-foreground" /> },
    { title: "总用户数", value: "128", description: "+12 新增本周", icon: <Users className="size-4 text-muted-foreground" /> },
    { title: "总访问量", value: "1,234", description: "+18% 与上周相比", icon: <BarChart3 className="size-4 text-muted-foreground" /> },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, countData] = await Promise.all([
          getArticles(),
          getArticleCount()
        ])
        
        const sortedArticles = [...articlesData].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 4)
        
        setRecentArticles(sortedArticles)
        setArticleCount(countData)
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
      {/* 主内容区域 */}
      <div className="flex flex-1 flex-col">
        {/* 顶部导航栏 */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">仪表盘</h1>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">欢迎回来</h2>
            <p className="text-muted-foreground">这是您的管理仪表盘</p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            {stats.map((stat, index) => (
              <StatCard 
                key={index}
                title={stat.title}
                value={stat.value}
                description={stat.description}
                icon={stat.icon}
              />
            ))}
          </div>

          {/* 最近文章列表 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>最近文章</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p>加载中...</p>
                ) : (
                  <ul className="space-y-2">
                    {recentArticles.map((article) => (
                      <li key={article.id} className="flex justify-between">
                        <span>{article.title}</span>
                        <span className="text-muted-foreground">{new Date(article.created_at).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* 最近活动 */}
            <Card>
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500/10 p-1">
                      <FileText className="size-3 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm">张三创建了新文章</p>
                      <p className="text-xs text-muted-foreground">2分钟前</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1">
                      <Users className="size-3 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm">李四注册了新账户</p>
                      <p className="text-xs text-muted-foreground">1小时前</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-yellow-500/10 p-1">
                      <Settings className="size-3 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm">系统更新完成</p>
                      <p className="text-xs text-muted-foreground">3小时前</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* 快捷操作 */}
            <Card>
              <CardHeader>
                <CardTitle>快捷操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">创建新文章</Button>
                  <Button variant="outline">添加用户</Button>
                  <Button variant="outline">系统设置</Button>
                  <Button variant="outline">查看报告</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}