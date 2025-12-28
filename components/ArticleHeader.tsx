import { Article } from '@/types/article';

interface ArticleHeaderProps {
  article: Article;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ article }) => {
  return (
    <header className="mb-12 glass-morphism rounded-lg p-8">
      {/* 标签列表 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {article.tags?.map((tag) => (
          <span 
            key={tag.id} 
            className="inline-block bg-dark-purple/60 text-neon-cyan text-sm px-4 py-2 rounded-full border border-border-purple"
          >
            {tag.name}
          </span>
        ))}
      </div>
      
      {/* 文章标题 */}
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white gradient-text">
        {article.title}
      </h1>
      
      {/* 发布信息 */}
      <div className="flex flex-wrap items-center gap-6 text-gray">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
          <span>
            {new Date(article.created_at).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
            <path d="M22 12A10 10 0 0 0 12 2v10z"/>
          </svg>
          <span>最后更新: {new Date(article.updated_at).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>
      
      {/* 装饰线条 */}
      <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
    </header>
  );
};

export default ArticleHeader;