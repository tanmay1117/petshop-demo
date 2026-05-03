// SMS Integration (Twilio)

export async function sendSMS(to: string, message: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!sid || !token || sid.startsWith('YOUR_')) {
    console.log('[SMS STUB] Would send SMS:', { to, message: message.slice(0, 50) });
    return true;
  }

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from!, Body: message }),
    });
    return res.ok;
  } catch (error) {
    console.error('[SMS] Failed:', error);
    return false;
  }
}

export function orderOTP(otp: string) {
  return `Your Petshop Demo OTP is: ${otp}. Valid for 10 minutes.`;
}
