import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: true } },
        user: { select: { name: true, email: true } },
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: body.userId,
        status: 'pending',
        totalAmount: body.totalAmount,
        subtotal: body.subtotal,
        tax: body.tax || 0,
        discount: body.discount || 0,
        paymentMethod: body.paymentMethod || 'razorpay',
        paymentStatus: body.paymentStatus || 'unpaid',
        paymentId: body.paymentId || null,
        shippingAddress: body.shippingAddress,
        shippingCity: body.shippingCity,
        shippingState: body.shippingState,
        shippingZip: body.shippingZip,
        phone: body.phone,
        notes: body.notes,
        items: {
          create: body.items.map((item: { productId: string; quantity: number; unitPrice: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    // Update stock for each item
    for (const item of body.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
