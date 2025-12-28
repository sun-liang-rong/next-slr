const HeroSection: React.FC = () => {
  return (
    <section className="mb-12 py-16 text-center relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow animation-delay-3000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-3xl animate-pulse-slow animation-delay-5000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* 主标题 */}
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 gradient-text neon-text tracking-wider">
          <span className="block">CYBERPUNK</span>
          <span className="block mt-2">BLOG</span>
        </h1>
        
        {/* 副标题 */}
        <p className="text-2xl md:text-3xl text-gray mb-10 leading-relaxed font-light tracking-wide">
          探索数字世界的边界，分享未来科技与文化
        </p>
        
        {/* 装饰元素 */}
        <div className="flex justify-center gap-6 mb-10">
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
          <div className="w-6 h-6 rounded-full bg-neon-pink animate-pulse border-2 border-neon-pink/50"></div>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent"></div>
        </div>
        
        {/* 描述文本 */}
        <div className="glass-morphism rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-gray text-sm md:text-base leading-relaxed font-mono tracking-wide">
            <span className="text-neon-cyan">{'>'} </span>这里记录着关于编程、设计、科技和未来的思考与探索，<br />
            <span className="text-neon-cyan">{'>'} </span>用赛博朋克的视角观察这个不断变化的世界。<br />
            <span className="text-neon-cyan">{'>'} </span>探索数字世界的无限可能...
          </p>
        </div>
        
        {/* 技术标签 */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <span className="inline-block bg-dark-purple/80 text-neon-purple px-4 py-2 rounded-full text-xs font-mono border border-border-purple">
            NEXT.JS
          </span>
          <span className="inline-block bg-dark-purple/80 text-neon-blue px-4 py-2 rounded-full text-xs font-mono border border-border-purple">
            REACT
          </span>
          <span className="inline-block bg-dark-purple/80 text-neon-pink px-4 py-2 rounded-full text-xs font-mono border border-border-purple">
            TAILWIND CSS
          </span>
          <span className="inline-block bg-dark-purple/80 text-neon-cyan px-4 py-2 rounded-full text-xs font-mono border border-border-purple">
            MARKDOWN
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;