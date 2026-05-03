import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter is ready');
  }
});

// Send email function
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// Email templates

export const sendTrainerApprovedEmail = async (trainerEmail, trainerName) => {
  await sendEmail({
    to: trainerEmail,
    subject: '🎉 Your Training Cave Trainer Account is Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Welcome to Training Cave!</h2>
        <p>Hi ${trainerName},</p>
        <p>Great news! Your trainer account has been approved.</p>
        <p>You can now:</p>
        <ul>
          <li>Upload training materials</li>
          <li>Share your expertise with learners</li>
          <li>Track downloads and engagement</li>
        </ul>
        <p>
          <a href="${process.env.FRONTEND_URL}/login" 
             style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Log In Now
          </a>
        </p>
        <p>Best regards,<br>Training Cave Team</p>
      </div>
    `
  });
};

export const sendTrainerRejectedEmail = async (trainerEmail, trainerName) => {
  await sendEmail({
    to: trainerEmail,
    subject: 'Training Cave - Trainer Application Status',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Training Cave Application Update</h2>
        <p>Hi ${trainerName},</p>
        <p>Thank you for your interest in becoming a trainer on Training Cave.</p>
        <p>After reviewing your application, we are unable to approve your trainer account at this time.</p>
        <p>If you have questions or would like to reapply in the future, please contact us at ${process.env.ADMIN_EMAIL}.</p>
        <p>Best regards,<br>Training Cave Team</p>
      </div>
    `
  });
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  await sendEmail({
    to: userEmail,
    subject: '🎉 Welcome to Training Cave!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Welcome to Training Cave, ${userName}!</h2>
        <p>Your learner account has been created. You can now browse and download training materials from our library.</p>
        <p>
          <a href="${process.env.FRONTEND_URL}/learner"
             style="background-color: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Start Learning
          </a>
        </p>
        <p>Best regards,<br>Training Cave Team</p>
      </div>
    `
  });
};

export const sendMaterialUploadedNotification = async (materialTitle, trainerName) => {
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: '📤 New Training Material Uploaded',
    html: `
      <h2>New Material Upload</h2>
      <p><strong>Material:</strong> ${materialTitle}</p>
      <p><strong>Trainer:</strong> ${trainerName}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
    `
  });
};

export default sendEmail;
