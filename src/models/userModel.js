import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    otp:{
        type:String
    },
    otpExpiresTime:{
        type:Number
    }
},
{
    timestamps:true
})

export const User = mongoose.model('User',UserSchema);