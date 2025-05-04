import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
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
    },
    membersList:[
        {   
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true,
            },
            gender:{
                type:String,
                required:true,
            },
            age:{
                type:Number,
                required:true
            }
        }
    ] 
},
{
    timestamps:true
})

export const User = mongoose.model('User',UserSchema);