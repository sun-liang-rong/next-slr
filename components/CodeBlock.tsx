import React from 'react';

interface CodeBlockProps {
  language: string;
  children: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, children }) => {
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
        
        {/* 复制按钮占位符 */}
        <button className="text-gray hover:text-neon-purple transition-colors duration-300 text-sm">
          复制
        </button>
      </div>
      
      {/* 代码内容 */}
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm text-white">
          {children}
        </code>
      </pre>
      
      {/* 底部渐变效果 */}
      <div className="h-1 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-pink"></div>
    </div>
  );
};

export default CodeBlock;