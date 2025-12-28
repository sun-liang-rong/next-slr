// app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;
  const tagId = searchParams.get('tagId') || undefined;

  const skip = (page - 1) * limit;

  const articles = await prisma.article.findMany({
    where: {
      title: search ? { contains: search, mode: 'insensitive' } : undefined,
      status: status || undefined,
      tags: tagId ? { some: { id: tagId } } : undefined,
    },
    skip,
    take: limit,
    orderBy: { created_at: 'desc' },
    include: {
      tags: {
        select: { id: true, name: true },
      },
    },
  });

  const total = await prisma.article.count({
    where: {
      title: search ? { contains: search, mode: 'insensitive' } : undefined,
      status: status || undefined,
      tags: tagId ? { some: { id: tagId } } : undefined,
    },
  });

  return NextResponse.json({
    data: articles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, status = 'draft', tagNames } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容必填' },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        status,
        tags: {
          connectOrCreate: tagNames?.map((name: string) => ({
            where: { name },
            create: { name },
          })) || [],
        },
      },
      include: {
        tags: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '创建失败' },
      { status: 500 }
    );
  }
}