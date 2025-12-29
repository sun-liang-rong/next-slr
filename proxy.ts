import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// JWT密钥，实际项目中应该存储在环境变量中
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 不需要验证的路径
const publicPaths = [
  '/',
  '/admin/login',
  '/api/admin/login',
  '/api/articles', // 文章列表接口
  '/api/articles/count', // 文章计数接口
  '/api/tags', // 标签列表接口
  '/api/articles/:id', // 文章详情接口
];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 检查是否为公开路径
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // 检查是否为API路径
  if (path.startsWith('/api/')) {
    // 获取cookie中的token
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: '未授权，请先登录' },
        { status: 401 }
      );
    }

    try {
      // 验证token
      jwt.verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'token无效或已过期' },
        { status: 401 }
      );
    }
  }

  // 对于非API路径，重定向到登录页
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

// 配置中间件的匹配路径
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};