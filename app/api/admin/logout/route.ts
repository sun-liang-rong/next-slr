import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 创建响应
    const response = NextResponse.json({
      message: '退出登录成功',
    });

    // 清除cookie中的token
    response.cookies.delete('token');

    return response;
  } catch (error) {
    console.error('退出登录失败:', error);
    return NextResponse.json(
      { error: '退出登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
