const nodemailer = require('nodemailer'); // Import nodemailer for sending emails

// Create a transporter object using SMTP transport with environment variables for configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP server host
  port: process.env.SMTP_PORT, // SMTP server port
  secure: process.env.SMTP_SECURE === 'true', // Use TLS if true (usually port 465)
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS, // SMTP password
  },
});

/**
 * Sends an OTP email to the specified recipient.
 * @param {string} to - Recipient email address.
 * @param {string} code - OTP code to send.
 */
async function sendOtpEmail(to, code) {
  // Define email options
  const mailOptions = {
    from: process.env.SMTP_FROM, // Sender address
    to, // Recipient address
    subject: 'Your OTP Code', // Email subject
    text: `Your OTP code is: ${code}. It will expire in 10 minutes.`, // Email body text
  };

  // Send the email using the transporter
  await transporter.sendMail(mailOptions);
}

// Export the sendOtpEmail function for use in other modules
module.exports = { sendOtpEmail };
