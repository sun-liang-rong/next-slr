"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MarkdownEditor } from "./markdown-editor";
import { Article, Tag } from "@/types/article";

const articleSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(255, "标题不能超过255个字符"),
  status: z.enum(["draft", "published"]),
  content: z.string().min(1, "内容不能为空"),
  tagNames: z.array(z.string()).min(1, "至少选择一个标签"),
});

interface ArticleFormProps {
  article?: Article;
  isEditing?: boolean;
}

export function ArticleForm({ article, isEditing = false }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);

  // ⭐ 用于“添加标签”的 Select 临时值
  const [tagSelectValue, setTagSelectValue] = useState("");

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      status: "draft",
      content: "",
      tagNames: [],
    },
  });

  /** 初始化 */
  useEffect(() => {
    fetchTags();

    if (article) {
      form.reset({
        title: article.title,
        status: article.status as "draft" | "published",
        content: article.content,
        tagNames: article.tags?.map((t) => t.name) || [],
      });
    }
  }, [article]);

  /** 获取标签 */
  const fetchTags = async () => {
    try {
      setLoadingTags(true);
      const res = await fetch("/api/tags");
      if (res.ok) {
        const data = await res.json();
        setAvailableTags(data.data);
      }
    } catch (err) {
      console.error("获取标签失败", err);
    } finally {
      setLoadingTags(false);
    }
  };

  /** 提交表单 */
  const onSubmit = async (values: z.infer<typeof articleSchema>) => {
    setIsSubmitting(true);
    try {
      const url =
        isEditing && article ? `/api/articles/${article.id}` : "/api/articles";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "操作失败");
      }

      toast.success(isEditing ? "文章更新成功" : "文章创建成功");
      router.push("/admin/home/articles");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "操作失败");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** 添加标签 */
  const handleAddTag = (tagName: string) => {
    const currentTags = form.getValues("tagNames");
    if (!currentTags.includes(tagName)) {
      form.setValue("tagNames", [...currentTags, tagName]);
    }
  };

  /** 移除标签 */
  const handleRemoveTag = (tagName: string) => {
    console.log("Remove tag:", tagName);
    const currentTags = form.getValues("tagNames");
    form.setValue(
      "tagNames",
      currentTags.filter((t) => t !== tagName)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        {/* 标题 */}
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 状态 */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  key={field.value}
                >
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

          {/* 标签 */}
          <FormField
            control={form.control}
            name="tagNames"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标签</FormLabel>
                <div className="space-y-2">
                  {/* 已选标签 */}
                  <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-background">
                    {field.value.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        未选择标签
                      </span>
                    )}
                    {field.value.map((tagName) => (
                      <Badge
                        key={tagName}
                        variant="secondary"
                        className="gap-1"
                      >
                        {tagName}

                        <button
                          type="button"
                          className="ml-1 rounded-sm hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation(); // ⭐ 关键
                            handleRemoveTag(tagName);
                          }}
                        >
                          <X className="w-3 h-3 cursor-pointer hover:text-destructive" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {/* 添加标签 */}
                  <Select
                    value={tagSelectValue}
                    onValueChange={(value) => {
                      handleAddTag(value);
                      setTagSelectValue(""); // ⭐ 关键：选完清空
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="添加标签" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTags.map((tag) => (
                        <SelectItem
                          key={tag.id}
                          value={tag.name}
                          disabled={field.value.includes(tag.name)}
                        >
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

        {/* 内容 */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>文章内容</FormLabel>
              <FormControl>
                <MarkdownEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="请输入文章内容..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 操作按钮 */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
            {isEditing ? "保存修改" : "创建文章"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
