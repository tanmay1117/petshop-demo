// Discord Webhook Integration

export async function sendDiscordNotification(message: string, embeds?: Record<string, unknown>[]): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.includes('YOUR_')) {
    console.log('[DISCORD STUB] Would send:', message);
    return true;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: message,
        embeds: embeds || [],
        username: '🐾 Petshop Demo Bot',
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('[DISCORD] Failed:', error);
    return false;
  }
}

export function newOrderEmbed(orderNumber: string, total: number, customer: string) {
  return [{
    title: '🛒 New Order!',
    color: 0xff5e3a,
    fields: [
      { name: 'Order', value: orderNumber, inline: true },
      { name: 'Total', value: `₹${total}`, inline: true },
      { name: 'Customer', value: customer, inline: true },
    ],
    timestamp: new Date().toISOString(),
  }];
}
