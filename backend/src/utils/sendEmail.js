import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
export const sendEmail = async (to, subject, text) => {
  try {
 
    const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    }}
);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

