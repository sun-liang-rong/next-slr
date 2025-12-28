

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            欢迎来到我的博客
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl">
            这是一个展示 Next.js 和现代化 Web 技术的示例项目。在这里，您可以阅读各种技术文章，了解最新的开发趋势。
          </p>
          <div className="flex gap-4">
            <a 
              href="/admin" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              进入管理后台
            </a>
            <a 
              href="/home" 
              className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              浏览文章
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
