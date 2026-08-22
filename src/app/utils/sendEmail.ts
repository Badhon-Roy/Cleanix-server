import nodemailer from 'nodemailer';
import config from '../../config';

export interface ISendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: ISendEmailOptions) => {
  // Extract 6-digit OTP code from html if present for high-visibility terminal logging
  const otpMatch = html.match(/>(\d{6})</);
  const otpCode = otpMatch ? otpMatch[1] : 'N/A';

  console.log(`\n=============================================================`);
  console.log(`📧 [CLEANIX EMAIL / OTP DISPATCH]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`🔑 6-Digit OTP Code: ${otpCode}`);
  console.log(`=============================================================\n`);

  if (!config.smtp_user || !config.smtp_pass) {
    console.log(
      `⚠️ [SMTP CONFIGURATION NOTICE] SMTP_USER or SMTP_PASS is missing in .env. Real email delivery skipped, but OTP [${otpCode}] was logged above for testing.`,
    );
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: config.smtp_host as string,
    port: Number(config.smtp_port),
    secure: Number(config.smtp_port) === 465,
    auth: {
      user: config.smtp_user as string,
      pass: config.smtp_pass as string,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: config.smtp_from as string,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [EMAIL SENT SUCCESSFULLY] MessageID: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error('❌ [NODEMAILER ERROR] Failed to send email via SMTP:', error?.message || error);
    throw new Error(`Failed to deliver OTP email: ${error?.message || 'SMTP server error'}`);
  }
};

export const generateOTPEmailHTML = (name: string, otp: string) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
        <h2 style="color: #11233F; margin: 0; font-size: 28px; font-weight: 800; tracking-tight: -0.5px;">Cleanix</h2>
        <p style="color: #007eff; margin: 4px 0 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Field & Space Automation Ecosystem</p>
      </div>

      <div style="padding: 24px 0;">
        <h3 style="color: #11233F; font-size: 20px; font-weight: 700; margin-top: 0;">Email Verification Code (OTP)</h3>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">Your 6-digit Verification Code (OTP) for Cleanix is:</p>

        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; background-color: #f0f7ff; border: 2px dashed #007eff; border-radius: 12px; padding: 16px 36px;">
            <span style="font-size: 36px; font-weight: 800; color: #007eff; letter-spacing: 8px; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #dc2626; font-size: 12px; font-weight: 600; margin-top: 12px;">Note: This code is valid for 5 minutes only.</p>
        </div>

        <p style="color: #475569; font-size: 14px; line-height: 1.6;">If you did not request this verification code, please ignore this message.</p>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Cleanix Automation Platform. All rights reserved.</p>
      </div>
    </div>
  `;
};
