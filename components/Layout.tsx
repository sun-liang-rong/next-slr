import React, { ReactNode } from 'react';
import NavHeader from './NavHeader';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen font-sans">
      {/* 固定的导航栏 */}
      <NavHeader />
      
      {/* 主内容区域 */}
      <main className="container mx-auto px-4 py-8 pt-24">
        {children}
      </main>
      
      {/* 页脚 */}
      <footer className="mt-16 py-8 border-t border-border-purple">
        <div className="container mx-auto px-4 text-center text-gray">
          <p className="mb-2">© {new Date().getFullYear()} 赛博朋克博客</p>
          <p className="text-sm">Powered by Next.js & Cyberpunk UI</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;