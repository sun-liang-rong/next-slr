"use client"
import React from 'react';
import { Tag } from '@/types/article';

interface TagCloudProps {
  tags: Tag[];
  onTagClick: (tagId: string) => void;
  selectedTag?: string;
}

const TagCloud: React.FC<TagCloudProps> = ({ tags, onTagClick, selectedTag }) => {
  // 模拟标签权重，用于确定标签大小
  const getTagWeight = (tagName: string): number => {
    return Math.floor(Math.random() * 3) + 1; // 1-3
  };

  return (
    <div className="mb-12">
      <div className="flex flex-wrap gap-4 justify-center">
        {Array.isArray(tags) && tags.map((tag) => {
          const weight = getTagWeight(tag.name);
          const fontSize = weight === 1 ? 'text-sm' : weight === 2 ? 'text-base' : 'text-lg';
          const isSelected = selectedTag === tag.id;
          
          return (
            <button
              key={tag.id}
              onClick={() => onTagClick(tag.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                isSelected
                  ? 'text-white bg-neon-purple neon-border btn-hover'
                  : 'glass-morphism text-gray hover:text-neon-blue'
              } ${fontSize}`}
            >
              {tag.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagCloud;