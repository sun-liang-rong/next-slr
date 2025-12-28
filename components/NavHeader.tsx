import Link from 'next/link';

const NavHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* 博客名称 */}
        <Link href="/home" className="flex items-center gap-2">
          <h1 className="text-2xl font-display font-bold gradient-text neon-text">
            CYBER BLOG
          </h1>
          <span className="text-xs text-neon-cyan uppercase tracking-widest">
            v2.0
          </span>
        </Link>
        
        {/* 导航菜单 */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/home" 
            className="text-white hover:text-neon-purple transition-colors duration-300 font-medium"
          >
            首页
          </Link>
          <Link 
            href="/home/tags" 
            className="text-white hover:text-neon-purple transition-colors duration-300 font-medium"
          >
            标签
          </Link>
          <Link 
            href="/home/about" 
            className="text-white hover:text-neon-purple transition-colors duration-300 font-medium"
          >
            关于
          </Link>
        </nav>
      </div>
      
      {/* 底部霓虹线条 */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
    </header>
  );
};

export default NavHeader;