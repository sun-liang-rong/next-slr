const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        {/* 外圈 */}
        <div className="w-20 h-20 border-4 border-transparent border-t-neon-purple border-r-neon-purple rounded-full animate-spin-slow"></div>
        
        {/* 中圈 */}
        <div className="absolute top-2 left-2 w-16 h-16 border-4 border-transparent border-t-neon-blue border-r-neon-blue rounded-full animate-spin-reverse"></div>
        
        {/* 内圈 */}
        <div className="absolute top-4 left-4 w-12 h-12 border-4 border-transparent border-t-neon-pink border-r-neon-pink rounded-full animate-spin-slow"></div>
        
        {/* 中心圆点 */}
        <div className="absolute top-8 left-8 w-4 h-4 rounded-full bg-neon-cyan animate-pulse"></div>
      </div>
      
      {/* 加载文本 */}
      <div className="ml-4 text-xl font-display text-white">
        <span className="inline-block animate-pulse">LOADING</span>
        <span className="inline-block ml-2">...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;