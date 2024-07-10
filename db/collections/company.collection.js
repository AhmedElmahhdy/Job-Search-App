import { Schema,Types,model } from "mongoose";

const companySchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    industry:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required:true
    },
    numberOfEmloyes:{
        type:String,
        required:true
    },
    emailCompany:{
        type:String,
        required:true,
        unique:true
    },
    companyHr:{
        type:Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
})

export const Company = model("Company",companySchema)