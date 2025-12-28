import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';

interface CodeBlockProps {
  language: string;
  children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
  const codeRef = useRef<HTMLElement>(null);

  // 复制代码到剪贴板
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
  };

  // 使用highlight.js高亮代码
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children, language]);

  return (
    <div className="my-8 glass-morphism rounded-lg overflow-hidden">
      {/* 代码块头部 */}
      <div className="bg-dark-purple/80 px-4 py-3 flex justify-between items-center border-b border-border-purple">
        <div className="flex items-center gap-3">
          {/* 语言标识 */}
          <span className="text-neon-cyan font-mono text-sm uppercase">{language}</span>
          
          {/* 装饰点 */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-red"></div>
            <div className="w-3 h-3 rounded-full bg-neon-yellow"></div>
            <div className="w-3 h-3 rounded-full bg-neon-green"></div>
          </div>
        </div>
        
        {/* 复制按钮 */}
        <button 
          onClick={handleCopy}
          className="text-gray hover:text-neon-purple transition-colors duration-300 text-sm flex items-center gap-1"
          title="复制代码"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          复制
        </button>
      </div>
      
      {/* 代码内容 */}
      <pre className="p-4 overflow-x-auto">
        <code 
          ref={codeRef}
          className={`font-mono text-sm text-white language-${language}`}
        >
          {children}
        </code>
      </pre>
      
      {/* 底部渐变效果 */}
      <div className="h-1 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink"></div>
    </div>
  );
};

export default CodeBlock;