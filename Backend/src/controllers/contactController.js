import { sendEmail } from '../utils/email.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `[Training Cave Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">New Contact Form Submission</h2>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:8px 0; color:#94a3b8; width:100px;">Name</td><td style="padding:8px 0; color:#fff;">${name}</td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8;">Email</td><td style="padding:8px 0; color:#fff;"><a href="mailto:${email}" style="color:#f59e0b;">${email}</a></td></tr>
            <tr><td style="padding:8px 0; color:#94a3b8;">Subject</td><td style="padding:8px 0; color:#fff;">${subject}</td></tr>
          </table>
          <hr style="border-color:#334155; margin:16px 0;" />
          <p style="color:#94a3b8; margin-bottom:8px;">Message:</p>
          <p style="color:#e2e8f0; white-space:pre-wrap;">${message}</p>
          <hr style="border-color:#334155; margin:16px 0;" />
          <p style="color:#64748b; font-size:12px;">Sent from Training Cave contact form on ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    // Send auto-reply to the sender
    await sendEmail({
      to: email,
      subject: 'We received your message — Training Cave',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Thanks for reaching out, ${name}!</h2>
          <p style="color:#e2e8f0;">We've received your message and will get back to you within 24–48 hours.</p>
          <p style="color:#94a3b8;"><strong style="color:#e2e8f0;">Your subject:</strong> ${subject}</p>
          <p style="color:#64748b; font-size:13px; margin-top:24px;">
            If you have further questions, reply to this email or reach us at
            <a href="mailto:${process.env.ADMIN_EMAIL}" style="color:#f59e0b;">${process.env.ADMIN_EMAIL}</a>
          </p>
          <p style="color:#64748b; font-size:13px;">Best regards,<br>Training Cave Team</p>
        </div>
      `,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
};
