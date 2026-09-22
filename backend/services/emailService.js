const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create Nodemailer transport using Gmail service
const createTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.APP_MAIL;
  const pass = process.env.EMAIL_APP_PASSWORD || process.env.APP_PASSWORD;

  if (!user || !pass) {
    console.warn(
      'Warning: EMAIL_USER / EMAIL_APP_PASSWORD not fully configured in .env. Email sending may fail.'
    );
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
};

/**
 * Sends a Manager Invite Email
 * @param {string} toEmail - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} inviteToken - Generated invitation token
 */
const sendInviteEmail = async (toEmail, name, inviteToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const inviteLink = `${frontendUrl}/accept-invite/${inviteToken}`;
  const senderEmail = process.env.EMAIL_USER || process.env.APP_MAIL || 'noreply@4thepeople.com';

  const mailOptions = {
    from: `"4 THE PEOPLE" <${senderEmail}>`,
    to: toEmail,
    subject: 'Welcome to 4 THE PEOPLE - Invitation to Join as Club Manager',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0B0F17; color: #F8FAFC; border: 1px solid #1E293B; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 34px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px; margin: 0; font-family: 'Syne', Arial, sans-serif;">
            <span style="color: #FF5733;">4</span> THE PEOPLE<span style="color: #FF5733;">.</span>
          </h1>
          <p style="color: #FF5733; font-size: 11px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px;">Campus Events & Club Manager</p>
        </div>
        <h2 style="color: #FFFFFF; font-size: 20px; font-weight: 800; margin-top: 0;">Welcome to 4 THE PEOPLE</h2>
        <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">Hello <strong style="color: #F8FAFC;">${name}</strong>,</p>
        <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">You have been invited to join the platform as a <strong>Club Manager</strong>. Please click the button below to complete your registration and set your password:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteLink}" style="background-color: #FF5733; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">Accept Invitation & Set Password</a>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;"><a href="${inviteLink}" style="color: #3B82F6; text-decoration: underline;">${inviteLink}</a></p>
        <p style="color: #64748B; font-size: 12px; margin-top: 24px; border-t: 1px solid #1E293B; padding-top: 16px;">Note: This invitation link will expire in 48 hours.</p>
      </div>
    `,
  };

  const transporter = createTransporter();
  await transporter.sendMail(mailOptions);
};

const sendManagerPasswordResetOtp = async (toEmail, name, otp) => {
  const senderEmail = process.env.EMAIL_USER || process.env.APP_MAIL || 'noreply@4thepeople.com';
  const mailOptions = {
    from: `"4 THE PEOPLE" <${senderEmail}>`,
    to: toEmail,
    subject: '4 THE PEOPLE Manager Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0B0F17; color: #F8FAFC; border: 1px solid #1E293B; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 34px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px; margin: 0; font-family: 'Syne', Arial, sans-serif;">
            <span style="color: #FF5733;">4</span> THE PEOPLE<span style="color: #FF5733;">.</span>
          </h1>
        </div>
        <h2 style="color: #FFFFFF; font-size: 20px; font-weight: 800; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #94A3B8; font-size: 14px;">Hello <strong style="color: #F8FAFC;">${name}</strong>,</p>
        <p style="color: #94A3B8; font-size: 14px;">Use the following one-time code to reset your manager password:</p>
        <p style="font-size: 36px; letter-spacing: 8px; font-weight: 900; text-align: center; color: #FF5733; margin: 24px 0;">${otp}</p>
        <p style="color: #64748B; font-size: 12px;">This code expires in 10 minutes. If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  const transporter = createTransporter();
  await transporter.sendMail(mailOptions);
};

const sendDeletionVerificationCode = async (toEmail, name, code) => {
  const senderEmail = process.env.EMAIL_USER || process.env.APP_MAIL || 'noreply@4thepeople.com';
  const mailOptions = {
    from: `"4 THE PEOPLE" <${senderEmail}>`,
    to: toEmail,
    subject: '4 THE PEOPLE Deletion Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0B0F17; color: #F8FAFC; border: 1px solid #1E293B; border-radius: 20px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="font-size: 34px; font-weight: 900; color: #FFFFFF; letter-spacing: 2px; margin: 0; font-family: 'Syne', Arial, sans-serif;">
            <span style="color: #FF5733;">4</span> THE PEOPLE<span style="color: #FF5733;">.</span>
          </h1>
        </div>
        <h2 style="color: #FFFFFF; font-size: 20px; font-weight: 800; margin-top: 0;">Confirm Destructive Action</h2>
        <p style="color: #94A3B8; font-size: 14px;">Hello <strong style="color: #F8FAFC;">${name}</strong>,</p>
        <p style="color: #94A3B8; font-size: 14px;">Use this one-time verification code to confirm deletion:</p>
        <p style="font-size: 36px; letter-spacing: 8px; font-weight: 900; text-align: center; color: #EF4444; margin: 24px 0;">${code}</p>
        <p style="color: #64748B; font-size: 12px;">This code expires in 10 minutes.</p>
      </div>
    `,
  };

  const transporter = createTransporter();
  await transporter.sendMail(mailOptions);
};

module.exports = { sendInviteEmail, sendManagerPasswordResetOtp, sendDeletionVerificationCode };
