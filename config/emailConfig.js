import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Use App Password, not regular password
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email service error:", error);
  } else {
    console.log("Email service is ready to send messages");
  }
});

// Function to send email notification
export const sendEmailNotification = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Job Tracker" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
};

// Function for job application notifications
export const sendJobNotification = async (email, name, jobTitle, status) => {
  const subject = `Job Application Update: ${jobTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Job Tracker Notification</h2>
      <p>Hello ${name},</p>
      <p>Your application for <strong>${jobTitle}</strong> has been updated to: 
        <span style="background-color: #e0f2fe; padding: 4px 8px; border-radius: 4px;">${status}</span>
      </p>
      <p>Log in to your dashboard to see more details.</p>
      <hr style="margin: 20px 0;" />
      <p style="color: #6b7280; font-size: 12px;">You received this email because you have notifications enabled.</p>
    </div>
  `;
  return await sendEmailNotification(email, subject, html);
};

// Function for weekly digest
export const sendWeeklyDigest = async (email, name, stats) => {
  const subject = "Your Weekly Job Application Digest";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Weekly Digest for ${name}</h2>
      <p>Here's your application summary for this week:</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <ul style="list-style: none; padding: 0;">
          <li>📋 Applied: <strong>${stats.applied || 0}</strong></li>
          <li>🎯 Interviews: <strong>${stats.interview || 0}</strong></li>
          <li>🎉 Offers: <strong>${stats.offer || 0}</strong></li>
          <li>📊 Total: <strong>${stats.total || 0}</strong></li>
        </ul>
      </div>
      <p>Log in to your dashboard to update your application statuses.</p>
      <hr />
      <p style="color: #6b7280; font-size: 12px;">You received this weekly digest because you enabled it in settings.</p>
    </div>
  `;
  return await sendEmailNotification(email, subject, html);
};