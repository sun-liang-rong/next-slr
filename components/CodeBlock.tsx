import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

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
    <div className="my-8 glass-morphism rounded-xl overflow-hidden border border-border-purple shadow-[0_0_20px_rgba(157,78,221,0.2)] relative group">
      {/* 代码块头部 */}
      <div className="bg-gradient-to-r from-dark-purple/80 to-purple-900/50 px-4 py-3 flex justify-between items-center border-b border-border-purple relative">
        <div className="flex items-center gap-3">
          {/* 语言标识 */}
          <span className="text-neon-cyan font-mono text-sm uppercase tracking-wider font-bold">
            {language}
          </span>
          
          {/* 装饰点 */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-neon-red shadow-[0_0_8px_rgba(247,37,133,0.6)]"></div>
            <div className="w-3 h-3 rounded-full bg-neon-yellow shadow-[0_0_8px_rgba(248,243,43,0.6)]"></div>
            <div className="w-3 h-3 rounded-full bg-neon-green shadow-[0_0_8px_rgba(72,149,239,0.6)]"></div>
          </div>
        </div>
        
        {/* 复制按钮 */}
        <button 
          onClick={handleCopy}
          className="text-gray hover:text-neon-purple transition-colors duration-300 text-sm flex items-center gap-1 group/copy relative z-10"
          title="复制代码"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span className="ml-1">复制</span>
        </button>
      </div>
      
      {/* 代码内容 */}
      <pre className="p-4 overflow-x-auto bg-dark-bg/50">
        <code 
          ref={codeRef}
          className={`font-mono text-sm language-${language} !bg-transparent`}
        >
          {children}
        </code>
      </pre>
      
      {/* 底部渐变效果 */}
      <div className="h-1 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink"></div>
      
      {/* 边框动画效果 */}
      <div className="absolute inset-0 rounded-xl border border-transparent [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] pointer-events-none -z-10">
        <div className="absolute inset-0 rounded-xl [background:linear-gradient(90deg,transparent,theme(colors.neon.purple),transparent)_border-box] animate-spin-slow [animation-duration:3s]"></div>
      </div>
    </div>
  );
};

export default CodeBlock;