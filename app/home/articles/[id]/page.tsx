"use client"

import { use, useEffect, useState } from "react"
import { Article } from "@/types/article"
import LoadingSpinner from "@/components/LoadingSpinner"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import Markdown from 'markdown-to-jsx';
import CodeBlock from '@/components/CodeBlock';
// 格式化日期
function formatDate(dateString: Date | string): string {
  const date = new Date(dateString)
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(/\//g, "-")
}

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        // 模拟网络延迟以展示加载动画 (可选，生产环境可移除)
        // await new Promise(resolve => setTimeout(resolve, 800))
        
        const response = await fetch(`/api/articles/${id}`)
        if (!response.ok) {
          throw new Error("文章未找到或已被删除")
        }
        const data = await response.json()
        setArticle(data.data)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : "获取文章失败")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* 装饰背景 */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* 网格背景 */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: `linear-gradient(rgba(67, 97, 238, 0.1) 1px, transparent 1px), 
                                 linear-gradient(90deg, rgba(67, 97, 238, 0.1) 1px, transparent 1px)`,
                 backgroundSize: '40px 40px'
               }}>
          </div>
          {/* 扫描线效果 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
          {/* 顶部光晕 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-neon-purple/10 blur-[100px] rounded-full"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center p-1 mb-4 animate-spin-slow">
              <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
              </div>
            </div>
            
            <div className="absolute inset-0 rounded-full border border-neon-purple/30 animate-ping"></div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-orbitron font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple drop-shadow-[0_0_15px_rgba(76,201,240,0.5)]">
            LOADING ARTICLE
          </h2>
          
          <p className="text-neon-blue font-jetbrains text-lg animate-pulse">
            SYSTEM LOADING...
          </p>
          
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-3 h-3 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
            <div className="w-3 h-3 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '900ms' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col justify-center items-center text-white p-4 relative overflow-hidden">
        {/* 装饰背景 */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* 网格背景 */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: `linear-gradient(rgba(247, 37, 133, 0.1) 1px, transparent 1px), 
                                 linear-gradient(90deg, rgba(247, 37, 133, 0.1) 1px, transparent 1px)`,
                 backgroundSize: '40px 40px'
               }}>
          </div>
          {/* 扫描线效果 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
          {/* 顶部光晕 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-neon-red/10 blur-[100px] rounded-full"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-2xl w-full px-4">
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-neon-red to-neon-pink flex items-center justify-center p-1 mb-6 animate-pulse">
              <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                <div className="text-4xl">⚠️</div>
              </div>
            </div>
            
            <div className="absolute inset-0 rounded-full border border-neon-red/30 animate-ping"></div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-white to-neon-pink drop-shadow-[0_0_15px_rgba(247,37,133,0.5)]">
            ERROR 404
          </h2>
          
          <div className="mb-8">
            <p className="font-jetbrains text-xl mb-4 text-gray-300">{error || "DATA NOT FOUND"}</p>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-red-900/50 to-pink-900/50 rounded-lg border border-neon-red/50 shadow-[0_0_20px_rgba(247,37,133,0.3)]">
              <p className="font-jetbrains text-sm text-gray-400">错误代码: ARTICLE_NOT_FOUND</p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link 
              href="/home" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full border border-neon-blue/50 text-neon-cyan hover:text-neon-purple transition-all duration-300 font-jetbrains text-lg shadow-[0_0_15px_rgba(67,97,238,0.3)] hover:shadow-[0_0_25px_rgba(67,97,238,0.5)] group relative overflow-hidden"
            >
              <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>RETURN TO BASE</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500 font-jetbrains">
            <p>尝试刷新页面或稍后重试</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-dark-bg text-white relative overflow-hidden font-inter selection:bg-neon-pink selection:text-white">
      {/* 装饰背景 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 网格背景 */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: `linear-gradient(rgba(67, 97, 238, 0.1) 1px, transparent 1px), 
                               linear-gradient(90deg, rgba(67, 97, 238, 0.1) 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        {/* 扫描线效果 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
        {/* 顶部光晕 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-neon-purple/10 blur-[100px] rounded-full"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-20 max-w-4xl">
        {/* 导航返回 */}
        <Link 
          href="/home" 
          className="inline-flex items-center text-neon-gray hover:text-neon-cyan transition-colors mb-12 group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          <span className="font-jetbrains text-sm tracking-wider">BACK_TO_LIST</span>
        </Link>

        {/* 头部信息 */}
        <header className="text-center mb-16 relative">
          {/* 装饰线 */}
          <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent -z-10"></div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple drop-shadow-[0_0_15px_rgba(76,201,240,0.5)]">
            {article.title}
          </h1>

          <div className="flex flex-col items-center gap-6">
            <time className="font-jetbrains text-neon-pink tracking-widest text-sm md:text-base border-b border-neon-pink/30 pb-1">
              {formatDate(article.created_at)}
            </time>

            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {article.tags?.map((tag) => (
                <span 
                  key={tag.id} 
                  className="px-4 py-2 text-xs font-jetbrains text-neon-cyan border border-neon-cyan/50 rounded-full bg-gradient-to-r from-cyan-900/30 to-purple-900/30 shadow-[0_0_10px_rgba(76,201,240,0.3)] hover:shadow-[0_0_20px_rgba(76,201,240,0.6)] hover:bg-cyan-800/40 transition-all cursor-default relative overflow-hidden"
                >
                  <span className="relative z-10">#{tag.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* 内容区域 */}
        <article className="relative mb-16">
          {/* 装饰角标 */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-neon-blue"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-neon-blue"></div>
          <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-neon-blue"></div>
          <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-neon-blue"></div>

          {/* 内容卡片背景效果 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 p-1 shadow-[0_0_40px_rgba(157,78,221,0.3)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent opacity-30"></div>
            
            <div className="relative bg-dark-bg/90 backdrop-blur-xl border border-neon-blue/30 p-8 md:p-12 rounded-2xl">
              <Markdown 
                options={{
                  overrides: {
                    code: {
                      component: ({node, inline, className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <CodeBlock language={match[1]}>{children}</CodeBlock>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        )
                      }
                    },
                    h1: {
                      component: ({node, ...props}) => (
                        <h1 className="text-3xl font-orbitron font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple text-neon-cyan" {...props} />
                      )
                    },
                    h2: {
                      component: ({node, ...props}) => (
                        <h2 className="text-2xl font-orbitron font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink text-neon-blue" {...props} />
                      )
                    },
                    h3: {
                      component: ({node, ...props}) => (
                        <h3 className="text-xl font-orbitron font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan text-neon-purple" {...props} />
                      )
                    },
                    p: {
                      component: ({node, ...props}) => (
                        <p className="mb-4 leading-relaxed text-gray-200" {...props} />
                      )
                    },
                    a: {
                      component: ({node, href, ...props}) => (
                        <a 
                          href={href} 
                          className="text-neon-purple hover:text-neon-cyan transition-colors duration-300 relative inline-block"
                          {...props}
                        >
                          <span className="relative z-10">{props.children}</span>
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-purple to-neon-blue opacity-0 transition-opacity duration-300"></span>
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300"></span>
                          <span 
                            className="absolute bottom-0 left-0 w-full h-0.5"
                            onMouseEnter={(e) => {
                              const target = e.currentTarget;
                              target.style.background = 'linear-gradient(90deg, var(--cyber-neon-purple), var(--cyber-neon-blue), var(--cyber-neon-pink))';
                              const span = target.nextElementSibling as HTMLElement;
                              if (span) span.style.width = '100%';
                            }}
                            onMouseLeave={(e) => {
                              const target = e.currentTarget;
                              target.style.background = 'transparent';
                              const span = target.nextElementSibling as HTMLElement;
                              if (span) span.style.width = '0%';
                            }}
                          ></span>
                        </a>
                      )
                    },
                    ul: {
                      component: ({node, ...props}) => (
                        <ul className="mb-4 pl-6 list-disc space-y-2" {...props} />
                      )
                    },
                    ol: {
                      component: ({node, ...props}) => (
                        <ol className="mb-4 pl-6 list-decimal space-y-2" {...props} />
                      )
                    },
                    li: {
                      component: ({node, ...props}) => (
                        <li className="text-gray-200" {...props} />
                      )
                    },
                    blockquote: {
                      component: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-neon-yellow pl-4 py-2 my-4 text-gray-300 italic relative before:content-['❝'] before:absolute before:-left-4 before:text-2xl before:text-neon-yellow" {...props} />
                      )
                    },
                    strong: {
                      component: ({node, ...props}) => (
                        <strong className="text-neon-yellow font-bold" {...props} />
                      )
                    },
                    em: {
                      component: ({node, ...props}) => (
                        <em className="text-neon-pink italic" {...props} />
                      )
                    },
                    img: {
                      component: ({node, ...props}) => (
                        <div className="my-6 rounded-lg overflow-hidden border border-neon-blue/30 shadow-[0_0_20px_rgba(67,97,238,0.2)]">
                          <img className="w-full h-auto" {...props} />
                        </div>
                      )
                    },
                    hr: {
                      component: ({node, ...props}) => (
                        <hr className="my-8 border-t border-neon-purple/30" {...props} />
                      )
                    }
                  }
                }}
              >
                {article.content}
              </Markdown>
            </div>
          </div>
        </article>

        {/* 底部装饰 */}
        <div className="mt-20 text-center relative">
          <div className="inline-block h-1 w-32 bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
          <p className="mt-6 text-xs text-gray-600 font-jetbrains tracking-[0.2em] uppercase relative">
            <span className="inline-block px-4 py-1 bg-dark-purple/50 rounded-full border border-border-purple">
              END OF FILE
            </span>
          </p>
          
          {/* 底部装饰网格 */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="h-1 bg-gradient-to-r from-neon-purple to-transparent"></div>
            <div className="h-1 bg-gradient-to-r from-neon-blue to-neon-pink"></div>
            <div className="h-1 bg-gradient-to-l from-neon-purple to-transparent"></div>
          </div>
        </div>
      </main>
    </div>
  )
}
