/**
 * SAHELI — Real Email Delivery Service
 * Supports Resend (HTTPS API), SendGrid (HTTPS API), and Standard SMTP (via nodemailer).
 * Strictly adheres to production security: no hardcoded secrets, robust error reporting.
 */

import nodemailer from 'nodemailer';

function getEmailConfig() {
  return {
    provider: (process.env.EMAIL_PROVIDER || 'resend').toLowerCase(),
    from: process.env.EMAIL_FROM || 'SAHELI Safety <onboarding@resend.dev>',
    appUrl: process.env.APP_URL || 'http://localhost:5173',
    apiUrl: process.env.API_URL || 'http://localhost:5000',
    resendApiKey: process.env.RESEND_API_KEY || '',
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };
}

/**
 * Deliver email via Resend HTTPS API (zero extra dependencies, fast & reliable)
 */
async function sendViaResend({ from, to, subject, html, text, apiKey }) {
  if (!apiKey) {
    return {
      delivered: false,
      error: 'RESEND_API_KEY_MISSING',
      message: 'RESEND_API_KEY is not configured in .env',
    };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data.message || `Resend API returned status ${res.status}`;
    console.error('[EmailService] Resend delivery error:', errorMsg);
    return { delivered: false, error: errorMsg };
  }

  return { delivered: true, messageId: data.id };
}

/**
 * Deliver email via SendGrid v3 API
 */
async function sendViaSendGrid({ from, to, subject, html, text, apiKey }) {
  if (!apiKey) {
    return {
      delivered: false,
      error: 'SENDGRID_API_KEY_MISSING',
      message: 'SENDGRID_API_KEY is not configured in .env',
    };
  }

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from.includes('<') ? from.replace(/.*<([^>]+)>.*/, '$1') : from },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[EmailService] SendGrid delivery error:', errText);
    return { delivered: false, error: errText };
  }

  return { delivered: true };
}

/**
 * Deliver email via standard SMTP (Gmail, Brevo, Outlook, custom)
 */
async function sendViaSMTP({ from, to, subject, html, text, smtpConfig }) {
  if (!smtpConfig.host || !smtpConfig.user) {
    return {
      delivered: false,
      error: 'SMTP_CREDENTIALS_MISSING',
      message: 'SMTP_HOST or SMTP_USER is not configured in .env',
    };
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
    return { delivered: true, messageId: info.messageId };
  } catch (err) {
    console.error('[EmailService] SMTP delivery error:', err.message);
    return { delivered: false, error: err.message };
  }
}

/**
 * Main dispatch handler
 */
export async function sendEmail({ to, subject, html, text }) {
  const cfg = getEmailConfig();

  if (cfg.provider === 'resend') {
    return sendViaResend({
      from: cfg.from,
      to,
      subject,
      html,
      text,
      apiKey: cfg.resendApiKey,
    });
  }

  if (cfg.provider === 'sendgrid') {
    return sendViaSendGrid({
      from: cfg.from,
      to,
      subject,
      html,
      text,
      apiKey: cfg.sendgridApiKey,
    });
  }

  if (cfg.provider === 'smtp') {
    return sendViaSMTP({
      from: cfg.from,
      to,
      subject,
      html,
      text,
      smtpConfig: cfg.smtp,
    });
  }

  return {
    delivered: false,
    error: 'UNKNOWN_EMAIL_PROVIDER',
    message: `Unsupported EMAIL_PROVIDER: ${cfg.provider}. Use 'resend', 'sendgrid', or 'smtp'.`,
  };
}

/**
 * Deliver Real Account Verification Email
 */
export async function sendVerificationEmail({ to, name, token }) {
  const cfg = getEmailConfig();
  const verifyUrl = `${cfg.appUrl}/?verify=${encodeURIComponent(token)}`;
  const directApiUrl = `${cfg.apiUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  const subject = 'Verify your SAHELI Account';
  const text = `Hello ${name || 'there'},\n\nThank you for creating an account on SAHELI Women Safety & Emergency Assistance Platform.\n\nPlease verify your email address by clicking the link below:\n${verifyUrl}\n\nAlternatively, you can manually enter your verification code in the app:\n${token}\n\nThis verification link expires in 24 hours.\n\nIf you did not request this account, please disregard this message.\n\nStay safe,\nSAHELI Engineering & Safety Team`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <tr>
      <td style="padding: 32px 32px 24px 32px; background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); text-align: center;">
        <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: rgba(55, 88, 249, 0.2); border: 1px solid rgba(55, 88, 249, 0.4); line-height: 48px; font-size: 24px;">
          🛡️
        </div>
        <h1 style="margin: 12px 0 4px 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">
          SAHELI
        </h1>
        <p style="margin: 0; color: #94A3B8; font-size: 13px; font-weight: 500;">
          Women Safety & Emergency Assistance Platform
        </p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 32px;">
        <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #0F172A;">
          Verify Your Email Address
        </h2>
        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
          Hello <strong>${name || 'there'}</strong>, thank you for joining SAHELI. To activate your account, configure your guardian circle, and access SafeWalk companion monitoring, please verify your email:
        </p>

        <!-- CTA Button -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
          <tr>
            <td align="center">
              <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background-color: #3758F9; color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: 700; border-radius: 9999px; box-shadow: 0 4px 14px rgba(55, 88, 249, 0.35);">
                Verify My Account
              </a>
            </td>
          </tr>
        </table>

        <!-- Manual Code Block -->
        <div style="background-color: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 10px; padding: 16px; margin-top: 24px; text-align: center;">
          <span style="display: block; font-size: 12px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            Or Enter This 32-Character Code In-App:
          </span>
          <code style="font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; color: #0F172A; word-break: break-all; user-select: all;">
            ${token}
          </code>
        </div>

        <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 1.5; color: #64748B;">
          This verification link expires in <strong>24 hours</strong>. If you did not create a SAHELI account, please ignore this email.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #F8FAFC; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
        © 2026 SAHELI Platform • Proactive Women Safety & Emergency Assistance<br>
        Direct verification URL: <a href="${directApiUrl}" style="color: #3758F9; text-decoration: none;">${directApiUrl}</a>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
}

/**
 * Deliver Password Reset Email
 */
export async function sendPasswordResetEmail({ to, name, token }) {
  const cfg = getEmailConfig();
  const resetUrl = `${cfg.appUrl}/?reset=${encodeURIComponent(token)}`;

  const subject = 'Reset Your SAHELI Password';
  const text = `Hello ${name || 'there'},\n\nA password reset request was received for your SAHELI account.\n\nTo reset your password, click the link below:\n${resetUrl}\n\nOr enter this reset token in the app:\n${token}\n\nThis reset link expires in 1 hour.\n\nIf you did not request this, please secure your account immediately.\n\nSAHELI Safety Team`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #F8FAFC; font-family: sans-serif; color: #0F172A;">
  <div style="max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; padding: 32px;">
    <h2 style="color: #0F172A; margin: 0 0 16px 0;">Reset Your Password</h2>
    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Hello <strong>${name || 'there'}</strong>, a request was received to reset your SAHELI account password.
    </p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background-color: #3758F9; color: #FFFFFF; text-decoration: none; font-weight: 700; border-radius: 8px;">
        Reset Password
      </a>
    </div>
    <div style="background-color: #F1F5F9; padding: 12px; border-radius: 6px; font-size: 12px; text-align: center;">
      Reset Token: <code>${token}</code>
    </div>
    <p style="color: #64748B; font-size: 12px; margin-top: 24px;">
      This link is valid for 1 hour. If you did not make this request, please contact safety support.
    </p>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text,
  });
}
