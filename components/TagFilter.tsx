import { Tag } from '@/types/article';

interface TagFilterProps {
  tags: Tag[];
  selectedTag?: string;
  onTagSelect: (tagId: string | undefined) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ 
  tags, 
  selectedTag, 
  onTagSelect 
}) => {
  return (
    <section className="mb-12">
      <div className="flex flex-wrap gap-3 justify-center">
        {/* 全部标签按钮 */}
        <button
          onClick={() => onTagSelect(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedTag === undefined
              ? 'bg-neon-purple text-white neon-border btn-hover'
              : 'glass-morphism text-gray hover:text-neon-purple'
          }`}
        >
          全部
        </button>
        
        {/* 标签列表 */}
        {Array.isArray(tags) && tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagSelect(tag.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedTag === tag.id
                ? 'bg-neon-blue text-white neon-border-blue btn-hover'
                : 'glass-morphism text-gray hover:text-neon-blue'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TagFilter;