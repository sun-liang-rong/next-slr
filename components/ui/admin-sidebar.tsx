"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  Menu, 
  X,
  Tag,
  LogOut
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenuItem, 
  SidebarFooter
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ThemeChange"

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { name: "仪表盘", href: "/admin/home", icon: <BarChart3 className="size-4" /> },
    { name: "文章管理", href: "/admin/home/articles", icon: <FileText className="size-4" /> },
    { name: "标签管理", href: "/admin/home/tags", icon: <Tag className="size-4" /> },
  ]

  // 退出登录处理函数
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        // 重定向到登录页
        router.push('/admin/login')
      } else {
        console.error('退出登录失败')
      }
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // 移动端侧边栏按钮
  const MobileSidebarButton = () => (
    <div className={`md:hidden absolute top-4 left-4 z-50 ${sidebarOpen ? 'hidden' : 'block'}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="size-4" />
      </Button>
    </div>
  )

  return (
    <>
      <MobileSidebarButton />
      
      <Sidebar className={`${sidebarOpen ? 'absolute md:relative z-40' : 'hidden md:block'} relative`}>
        <SidebarHeader>
          <div className="flex items-center justify-between px-3 py-4 text-lg font-semibold">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-6" />
              <span>管理后台</span>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <SidebarMenuItem 
                isActive={pathname === item.href}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.name}
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarContent>
        {/* 绝对定位固定在底部 */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              handleLogout()
              setSidebarOpen(false)
            }}
            disabled={isLoggingOut}
          >
            <LogOut className="size-4 mr-2" />
            {isLoggingOut ? '退出中...' : '退出登录'}
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-2 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="size-4" />
        </Button>
      </Sidebar>
    </>
  )
}