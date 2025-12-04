import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Handle GET /api/vendors/[id]
export async function GET(_req: Request, context: any) {
  const params = await context.params;        // 👈 important: await
  const id = params?.id as string;

  const vendor = await prisma.vendor.findUnique({
    where: { id },
  });

  if (!vendor) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(vendor);
}

// Handle PUT /api/vendors/[id]
export async function PUT(req: Request, context: any) {
  const params = await context.params;        // 👈 await here too
  const id = params?.id as string;
  const body = await req.json();

  const updated = await prisma.vendor.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

// Handle DELETE /api/vendors/[id]
export async function DELETE(_req: Request, context: any) {
  const params = await context.params;        // 👈 and here
  const id = params?.id as string;

  await prisma.vendor.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
