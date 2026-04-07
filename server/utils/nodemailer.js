const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: Number(process.env.SMTP_PORT), // fix
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME, // fixed
        pass: process.env.SMTP_PASSWORD, // fixed
      },
    });

    const mailOptions = {
      from: `ONetwork Forum <${process.env.SMTP_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email error:", error.message);
  }
};

module.exports = sendEmail;