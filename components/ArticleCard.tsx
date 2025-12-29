import Link from 'next/link';
import { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // 从文章内容中提取简介（前150字）
  const getExcerpt = (content: string) => {
    // 简单的HTML标签移除和文本截取
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.slice(0, 150) + '...' : text;
  };

  return (
    <Link href={`/home/articles/${article.id}`} className="group">
      <div className="glass-morphism rounded-lg p-6 card-hover relative overflow-hidden">
        {/* 卡片背景装饰 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-neon-purple/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-blue/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        {/* 标签列表 */}
        <div className="mb-4 flex flex-wrap gap-2 relative z-10">
          {article.tags?.map((tag) => (
            <span 
              key={tag.id} 
              className="inline-block bg-dark-purple/80 text-neon-cyan text-xs px-3 py-1 rounded-full border border-border-purple hover:border-neon-cyan/70 hover:text-neon-cyan transition-all duration-300"
            >
              {tag.name}
            </span>
          ))}
        </div>
        
        {/* 文章标题 */}
        <h2 className="text-xl md:text-2xl font-display font-bold mb-3 text-white group-hover:text-neon-purple transition-colors duration-300 relative z-10 leading-tight">
          {article.title}
        </h2>
        
        {/* 文章简介 */}
        {/* <p className="text-gray mb-4 line-clamp-3 relative z-10 font-light leading-relaxed">
          {getExcerpt(article.content)}
        </p> */}
        
        {/* 发布信息 */}
        <div className="flex justify-between items-center pt-4 border-t border-border-purple relative z-10">
          <span className="text-sm text-gray flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            {new Date(article.created_at).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })}
          </span>
          <div className="flex items-center gap-2 text-sm text-neon-purple group-hover:text-neon-blue transition-colors duration-300 font-mono">
            <span>READ MORE</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </div>
        
        {/* 卡片底部装饰 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </Link>
  );
};

export default ArticleCard;