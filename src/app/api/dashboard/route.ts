import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Dashboard stats API for ERP
export async function GET() {
  try {
    const [
      totalProducts,
      totalStock,
      activeProducts,
      outOfStock,
      totalOrders,
      totalLeads,
      recentOrders,
      recentLeads,
      categoryBreakdown,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.aggregate({ _sum: { stockQuantity: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stockQuantity: 0 } }),
      prisma.order.count(),
      prisma.lead.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
      prisma.lead.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
      prisma.product.groupBy({
        by: ['category'],
        _count: { id: true },
        _sum: { stockQuantity: true },
      }),
    ]);

    // Calculate inventory value & revenue
    const products = await prisma.product.findMany({ select: { price: true, stockQuantity: true } });
    const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stockQuantity, 0);

    const orders = await prisma.order.findMany({ select: { totalAmount: true, status: true } });
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;

    // Low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stockQuantity: { gt: 0 },
        // Use raw comparison since Prisma doesn't support field-to-field
      },
      select: { id: true, name: true, stockQuantity: true, minStock: true },
    });
    const lowStock = lowStockProducts.filter(p => p.stockQuantity <= p.minStock);

    return NextResponse.json({
      overview: {
        totalProducts,
        activeProducts,
        totalStock: totalStock._sum.stockQuantity || 0,
        inventoryValue: Math.round(inventoryValue),
        totalOrders,
        totalRevenue: Math.round(totalRevenue),
        pendingOrders,
        completedOrders,
        totalLeads,
        outOfStock,
        lowStockCount: lowStock.length,
      },
      lowStockItems: lowStock,
      categoryBreakdown: categoryBreakdown.map(c => ({
        category: c.category || 'Uncategorized',
        productCount: c._count.id,
        totalStock: c._sum.stockQuantity || 0,
      })),
      recentOrders,
      recentLeads,
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
