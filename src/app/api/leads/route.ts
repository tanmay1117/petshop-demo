import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Failed to fetch leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = await prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        message: body.message || null,
        source: body.source || 'website',
      },
    });

    // TODO: Send notification email
    // TODO: Send Discord webhook notification
    // TODO: Send WhatsApp notification

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error('Failed to create lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
