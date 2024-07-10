import { Schema,Types,model } from "mongoose";


const applicationSchema = new Schema({
    jobId:{
        type:Types.ObjectId,
        ref:"Job"
    },
    userId:{
        type:Types.ObjectId,
        ref:"User"
    },
    TechSkills:{
        type:Types.Array(),
        required:true
       
    },
    SoftSkills:{
        type:Types.Array() ,
        required:true
        
    },
    userResume:{
        type:String,
        
    }

},
{
    timestamps:true
})
export const Application = model("Application",applicationSchema)