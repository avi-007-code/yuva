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
    service: 'gmail',
    auth: {
      user,
      pass,
    },
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
  const senderEmail = process.env.EMAIL_USER || process.env.APP_MAIL || 'noreply@clubmanager.com';

  const mailOptions = {
    from: `"Club Event Manager" <${senderEmail}>`,
    to: toEmail,
    subject: 'Invitation to Join as Club Manager',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5;">Welcome to Club Event Manager</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>You have been invited to join the platform as a Club Manager. Please click the button below to complete your registration and set your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="background-color: #4F46E5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Accept Invitation & Set Password</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${inviteLink}">${inviteLink}</a></p>
        <p style="color: #6b7280; font-size: 0.9em; margin-top: 20px;">Note: This invitation link will expire in 48 hours.</p>
      </div>
    `,
  };

  const transporter = createTransporter();
  await transporter.sendMail(mailOptions);
};

const sendManagerPasswordResetOtp = async (toEmail, name, otp) => {
  const senderEmail = process.env.EMAIL_USER || process.env.APP_MAIL || 'noreply@clubmanager.com';
  const mailOptions = {
    from: `"Club Event Manager" <${senderEmail}>`,
    to: toEmail,
    subject: 'Your manager password reset code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5;">Password Reset Request</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Use the following one-time code to reset your manager password:</p>
        <p style="font-size: 32px; letter-spacing: 8px; font-weight: bold; text-align: center; color: #111827;">${otp}</p>
        <p>This code expires in 10 minutes. If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  const transporter = createTransporter();
  await transporter.sendMail(mailOptions);
};

const sendDeletionVerificationCode = async (toEmail, name, code) => {
  const senderEmail = process.env.EMAIL_USER || process.env.APP_MAIL || 'noreply@clubmanager.com';
  const mailOptions = {
    from: `"Club Event Manager" <${senderEmail}>`,
    to: toEmail,
    subject: 'Deletion verification code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4F46E5;">Confirm destructive action</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Use this one-time verification code to confirm the deletion you requested:</p>
        <p style="font-size: 32px; letter-spacing: 8px; font-weight: bold; text-align: center; color: #111827;">${code}</p>
        <p>This code expires in 10 minutes. If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  const transporter = createTransporter();
  await transporter.sendMail(mailOptions);
};

module.exports = { sendInviteEmail, sendManagerPasswordResetOtp, sendDeletionVerificationCode };
