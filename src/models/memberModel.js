import mongoose from "mongoose";

const MemberSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        required:true
    }
},
{
    timestamps:true
})

export const Member = mongoose.model('Member',MemberSchema)