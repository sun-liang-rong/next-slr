// app/api/tags/[tagId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  try {
    console.log(params, 'params')
    const { tagId } = await params;
    console.log(tagId, 'tagId')
    const tag = await prisma.tag.findUnique({
      where: { id: tagId }
    });

    if (!tag) {
      return NextResponse.json(
        { error: '标签不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: tag,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '获取标签详情失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  try {
    const { tagId } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: '标签名称不能为空' },
        { status: 400 }
      );
    }

    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: '标签不存在' },
        { status: 404 }
      );
    }

    // 检查新名称是否已被其他标签使用
    const duplicateTag = await prisma.tag.findUnique({
      where: { name: name.trim() },
    });

    if (duplicateTag && duplicateTag.id !== tagId) {
      return NextResponse.json(
        { error: '标签名称已存在' },
        { status: 400 }
      );
    }

    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '更新标签失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tagId: string }> }
) {
  try {
    const { tagId } = await params;
    // 检查标签是否存在
    const existingTag = await prisma.tag.findUnique({
      where: { id: tagId },
      include: {
        _count: { select: { articles: true } },
      },
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: '标签不存在' },
        { status: 404 }
      );
    }

    // 检查标签是否被文章使用
    if (existingTag._count.articles > 0) {
      return NextResponse.json(
        { error: '该标签已被文章使用，无法删除' },
        { status: 400 }
      );
    }

    await prisma.tag.delete({
      where: { id: tagId },
    });

    return NextResponse.json({ message: '标签删除成功' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '删除标签失败' },
      { status: 500 }
    );
  }
}
