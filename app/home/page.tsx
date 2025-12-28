'use client';

import { useState, useEffect } from 'react';
import { Article, Tag } from '@/types/article';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import TagFilter from '@/components/TagFilter';
import ArticleCard from '@/components/ArticleCard';
import LoadingSpinner from '@/components/LoadingSpinner';

function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [articlesPerPage] = useState<number>(6);
  const [totalArticles, setTotalArticles] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 获取文章数据（支持分页）
  const fetchArticles = async (page: number = 1, tagId?: string) => {
    try {
      setLoading(true);
      let url = `/api/articles?page=${page}&limit=${articlesPerPage}`;
      if (tagId) {
        url += `&tagId=${tagId}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      
      // API返回格式为 { data: Article[], pagination: { total: number, pages: number } }
      const articleData = Array.isArray(data.data) ? data.data : [];
      const total = data.pagination?.total || articleData.length;
      const pages = data.pagination?.pages || 1;
      
      setArticles(articleData);
      setFilteredArticles(articleData);
      setTotalArticles(total);
      setTotalPages(pages);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      setArticles([]);
      setFilteredArticles([]);
      setTotalArticles(0);
    } finally {
      setLoading(false);
    }
  };

  // 获取标签数据
  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setTags(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      setTags([]);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchTags();
    fetchArticles(currentPage, selectedTag);
  }, []);

  // 标签筛选逻辑
  useEffect(() => {
    setCurrentPage(1); // 切换标签时重置到第一页
    fetchArticles(1, selectedTag);
  }, [selectedTag]);

  // 分页逻辑
  useEffect(() => {
    fetchArticles(currentPage, selectedTag);
  }, [currentPage]);

  // 标签选择处理
  const handleTagSelect = (tagId: string | undefined) => {
    setSelectedTag(tagId);
  };

  // 页面切换处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  return (
    <Layout>
      <HeroSection />
      
      {/* 标签筛选 */}
      <TagFilter 
        tags={tags} 
        selectedTag={selectedTag} 
        onTagSelect={handleTagSelect} 
      />
      
      {/* 文章列表 */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredArticles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          
          {/* 分页组件 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full glass-morphism text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:neon-border btn-hover"
              >
                上一页
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${currentPage === page
                      ? 'bg-neon-purple text-white neon-border btn-hover'
                      : 'glass-morphism text-gray hover:text-neon-purple'}
                    `}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full glass-morphism text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:neon-border btn-hover"
              >
                下一页
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-display font-bold mb-4 text-white">
            暂无文章
          </h2>
          <p className="text-gray">
            该标签下暂无文章，或文章正在创作中...
          </p>
        </div>
      )}
    </Layout>
  );
}

export default Home; 