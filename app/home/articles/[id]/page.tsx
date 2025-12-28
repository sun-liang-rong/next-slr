'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Article } from '@/types/article';
import Layout from '@/components/Layout';
import ArticleHeader from '@/components/ArticleHeader';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';

function ArticleDetail() {
  const params = useParams();
  const articleId = params.id as string;
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 获取文章详情
  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/articles/${articleId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch article');
      }
      const data = await res.json();
      // 确保tags是数组
      if (data.data && typeof data.data === 'object') {
        data.data.tags = Array.isArray(data.data.tags) ? data.data.tags : [];
      }
      setArticle(data.data);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      setError('无法加载文章详情');
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  return (
    <Layout>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-display font-bold mb-4 text-neon-red">
            {error}
          </h2>
          <button 
            onClick={fetchArticle}
            className="px-6 py-3 bg-neon-purple text-white rounded-full hover:bg-neon-blue transition-colors duration-300 btn-hover"
          >
            重试
          </button>
        </div>
      ) : article ? (
        <div className="max-w-3xl mx-auto">
          {/* 文章头部 */}
          <ArticleHeader article={article} />
          
          {/* 文章正文 */}
          <article className="glass-morphism rounded-lg p-8">
            <MarkdownRenderer content={article.content} />
          </article>
          
          {/* 返回按钮 */}
          <div className="mt-12 text-center">
            <a 
              href="/home" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-dark-purple/60 text-white rounded-full border border-border-purple hover:bg-dark-purple/80 transition-colors duration-300 btn-hover"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              返回文章列表
            </a>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-display font-bold mb-4 text-white">
            文章不存在
          </h2>
          <p className="text-gray">
            您访问的文章可能已被删除或不存在
          </p>
        </div>
      )}
    </Layout>
  );
}

export default ArticleDetail;