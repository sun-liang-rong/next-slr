// components/ContentRenderer.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// 修复工具：把 <p>## 开头的段落转成真正的标题
function fixPseudoHeadings(html: string): string {
  return html
    .replace(/<p>(#{1,6})\s*(.+?)<\/p>/g, (match, hashes, content) => {
      const level = hashes.length;
      return `<h${level}>${content.trim()}</h${level}>`;
    })
    // 同时处理可能出现的 <p>###标题</p> 这种情况
    .replace(/<p>\s*(#{1,6})\s*(.+?)\s*<\/p>/g, (match, hashes, content) => {
      const level = hashes.length;
      return `<h${level}>${content.trim()}</h${level}>`;
    });
}

// 可选：进一步清理多余的 <p> 包裹（如果需要更干净）
function cleanHtml(html: string): string {
  return fixPseudoHeadings(html)
    .replace(/<p><strong>(.+?)<\/strong><\/p>/g, '<p><strong>$1</strong></p>') // 保留正常加粗
    .trim();
}

interface ContentRendererProps {
  content: string;
  type?: 'html' | 'markdown';
  className?: string;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  type,
  className = '',
}) => {
  const isHTML = type === 'html' || (!type && /<[^>]+>/.test(content));

  if (isHTML) {
    const fixedHtml = cleanHtml(content);

    return (
      <div
        className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
        dangerouslySetInnerHTML={{ __html: fixedHtml }}
      />
    );
  }

  // Markdown 模式
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export default ContentRenderer;