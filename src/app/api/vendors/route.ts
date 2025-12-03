import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await prisma.vendor.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();

  const vendor = await prisma.vendor.create({
    data: body,
  });

  return NextResponse.json(vendor, { status: 201 });
}

