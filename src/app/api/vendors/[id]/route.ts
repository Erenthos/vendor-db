import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Loosen the context typing so it matches whatever Next expects internally
export async function GET(_req: Request, context: any) {
  const id = context?.params?.id as string;

  const vendor = await prisma.vendor.findUnique({
    where: { id },
  });

  return NextResponse.json(vendor);
}

export async function PUT(req: Request, context: any) {
  const id = context?.params?.id as string;
  const body = await req.json();

  const updated = await prisma.vendor.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, context: any) {
  const id = context?.params?.id as string;

  await prisma.vendor.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
