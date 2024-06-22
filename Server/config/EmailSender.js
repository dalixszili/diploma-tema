import nodemailer from "nodemailer";

const EmailSender = async (email, subject, html) => {
  //   console.log(process.env.EMAIL_USER);
  //   console.log(process.env.EMAIL_PASSWORD);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html,
    });
    console.log("Email sent Succesfully !");
  } catch (error) {
    console.log("Email not sent ! ERROR: " + error);
  }
};

export default EmailSender;
