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

export const generateCleanerApprovalEmailHTML = (name: string, email: string) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #f1f5f9;">
        <div style="display: inline-block; width: 48px; height: 48px; background-color: #007eff; color: white; font-size: 24px; font-weight: 900; line-height: 48px; border-radius: 14px;">C</div>
        <h2 style="color: #0d274c; margin: 12px 0 0 0; font-size: 26px; font-weight: 800; tracking-tight: -0.5px;">Cleanix</h2>
        <p style="color: #007eff; margin: 4px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Certified Field Service Staff Portal</p>
      </div>

      <div style="padding: 32px 0; text-align: left;">
        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <h3 style="color: #065f46; font-size: 20px; font-weight: 800; margin: 0;">🎉 Congratulations! Your Staff Account is Approved</h3>
          <p style="color: #047857; font-size: 13px; margin: 6px 0 0 0; font-weight: 600;">Cleanix Admin HQ has verified & activated your cleaner profile.</p>
        </div>

        <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">We are thrilled to inform you that your application for <strong>Cleanix Certified Cleaner Staff</strong> has been officially reviewed and <strong>APPROVED</strong> by the management team.</p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
          <h4 style="color: #0d274c; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Account Overview & Access Credentials:</h4>
          <p style="color: #475569; font-size: 13px; margin: 4px 0;"><strong>Registered Email:</strong> ${email}</p>
          <p style="color: #475569; font-size: 13px; margin: 4px 0;"><strong>Account Status:</strong> <span style="color: #059669; font-weight: 700;">APPROVED / ACTIVE</span></p>
          <p style="color: #475569; font-size: 13px; margin: 4px 0;"><strong>Portal Access:</strong> Certified Cleaner Dispatch Portal</p>
        </div>

        <p style="color: #475569; font-size: 14px; line-height: 1.6;">You can now log into the Cleanix Field Dispatch Portal with your email and password to view assigned jobs, update shift status, and access payouts.</p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="http://localhost:3000/login" style="display: inline-block; background-color: #007eff; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 14px; box-shadow: 0 4px 12px rgba(0,126,255,0.3);">Login to Cleaner Portal ➔</a>
        </div>

        <p style="color: #64748b; font-size: 13px; line-height: 1.6;">If you have any questions or need assistance with your dispatch schedule, please reach out to Cleanix Support at support@cleanix.com.</p>
      </div>

      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Cleanix Automation Platform. All rights reserved.</p>
      </div>
    </div>
  `;
};
