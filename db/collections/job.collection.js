import { Schema,Types,model } from "mongoose";

const jobSchema = new Schema({
    jobTitle:{
        type:String,
        required:true
    },
    jobLocation:{
        type:String,
        enum:["onsite","remotely","hybrid"],
        default:"onsite"
    },
    workingTime:{
        type:String,
        enum:["part-time","full-time"],
        default:"full-time"
    },
    seniorityLevel:{
        type:String,
        required:true
    },
    jobDescription:{
        type:String,
        required:true   
    },
    technicalSkills:{
        type:Types.Array(),
        required:true
    },
    softSkills:{
        type:Types.Array(),
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    addedBy:{
        type:Types.ObjectId,
        ref:"User"
    },
    companyID:{
        type:Types.ObjectId,
        ref:"Company"
    }  

},
{
    timestamps:true
})
export const Job = model("Job",jobSchema)