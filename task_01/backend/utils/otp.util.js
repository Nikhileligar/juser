import fast2sms from "fast-two-sms";
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const generateOTP = function generateOTP (otp_length) {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// const fastSms = async function sendSms({ message, contactNumber }, next) {
//   try {
//     const res = await fast2sms.sendMessage({
//       authoriztion: process.env.SMS_API_KEY || 'bDfORML6hCW3ZYgaqo1UIxGSKu5ekJiFTldyEcwPBs70njHQVzIUWG7BSxqCLe5ybOhfun3A840NQ1kK',
//       message,
//       numbers: [contactNumber],
//     });
//     console.log(process.env.SMS_API_KEY,res,phone,'resulttt(3)');
//     if (!res) {
//       console.log(res,'error()10')
//       throw new Error('error in creating otp')
//     }
//     return res;
// } catch (error) {
//     next(error);
//   }
// };


const fastSms = async function sendSms({ message, contactNumber }, next) {
try {
    const response = await axios.get('https://www.fast2sms.com/dev/bulk', {
          params: {
            authorization: process.env.SMS_API_KEY,
            variables_values: message,
            route: 'otp',
            numbers: contactNumber
          }
        });
       console.log(process.env.SMS_API_KEY,response,phone,'resulttt(3)');

        if (!response) {
          return response;
        }
    return res.json({ success: true, message: 'OTP sent successfully!' });
  } catch (err) {
    next(err);
  }
}

export {fastSms, generateOTP};
