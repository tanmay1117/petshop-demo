import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const active = searchParams.get('active');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (active === 'true') {
      where.isActive = true;
    }

    // Build sort
    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (sort) {
      case 'price-asc': orderBy = { price: 'asc' }; break;
      case 'price-desc': orderBy = { price: 'desc' }; break;
      case 'name': orderBy = { name: 'asc' }; break;
      case 'stock': orderBy = { stockQuantity: 'desc' }; break;
      case 'oldest': orderBy = { createdAt: 'asc' }; break;
      default: orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    // If no pagination params, return flat array for backward compat
    if (!searchParams.has('page')) {
      return NextResponse.json(products);
    }

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Auto-generate SKU and barcode if not provided
    const sku = body.sku || `SKU-${Date.now().toString(36).toUpperCase()}`;
    const barcode = body.barcode || `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(0, 13);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        costPrice: body.costPrice ? parseFloat(body.costPrice) : null,
        stockQuantity: parseInt(body.stockQuantity, 10),
        minStock: body.minStock ? parseInt(body.minStock, 10) : 5,
        imageUrl: body.imageUrl || null,
        sku,
        barcode,
        category: body.category || null,
        brand: body.brand || null,
        weight: body.weight ? parseFloat(body.weight) : null,
        unit: body.unit || null,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
