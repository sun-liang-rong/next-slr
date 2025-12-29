"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "./rich-text-editor"
import { Article, Tag } from "@/types/article"

const articleSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(255, "标题不能超过255个字符"),
  status: z.enum(["draft", "published"]),
  content: z.string().min(1, "内容不能为空"),
  tagNames: z.array(z.string()).min(1, "至少选择一个标签"),
})

interface ArticleFormProps {
  article?: Article
  isEditing?: boolean
}

export function ArticleForm({ article, isEditing = false }: ArticleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [loadingTags, setLoadingTags] = useState(false)

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      status: "draft",
      content: "",
      tagNames: [],
    },
  })

  useEffect(() => {
    fetchTags()
    if (article) {
      form.reset({
        title: article.title,
        status: article.status as "draft" | "published",
        content: article.content,
        tagNames: article.tags?.map((t) => t.name) || [],
      })
    }
  }, [article, form])

  const fetchTags = async () => {
    try {
      setLoadingTags(true)
      const response = await fetch("/api/tags")
      if (response.ok) {
        const data = await response.json()
        setAvailableTags(data.data)
      }
    } catch (error) {
      console.error("获取标签失败", error)
    } finally {
      setLoadingTags(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof articleSchema>) => {
    setIsSubmitting(true)
    try {
      const url = isEditing && article ? `/api/articles/${article.id}` : "/api/articles"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "操作失败")
      }

      toast.success(isEditing ? "文章更新成功" : "文章创建成功")
      router.push("/admin/home/articles")
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("操作失败，请重试")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = (tagName: string) => {
    const currentTags = form.getValues("tagNames")
    if (!currentTags.includes(tagName)) {
      form.setValue("tagNames", [...currentTags, tagName])
    }
  }

  const handleRemoveTag = (tagName: string) => {
    const currentTags = form.getValues("tagNames")
    form.setValue(
      "tagNames",
      currentTags.filter((t) => t !== tagName)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>文章标题</FormLabel>
              <FormControl>
                <Input placeholder="请输入文章标题" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagNames"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标签</FormLabel>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-background">
                    {field.value.length === 0 && (
                      <span className="text-muted-foreground text-sm flex items-center">未选择标签</span>
                    )}
                    {field.value.map((tagName) => (
                      <Badge key={tagName} variant="secondary" className="gap-1">
                        {tagName}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => handleRemoveTag(tagName)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={handleAddTag}>
                    <SelectTrigger>
                      <SelectValue placeholder="添加标签" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags.map((tag) => (
                        <SelectItem key={tag.id} value={tag.name} disabled={field.value.includes(tag.name)}>
                          {tag.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>文章内容</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="请输入文章内容..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "保存修改" : "创建文章"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
