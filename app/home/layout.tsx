'use client';

import { useEffect } from 'react';
import './enhanced-cyberpunk.css';

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
      {children}
    </div>
  );
}