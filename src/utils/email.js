const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * SEND EMAIL
 * @param {string} to 
 * @param {string} subject 
 * @param {string} html 
 */
exports.sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Ecommerce Store" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("📧 Email Sent To:", to);
};
