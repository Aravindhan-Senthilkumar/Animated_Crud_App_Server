import express from 'express'
import { loginUser, registerUser,generateToken, otpGeneration, verifyOtp,resetPassword } from '../controllers/authControllers.js';

const router = express.Router();

router.get('/',(req,res) => {
    res.send("Server is running")
})

router.post('/register',registerUser);

router.post('/login',loginUser);

router.post('/generateToken',generateToken);

router.post('/forgotPassword',otpGeneration);

router.post('/verifyOTP',verifyOtp);

router.post('/resetPassword',resetPassword);

export default router