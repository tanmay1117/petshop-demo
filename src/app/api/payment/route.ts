import { NextResponse } from 'next/server';

// Razorpay integration (test mode)
// In production, use: import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt } = body;

    // For dev/test mode without actual Razorpay keys:
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.startsWith('YOUR_')) {
      // Return a mock order for development
      return NextResponse.json({
        id: `order_dev_${Date.now()}`,
        amount: amount * 100, // amount in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        dev_mode: true,
        message: 'Development mode - add Razorpay keys to .env for real payments',
      });
    }

    // Real Razorpay integration
    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Payment order creation failed:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
