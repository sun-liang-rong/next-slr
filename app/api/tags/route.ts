// app/api/tags/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    });

    return NextResponse.json({
      data: tags,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '获取标签列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: '标签名称不能为空' },
        { status: 400 }
      );
    }

    // 检查标签名称是否已存在
    const existingTag = await prisma.tag.findUnique({
      where: { name: name.trim() },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: '标签名称已存在' },
        { status: 409 }
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '创建标签失败' },
      { status: 500 }
    );
  }
}
