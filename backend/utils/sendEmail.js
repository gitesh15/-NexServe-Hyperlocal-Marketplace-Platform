const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"NexServe" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "NexServe Email Verification OTP",

      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>NexServe Verification</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("EMAIL SENT:", info.response);
  } catch (error) {
    console.log("EMAIL ERROR:", error);

    throw error;
  }
};

module.exports = sendEmail;
