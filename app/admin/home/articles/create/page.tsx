"use client"

import AdminLayout from "@/components/admin-layout"
import { ArticleForm } from "../components/article-form"

export default function CreateArticlePage() {
  return (
    <AdminLayout title="新建文章" description="创建一个新的文章内容">
      <ArticleForm />
    </AdminLayout>
  )
}
