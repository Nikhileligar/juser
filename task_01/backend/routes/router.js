import express from 'express';
import * as controller from '../controllers/controller.js';
import authenticateJwt from '../middleware.js';
import multer from 'multer';
import path from 'path';
import {io} from '../app.js'
let Storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req,file,cb) {
        cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
})

let fileUpload = multer({
    storage: Storage
}).single('file')


const router = express.Router();
// router.use(express.static(__dirname+"./uploads"))
router.route('/signUp').post(fileUpload,(req,res) =>  controller.signup(req, res, io));
router.route('/signIn').post( (req,res) => controller.signIn(req, res, io));
router.route('/verify').post((req,res) => controller.verifyEmail(req,res,io));

router.route('/getUsersById/:id').get(controller.getUsersById);

router.route('/admin/signUp').post((req,res) => controller.adminSignup(req, res,io));
router.route('/admin/signIn').post((req, res) => controller.adminSignIn(req, res,io));


router.use(authenticateJwt);
router.route('/admin/getUsers').get(controller.getUsers);
router.route('/admin/download/:fileName').get(controller.downloadImage);
// router.route('/signout').post(controller.SignOut);
export default router;
