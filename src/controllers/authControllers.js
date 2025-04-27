import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodeMailer from 'nodemailer'
import crypto from 'crypto'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerUser = async (req,res) => {
    const {name,email,password} = req.body;

    if(!name || !email || !password){
      return res.status(404).json({message:"Please fill up all credentials"})
    }

    if(!emailRegex.test(email)){
      return res.status(404).json({message:"Invalid email format"})
    }

    try{
        const existingUser = await User.findOne({email})

        if(existingUser){
           return res.status(400).json({message:'User already registered with this email id'})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
          });

        await newUser.save();

        const token = jwt.sign({email:newUser.email},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})

        res.status(201).json({ message: "User registered successfully",token });
    }catch(error){
        res.status(500).json({message:'Error in internal server while registering'})
    }
}

export const loginUser = async (req,res) => {
    const { email,password } = req.body;

    if(!email || !password){
      return res.status(404).json({message:"Please fill up all credentials"})
    }

    if(!emailRegex.test(email)){
      return res.status(404).json({message:"Invalid email format"})
    }

    try{
      const user = await User.findOne({email})

      if(!user){
        return res.status(404).json({message:"You must be new user"})
      }

      const isVerified = await bcrypt.compare(password,user.password) 

      if(!isVerified){
        return res.status(400).json({message:"Incorrect password"})
      }

      const token = jwt.sign({email:user.email},process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
      
      res.status(201).json({message:"Successfully logged in",token})
    }catch(error){
      res.status(500).json({message:'Error in internal server while logging in'})
    }
}

export const generateToken = async (req,res) => {
  const { token } = req.body;

  if(token === undefined){
    return res.status(404).json({message:"Refresh token not found"})
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const newToken = jwt.sign(
      { email: decodedToken.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: "Token generated successfully", newToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export const otpGeneration =  async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Please provide email id' });
  }

  if(!emailRegex.test(email)){
    return res.status(404).json({message:"Invalid email format"})
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found,please check with your email id' });
    }


    // Generating OTP using crypto
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP
    user.otpExpiresTime = Date.now() + 10 * 60 * 1000;

    await user.save();

    const transporter = nodeMailer.createTransport({
      service:'Gmail',
      auth:{
        user:process.env.EMAIL_ID,
        pass:process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({
      from:process.env.EMAIL_ID,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    })

    res.status(200).json({message:"OTP Sent successfully"})
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error in internal server while sending OTP' });
  }
}

export const verifyOtp =async(req,res) => {
  const {otp,email} = req.body;

  try{
    const user = await User.findOne({email})

    if(!user){
      return res.status(404).json({message:"User not found with this email id"})
    }

     //Check if OTP is expired
     if(Date.now() > user.otpExpiresTime) {
      return res.status(400).json({ message: "OTP has expired" });
    }

  //Check if the otp is valid or not
  const isValid = await bcrypt.compare(otp,user.otp)
  if(!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
  }

  res.status(200).json({ message: "OTP verified successfully" });
  }catch (error) {
    res
      .status(500)
      .json({ message: 'Error in internal server while verifying OTP' });
  }
}

export const resetPassword = async (req,res) => {
  const {email,password} = req.body

  if(!password){
    return res.status(400).json({ message: "Please provide password" })
  }

  try{
    const user = await User.findOne({email})

    if(!user){
      return res.status(404).json({message:"User not found with this email id"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    
    user.password = hashedPassword          
    
    //clear otp fields
    user.otp = undefined;
    user.otpExpiresTime = undefined;

    //Saving user
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
    
  }catch(error){
    res
      .status(500)
      .json({ message: 'Error in internal server while resetting password' });
  }
}