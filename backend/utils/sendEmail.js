const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "NexServe Email Verification OTP",

      html: `
        <div style="font-family:sans-serif">
          <h2>NexServe Verification</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>Valid for 5 minutes.</p>
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
