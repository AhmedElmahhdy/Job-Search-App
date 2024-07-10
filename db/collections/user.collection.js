import { Schema, model } from "mongoose";
import createOtp from "../../src/services/send-otp.js";

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,


    },
    lastname: {
        type: String,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
            type:String,
            required:true
        },
    recoveryEmail:{
            type:String,
            require:true
        },
    DOB:{
            type:Date,
            required:true
        },
    mobileNumber:{
            type:Number,
            unique:true
        },
    role:{
            type:String,
            enum:["user","company_hr"],
            default:"user"
        },
    status:{
            type:String,
            enum:["online","offline"],
            default:"offline"
    },
    isVerified:{
            type:Boolean,
            default:false
        },
    otpCode:{
        type:String,
        default:createOtp()
    },
    otpExpiresAt:{
        type:Date,
        default: Date.now()+5*60*1000 // 10 minutes * 60 seconds * 1000 milliseconds ==> 10 minutes
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    }
}
,{
    timestamps: true
});



export  const  User = model("User",userSchema)
