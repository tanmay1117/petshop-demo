// Email Integration (SendGrid / Resend / Nodemailer)

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@petshopdemo.com';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const host = process.env.EMAIL_SERVER_HOST;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;

  if (!host || !user || !pass || user.includes('your-email')) {
    console.log('[EMAIL STUB] Would send email:', { to: options.to, subject: options.subject });
    return true; // Dev mode - pretend it worked
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('[EMAIL] Failed:', error);
    return false;
  }
}

export function orderConfirmationEmail(orderNumber: string, total: number) {
  return {
    subject: `Order Confirmed - ${orderNumber} | Petshop Demo`,
    html: `<div style="font-family:Arial;max-width:600px;margin:0 auto">
      <h1 style="color:#ff5e3a">🐾 Order Confirmed!</h1>
      <p>Your order <strong>${orderNumber}</strong> has been placed successfully.</p>
      <p>Total: <strong>₹${total.toLocaleString('en-IN')}</strong></p>
      <p>Thank you for shopping with Petshop Demo!</p>
    </div>`,
  };
}
