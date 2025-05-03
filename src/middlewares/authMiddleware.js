import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";


export const authMiddleware = async (req,res,next) => {
    try{
        const { authorization } = req.headers;
    console.log('authorization: ', authorization);

    const token = authorization.split(' ')[1];
    console.log('token: ', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('decoded: ', decoded);


    const user = await User.findById(decoded.id)
    console.log('user: ', user);

    if(!user){
        res.status(500).json({message:"Invalid token , please relogin to continue"})
    }

    req.user = user
    next()
    }catch(error){
        res.status(500).json({ message:"Error in internal server while verifying token" })
    }
}