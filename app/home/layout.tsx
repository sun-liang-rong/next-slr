'use client';

import { useEffect } from 'react';
import './cyberpunk.css';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  // 页面加载时立即应用赛博朋克背景类
  useEffect(() => {
    document.body.classList.add('cyberpunk-bg');
    
    return () => {
      document.body.classList.remove('cyberpunk-bg');
    };
  }, []);

  return (
    <div className="cyberpunk-container">
      {/* 赛博朋克风格增强 - 只保留动态效果 */}
      <style jsx global>{`
        /* 全局赛博朋克滤镜 */
        .cyberpunk-container {
          position: relative;
        }
        
        /* 故障艺术效果 */
        .cyberpunk-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #f72585, transparent);
          animation: scanline 5s linear infinite;
          z-index: 1000;
          pointer-events: none;
        }
        
        /* 玻璃拟态光泽效果 */
        .glass-morphism::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(157, 78, 221, 0.2), transparent);
          animation: glass-shine 3s infinite;
        }
        
        /* 玻璃光泽动画 */
        @keyframes glass-shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* 增强的卡片悬停效果 */
        .card-hover {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 0 30px rgba(157, 78, 221, 0.6),
            0 0 60px rgba(157, 78, 221, 0.3);
        }
        
        /* 增强的按钮样式 */
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
        }
        
        .btn-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }
        
        .btn-hover:hover::before {
          left: 100%;
        }
        
        /* 增强的链接样式 */
        body.cyberpunk-bg a {
          color: #9d4edd;
          transition: all 0.3s ease;
          position: relative;
        }
        
        body.cyberpunk-bg a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #9d4edd, #4361ee, #f72585);
          transition: width 0.3s ease;
        }
        
        body.cyberpunk-bg a:hover {
          color: #4361ee;
        }
        
        body.cyberpunk-bg a:hover::after {
          width: 100%;
        }
        
        /* 滚动条样式 */
        body.cyberpunk-bg ::-webkit-scrollbar {
          width: 8px;
        }
        
        body.cyberpunk-bg ::-webkit-scrollbar-track {
          background: #0a0a0f;
        }
        
        body.cyberpunk-bg ::-webkit-scrollbar-thumb {
          background: linear-gradient(#9d4edd, #4361ee);
          border-radius: 4px;
        }
        
        body.cyberpunk-bg ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(#4361ee, #f72585);
        }
      `}</style>
      {children}
    </div>
  );
}