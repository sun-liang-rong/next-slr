import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const total = await prisma.article.count({ where });

  return NextResponse.json({
    data: total,
  });
}
