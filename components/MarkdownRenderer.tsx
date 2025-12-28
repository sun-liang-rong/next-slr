import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeBlock from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        // 标题样式
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl font-display font-bold mt-12 mb-6 text-white gradient-text">{props.children}</h1>
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-display font-bold mt-10 mb-5 text-white">{props.children}</h2>
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-display font-bold mt-8 mb-4 text-white">{props.children}</h3>
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-lg font-display font-bold mt-6 mb-3 text-white">{props.children}</h4>
        ),
        h5: ({ node, ...props }) => (
          <h5 className="text-base font-display font-bold mt-4 mb-2 text-white">{props.children}</h5>
        ),
        h6: ({ node, ...props }) => (
          <h6 className="text-sm font-display font-bold mt-2 mb-1 text-white">{props.children}</h6>
        ),
        
        // 段落样式
        p: ({ node, ...props }) => (
          <p className="mb-6 text-gray leading-relaxed">{props.children}</p>
        ),
        
        // 链接样式
        a: ({ node, ...props }) => (
          <a 
            className="text-neon-purple hover:text-neon-blue transition-colors duration-300 underline"
            {...props}
          >{props.children}</a>
        ),
        
        // 列表样式
        ul: ({ node, ...props }) => (
          <ul className="mb-6 pl-6 list-disc space-y-2 text-gray">{props.children}</ul>
        ),
        ol: ({ node, ...props }) => (
          <ol className="mb-6 pl-6 list-decimal space-y-2 text-gray">{props.children}</ol>
        ),
        li: ({ node, ...props }) => (
          <li>{props.children}</li>
        ),
        
        // 引用样式
        blockquote: ({ node, ...props }) => (
          <blockquote className="mb-6 pl-6 border-l-4 border-neon-purple italic text-gray">
            {props.children}
          </blockquote>
        ),
        
        // 分割线样式
        hr: ({ node, ...props }) => (
          <hr className="my-8 border-t border-border-purple" />
        ),
        
        // 加粗样式
        strong: ({ node, ...props }) => (
          <strong className="font-bold text-white">{props.children}</strong>
        ),
        
        // 斜体样式
        em: ({ node, ...props }) => (
          <em className="italic text-gray">{props.children}</em>
        ),
        
        // 代码块样式
        code({ node, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <CodeBlock language={match[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
          ) : (
            <code className="bg-dark-purple/60 text-neon-cyan px-2 py-1 rounded border border-border-purple font-mono text-sm">
              {children}
            </code>
          );
        },
        
        // 图片样式
        img: ({ node, ...props }) => (
          <img 
            className="my-8 rounded-lg border border-border-purple max-w-full"
            {...props} 
          />
        ),
        
        // 表格样式
        table: ({ node, ...props }) => (
          <div className="my-8 overflow-x-auto">
            <table className="min-w-full border-collapse">{props.children}</table>
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-dark-purple/80">{props.children}</thead>
        ),
        th: ({ node, ...props }) => (
          <th className="px-6 py-3 text-left font-display font-bold text-white border-b border-border-purple">{props.children}</th>
        ),
        td: ({ node, ...props }) => (
          <td className="px-6 py-4 text-gray border-b border-border-purple">{props.children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;