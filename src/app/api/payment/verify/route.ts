import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Razorpay Payment Verification Webhook
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret || secret.startsWith('YOUR_')) {
      // Dev mode - auto-verify
      return NextResponse.json({
        verified: true,
        dev_mode: true,
        payment_id: razorpay_payment_id || `pay_dev_${Date.now()}`,
      });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isVerified = expectedSignature === razorpay_signature;

    if (isVerified) {
      // TODO: Update order payment status in database
      return NextResponse.json({ verified: true, payment_id: razorpay_payment_id });
    } else {
      return NextResponse.json({ verified: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
