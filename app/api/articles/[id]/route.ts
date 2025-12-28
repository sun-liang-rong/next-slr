// app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(id, 'id')
  const article = await prisma.article.findFirst({
    where: { id },
    include: {
      tags: {
        select: { id: true, name: true },
      },
    },
  });
  console.log(article, 'article')

  if (!article) {
    return NextResponse.json(
      { error: '文章不存在' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: article
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log(params, 'params')
    const { id } = await params;
    const body = await request.json();
    const { title, content, status, tagNames } = body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (status !== undefined) data.status = status;

    if (tagNames !== undefined) {
      data.tags = {
        set: [], // 断开所有旧关联
        connectOrCreate: tagNames.map((name: string) => ({
          where: { name },
          create: { name },
        })),
      };
    }

    const article = await prisma.article.update({
      where: { id },
      data,
      include: {
        tags: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { error: '更新失败，可能文章不存在' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    return NextResponse.json(
      { error: '删除失败，可能文章不存在' },
      { status: 500 }
    );
  }
}