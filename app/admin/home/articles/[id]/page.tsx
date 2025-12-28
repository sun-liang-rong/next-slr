"use client"

import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extension-placeholder"
// 使用类型断言解决html-to-markdown的类型问题
const htmlToMarkdown = require('html-to-markdown');
import Link from "next/link"
import { 
  Save,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Code2,
  Quote
} from "lucide-react"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type Props = {
  params: {
    id: string
  }
}

export default function ArticleEditorPage() {
const params = useParams<{ id: string }>();
const { id } = params
  console.log(id, 'id')
  const isNew = id === 'new' // 如果id是'new'，则为新建模式
  const isEditing = id && !isNew // 如果id是数字且不是'new'，则为编辑模式
  const articleId = id
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState("草稿")
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<{ id: string; name: string }[]>([])
  const [newTagName, setNewTagName] = useState("")

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '在这里输入文章内容...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
  })

  // 获取所有标签
  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (!response.ok) {
        throw new Error('获取标签失败')
      }
      const result = await response.json()
      setAllTags(result.data || [])
    } catch (error) {
      console.error("获取标签失败:", error)
      toast.error("获取标签失败")
    }
  }

  // 添加新标签
  const addNewTag = async () => {
    if (!newTagName.trim()) return
    
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName.trim() })
      })
      
      if (!response.ok) {
        throw new Error('创建标签失败')
      }
      
      const result = await response.json()
      setAllTags([...allTags, { id: result.id, name: result.name }])
      setTags([...tags, result.name])
      setNewTagName('')
      toast.success("标签创建成功")
    } catch (error) {
      console.error("创建标签失败:", error)
      toast.error("创建标签失败")
    }
  }

  // 切换标签选择
  const toggleTag = (tagName: string) => {
    if (tags.includes(tagName)) {
      setTags(tags.filter(t => t !== tagName))
    } else {
      setTags([...tags, tagName])
    }
  }

  // 在组件加载时获取所有标签
  useEffect(() => {
    fetchTags()
  }, [])

  // 存储文章内容，用于编辑器初始化后设置
  const [articleContent, setArticleContent] = useState<string>('')

  // 在编辑模式下加载文章数据
  useEffect(() => {
    // 只有当id存在且不是'new'时才加载文章
    if (id && id !== 'new') {
      const fetchArticle = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/articles/${id}`)
          if (!response.ok) {
            throw new Error('获取文章失败')
          }
          const result = await response.json()
          console.log(result, 'result')
          const article = result.data
          if (article) {
            setTitle(article.title || "")
            setStatus(article.status || "草稿")
            
            // 设置标签
            if (article.tags) {
              setTags(article.tags.map((tag: { name: string }) => tag.name))
            }
            
            // 存储文章内容，用于编辑器初始化后设置
            setArticleContent(article.content || '')
          }
        } catch (error) {
          console.error("加载文章失败:", error)
          toast.error("加载文章失败")
        } finally {
          setLoading(false)
        }
      }
      fetchArticle()
    }
  }, [id])

  // 当编辑器初始化完成后，设置文章内容
  useEffect(() => {
    if (editor && articleContent) {
      console.log(articleContent, 'article.content')
      editor.commands.setContent(articleContent)
    }
  }, [editor, articleContent])

  const handleSaveDraft = async () => {
    if (!editor) {
      toast.error("编辑器初始化失败")
      return
    }

    if (!title.trim()) {
      toast.error("请输入文章标题")
      return
    }

    try {
      // 将HTML转换为Markdown格式
      const markdownContent = htmlToMarkdown.convert(editor.getHTML());
      
      if (isEditing && articleId) {
        // 编辑模式下更新文章
        const articleData = {
          title,
          status: "草稿", // 强制设置为草稿状态
          content: markdownContent, // 保存Markdown格式内容
          tagNames: tags, // 保存标签
        }

        const response = await fetch(`/api/articles/${articleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        })
        if (!response.ok) throw new Error('更新失败')
        toast.success("草稿更新成功")
      } else {
        // 新建模式下创建文章
        const articleData = {
          title,
          status: "草稿", // 强制设置为草稿状态
          content: markdownContent, // 保存Markdown格式内容
          tagNames: tags, // 保存标签
        }

        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        })
        if (!response.ok) throw new Error('创建失败')
        toast.success("草稿保存成功")
      }
      
      // 重定向到文章列表页面
      window.location.href = "/admin/home/articles"
    } catch (error) {
      console.error("保存草稿失败:", error)
      toast.error("保存草稿失败")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editor) {
      toast.error("编辑器初始化失败")
      return
    }

    if (!title.trim()) {
      toast.error("请输入文章标题")
      return
    }

    if (!editor.getText().trim()) {
      toast.error("请输入文章内容")
      return
    }

    try {
      // 将HTML转换为Markdown格式
      const markdownContent = htmlToMarkdown.convert(editor.getHTML());
      
      if (isEditing && articleId) {
        // 编辑模式下更新文章
        const articleData = {
          title,
          status,
          content: markdownContent, // 保存Markdown格式内容
          tagNames: tags, // 保存标签
        }

        const response = await fetch(`/api/articles/${articleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        })
        if (!response.ok) throw new Error('更新失败')
        toast.success("文章更新成功")
      } else {
        // 新建模式下创建文章
        const articleData = {
          title,
          status,
          content: markdownContent, // 保存Markdown格式内容
          tagNames: tags, // 保存标签
        }

        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        })
        if (!response.ok) throw new Error('创建失败')
        toast.success("文章创建成功")
      }
      
      // 重定向到文章列表页面
      window.location.href = "/admin/home/articles"
    } catch (error) {
      console.error("操作失败:", error)
      toast.error("操作失败")
    }
  }

  return (
    <div className="flex flex-1 flex-col">
        {/* 顶部导航栏 */}
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{isEditing ? '编辑文章' : '新建文章'}</h1>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <Link href="/admin/home/articles">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              <h2 className="text-2xl font-bold tracking-tight">{isEditing ? '编辑文章' : '新建文章'}</h2>
            </div>
            <p className="text-muted-foreground">{isEditing ? '编辑现有文章内容' : '创建新的文章内容'}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* 文章标题 */}
              <Card>
                <CardHeader>
                  <CardTitle>文章标题</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="请输入文章标题"
                    className="text-lg"
                  />
                </CardContent>
              </Card>

              {/* 状态选择 */}
              <Card>
                <CardHeader>
                  <CardTitle>文章状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="选择文章状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="草稿">草稿</SelectItem>
                      <SelectItem value="已发布">已发布</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* 标签选择 */}
              <Card>
                <CardHeader>
                  <CardTitle>文章标签</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* 现有标签选择 */}
                    <div>
                      <Label className="mb-2 block">选择现有标签</Label>
                      <div className="flex flex-wrap gap-2">
                        {allTags.length > 0 ? (
                          allTags.map((tag) => (
                            <label
                              key={tag.id}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-all ${
                                tags.includes(tag.name)
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={tags.includes(tag.name)}
                                onChange={() => toggleTag(tag.name)}
                                className="sr-only"
                              />
                              {tag.name}
                            </label>
                          ))
                        ) : (
                          <p className="text-muted-foreground text-sm">暂无标签，请先创建标签</p>
                        )}
                      </div>
                    </div>

                    {/* 添加新标签 */}
                    <div>
                      <Label className="mb-2 block">添加新标签</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                          placeholder="输入新标签名称"
                          onKeyDown={(e) => e.key === 'Enter' && addNewTag()}
                        />
                        <Button type="button" onClick={addNewTag}>
                          添加标签
                        </Button>
                      </div>
                    </div>

                    {/* 已选择标签预览 */}
                    {tags.length > 0 && (
                      <div>
                        <Label className="mb-2 block">已选择标签</Label>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tagName) => (
                            <span
                              key={tagName}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {tagName}
                              <button
                                type="button"
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => toggleTag(tagName)}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 文章内容 */}
              <Card>
                <CardHeader>
                  <CardTitle>文章内容</CardTitle>
                </CardHeader>
                <CardContent>
                  {editor && (
                    <>
                      {/* 工具栏 */}
                      <div className="flex flex-wrap items-center gap-2 border rounded-t-md p-2 bg-gray-50 dark:bg-gray-800">
                        <button
                          onClick={() => editor.chain().focus().toggleBold().run()}
                          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="粗体"
                        >
                          <Bold className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleItalic().run()}
                          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="斜体"
                        >
                          <Italic className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleUnderline().run()}
                          className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="下划线"
                        >
                          <Underline className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleStrike().run()}
                          className={`p-2 rounded ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="删除线"
                        >
                          <Strikethrough className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <button
                          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                          className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="标题1"
                        >
                          <Heading1 className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="标题2"
                        >
                          <Heading2 className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                          className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="标题3"
                        >
                          <Heading3 className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <button
                          onClick={() => editor.chain().focus().toggleBulletList().run()}
                          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="无序列表"
                        >
                          <List className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleOrderedList().run()}
                          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="有序列表"
                        >
                          <ListOrdered className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <div className="h-5 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <button
                          onClick={() => editor.chain().focus().toggleCode().run()}
                          className={`p-2 rounded ${editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="行内代码"
                        >
                          <Code className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                          className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="代码块"
                        >
                          <Code2 className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          onClick={() => editor.chain().focus().toggleBlockquote().run()}
                          className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                          title="引用"
                        >
                          <Quote className="size-4 text-gray-700 dark:text-gray-300" />
                        </button>
                      </div>
                      <EditorContent 
                        editor={editor} 
                        className="border-x border-b rounded-b-md p-2 min-h-[300px]"
                      />
                    </>
                  )}
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <div className="flex justify-end gap-4 pt-4">
                <Link href="/admin/home/articles">
                  <Button variant="outline" type="button">
                    取消
                  </Button>
                </Link>
                {(isNew || (isEditing && status !== "已发布")) && (
                  <Button type="button" variant="secondary" onClick={handleSaveDraft}>
                    保存草稿
                  </Button>
                )}
                <Button type="submit">
                  <Save className="mr-2 size-4" />
                  {isEditing ? '更新文章' : '提交文章'}
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
  )
}
