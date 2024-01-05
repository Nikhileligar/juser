import { dbConfig } from "../dbConfig/config.js";
import Admin from "../model/adminSchema.js";
import User from "../model/userSchema.js";
import jwt  from "jsonwebtoken";
import { generateOTP, fastSms } from "../utils/otp.util.js";
import sendMail from "../utils/mailer.js";
import mongoose from 'mongoose';
import { saveFile } from "../utils/fileService.js";
import { v4 as uuidv4 } from 'uuid';
import axios  from 'axios';
// import { encrypt, compare } from "../services/crypto";

dbConfig()

const signup = async function signup (req,res,io) {
    try {
        // console.log(req.body.data,req.file,'1 req.body.body');
        // const {name, email, password, phone} = JSON.parse(req.body.data);
        const {name, email, password, phone} = req.body;
        const fileId = req.file.filename;
        console.log(phone,name,fileId,'name(1)');
        const validateUserExists = await findUserByEmail(email);
        if (!(phone[0] === '6' || phone[0] === '7' || phone[0] === '8' || phone[0] === '9')) {
            return res.status(400).json({
                message: 'invalid phone number',
                phone
            })
        }

        console.log(phone.length,'phone length');

        if (validateUserExists?.length > 0) {
            throw new Error('user already exists')
        }

        const otp = generateOTP(6);
        const phoneOtp = generateOTP(6);

        const newUser = await User.create({
            email,
            name,
            userId: uuidv4(),
            password: password,
            phone,
            otp: otp,
            phoneOtp: phoneOtp,
            file: fileId
        });

        if (!newUser) {
            return res.status(400).send({
              message: "Unable to sign you up",
            });
        }

        // create user by verifying otp by email
        const sendOTP = await createUser( email, password, otp, phoneOtp, phone);
        if (!sendOTP) {
            console.log(sendOTP,'otp response')
            throw new Error('error');
        }
        
        io.emit('user_action', { action: 'signup_success', username: validateUserExists.name });
    
        res.status(201).json({
            message: `${name} signed up successfully and otp has been sent to your registerd mobile number`,
            success: true,
            body: {
                newUser
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
}
  

// to verify email user
const verifyEmail = async function (req, res, io) {
    try{
        const { email, otp } = req.body;
        console.log(email,otp,'serverend');

        const user = await findUserByEmail(email);
        console.log(user,'userrrrrr');

        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        if (user && user.otp !== otp) {
            return [false, "Invalid OTP"];
        }

        io.emit('user_action', { action: 'verification_success', username: user.name });
        return res.status(201).json({
            message:'user successfully verified',
            email
        });

      } catch (err) {
        console.log(err,'ererer')
        return res.status(500).json({
            message: 'internal srver err',
            error: err
        })
      }
    }
    
  
const findUserByEmail = async (email) => {
   const user = await User.findOne({
     email,
   });
   if (!user) {
     return false;
   }
   return user;
};
  
const createUser = async ( email, password, otp, phoneOtp, phone ) => {
    console.log(otp,email,password,phoneOtp,'otp------>>>');
    try {
        const emailSent = await sendMail({
          to: email,
          OTP: otp,
        });

        const msgSent = await fastSms({
            message: `your one time password is ${phoneOtp}`,
            phone
        });

        if(!emailSent) {
            console.log(emailSent,'emailSent------>');
            throw new Error('error in sending otp to email');
        }

        if(!msgSent) {
            console.log(msgSent,'msgsent------>');
            throw new Error('error in sending otp to phone');
        }

        return true;
    } catch (error) {
        return [false, "Unable to sign up, Please try again later", error];
    }
};


//
const uploadFile = async function (req,res) {
    try {
        return res.json({
            message: 'file uploaded successfully'
        })
    } catch (err) {
        console.log(err);
    }
}

const signIn = async function signIn(req,res,io) {
    try {
        const { password, phone } = req.body;
        console.log(password,phone,'name(1)');

        if (!(phone[0] === '6' || phone[0] === '7' || phone[0] === '8' || phone[0] === '9')) {
            console.log(phone.length, phone[0], 'name(1)');
            return res.status(400).json({
                message: 'Invalid phone number',
                phone
            });
        }

        const validateUserExists = await User.findOne({phone});
        console.log(validateUserExists,'valid');

        if (validateUserExists.length == 0) {
            // User not found
            return res.status(401).json({
                message: 'user doesnt exists in db'
            });
        }

        if (password !== validateUserExists.password) {
            // Incorrect password
            return res.status(401).json({
                message: 'Unauthorized user'
            });
        }

        console.log(phone.length,validateUserExists.name,'phone length');
        const name = validateUserExists.name;

        
        const token = `Bearer ${generateAuthToken(validateUserExists)}`;
        res.cookie("token",token,{
            httpOnly: true
        });

        const i = io.emit('user_action', { action: 'login_success', username: phone });
        console.log(i,'iiiii')
        res.status(201).json({
            message: `${validateUserExists.name} signed in successfully`,
            success: true,
            body: {
                validateUserExists,
                token
            }
        })

    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

// Admin signup to admin panel
const adminSignup = async function adminSignup (req,res, io) {
    try {
        const {name, email, password, role} = req.body;
        console.log(req.body.name,'name(1)');

        const validateUserExists = await Admin.findOne({email});
        if (validateUserExists) {
            throw new Error(`admin with name: ${name} user already exists`)
        }
        const newUser = new Admin ({
            name,
            email,
            password,
            role
        });
        console.log(newUser,'6566')
        const savedData = await newUser.save();
        console.log(savedData,'data saved successfully (1)');
        if(!savedData) {
            throw new Error ('internal server error');
        }
        io.emit('user_action', { action: 'admin_signup_success', username: name });
        return res.status(201).json({
            message: `Admin signed up successfully`,
            success: true,
            body: {
                email,
                name,
                role
            }
        })

    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

// Admin sigIn with authorized role
const adminSignIn = async function adminSignIn(req,res, io) {
    try {
        const { password, email } = req.body;
        console.log(email,password,'name(1)');
        const validateUserExists = await Admin.findOne({email});
        if(password !== validateUserExists.password) {
            return res.status(401).json({
                message: 'unauthorized user'
            })
        }
        const token = `Bearer ${generateAdminAuthToken(validateUserExists)}`;
        res.cookie("token",token,{
            httpOnly: true
        });

        console.log(token,'token');

        io.emit('user_action', { action: 'admin_login_success', username: validateUserExists.name });
        
        
        return res.status(201).json({
            message: `${validateUserExists.name} signed in successfully`,
            success: true,
            token,
        })

    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

// Role with admin can only view the records from db
const getUsers = async function getUsers(req,res) {
    try {
        if (req.user && req.user.role === 'admin') {
        const users = await User.find();
        console.log(users);
        return res.status(200).json({
            body: {
                users
            }
        })
    }
    } catch (err) {
        console.log(err,'err')
        throw new Error('unauthorized')
    }
}

const getUsersById = async function (req, res) {
    try {
        const {id: userId} = req.params;
        const user = await User.findOne({userId});

        if (user.length === 0) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        return res.status(200).json({
            user
        })
    } catch (err) {
        res.status(500).json({
            message: 'error in retrieving user details'
        })
    }

}


const downloadImage = async function downloadImage (req,res) {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, '../uploads/', fileName);
        return res.download(filePath, (err) => {
            if (err) {
              res.status(404).json({ message: 'File not found' });
            }
          });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Admin token 
const generateAdminAuthToken = (admin) => {
    const JWT_SECRET = 'admin';
    const token = jwt.sign({ id: admin.userId, name: admin.name, role: admin.role }, JWT_SECRET, {
      expiresIn: '1h',
    });
    return token;
  };

// user token
const generateAuthToken = (user) => {
    const JWT_SECRET = 'user';
    const token = jwt.sign({ id: user.userId, name: user.name }, JWT_SECRET, {
      expiresIn: '1h',
    });
    return token;
};


// const verifyPhoneOtp = async function verifyPhoneOtp (req, res, next) {
//     try {
//       const { otp, userId } = req.body;
//       const user = await User.findById(userId);
//       if (!user) {
//         next({ status: 400, message: USER_NOT_FOUND_ERR });
//         return;
//       }
  
//       if (user.phoneOtp !== otp) {
//         next({ status: 400, message: INCORRECT_OTP_ERR });
//         return;
//       }
//       const token = createJwtToken({ userId: user._id });
  
//       user.phoneOtp = "";
//       await user.save();
  
//       res.status(201).json({
//         type: "success",
//         message: "OTP verified successfully",
//         data: {
//           token,
//           userId: user._id,
//         },
//       });
//     } catch (error) {
//       next(error);
//     }
//   };

export {signup, signIn, adminSignup, adminSignIn, getUsers, uploadFile, downloadImage, verifyEmail, getUsersById};
