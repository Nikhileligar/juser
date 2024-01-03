import nodemailer from 'nodemailer';
import express from 'express';
import dotenv from 'dotenv';


dotenv.config();

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

console.log(EMAIL,PASSWORD,'cred')
const MAIL_SETTINGS = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: EMAIL,
      pass: PASSWORD,
  },
};
console.log(EMAIL,'process.env.EMAIL(6)');

const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const sendMail = async (params) => {
  try {
    console.log(params,'pparams----->');
    let info = await transporter.sendMail({
      from: MAIL_SETTINGS.auth.user,
      to: params.to,
      subject: 'Hello ✔',
      html: `
      <div
        class="container"
        style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>Welcome to the club.</h2>
        <h4>You are officially In ✔</h4>
        <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${params.OTP}</h1>
   </div>
    `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default sendMail;
