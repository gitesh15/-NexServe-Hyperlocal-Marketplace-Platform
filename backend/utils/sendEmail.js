const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, otp) => {
  try {
    const response = await resend.emails.send({
      from: "NexServe <onboarding@resend.dev>",

      to: email,

      subject: "NexServe Email Verification OTP",

      html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>NexServe Verification</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>Valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("EMAIL SENT:", response);
  } catch (error) {
    console.log("EMAIL ERROR:", error);

    throw error;
  }
};

module.exports = sendEmail;
