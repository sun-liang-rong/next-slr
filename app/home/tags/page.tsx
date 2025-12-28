'use client';

import { useState, useEffect } from 'react';
import { Article, Tag } from '@/types/article';
import Layout from '@/components/Layout';
import TagCloud from '@/components/TagCloud';
import ArticleCard from '@/components/ArticleCard';
import LoadingSpinner from '@/components/LoadingSpinner';

function TagsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  // 获取文章数据
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(Array.isArray(data.data) ? data.data : []);
      setFilteredArticles(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      setArticles([]);
      setFilteredArticles([]);
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
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, []);

  // 标签筛选逻辑
  useEffect(() => {
    if (!selectedTag) {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article => 
        article.tags?.some(tag => tag.id === selectedTag)
      );
      setFilteredArticles(filtered);
    }
  }, [selectedTag, articles]);

  // 标签点击处理
  const handleTagClick = (tagId: string) => {
    setSelectedTag(selectedTag === tagId ? undefined : tagId);
  };

  return (
    <Layout>
      {/* 页面标题 */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-display font-bold mb-4 gradient-text neon-text">
          标签云
        </h1>
        <p className="text-xl text-gray">
          探索不同主题的文章
        </p>
      </section>
      
      {/* 标签云 */}
      <TagCloud 
        tags={tags} 
        onTagClick={handleTagClick} 
        selectedTag={selectedTag} 
      />
      
      {/* 文章列表 */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
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

export default TagsPage;