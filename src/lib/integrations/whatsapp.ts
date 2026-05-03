// WhatsApp Business API Integration

export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  const token = process.env.WHATSAPP_BUSINESS_API_TOKEN;

  if (!token || token.startsWith('YOUR_')) {
    console.log('[WHATSAPP STUB] Would send:', { to, message: message.slice(0, 50) });
    return true;
  }

  try {
    const res = await fetch('https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: message },
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('[WHATSAPP] Failed:', error);
    return false;
  }
}

export function orderConfirmationWhatsApp(orderNumber: string, total: number) {
  return `🐾 *Petshop Demo*\n\n✅ Order Confirmed!\nOrder: ${orderNumber}\nTotal: ₹${total}\n\nThank you for shopping with us!`;
}
