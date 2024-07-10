import { Application } from "../../../db/collections/application.collectiom.js";
import { Job } from "../../../db/collections/job.collection.js";
import { User } from "../../../db/collections/user.collection.js";
import { ErrorClass } from "../../utils/error-class.utils.js";

// ============================================== add job ==============================================
export const addJob = async (req, res, next) => {

    const {
        jobTitle,jobDescription,
        jobLocation,companyName,
        seniorityLevel,workingTime,
        softSkills,technicalSkills,companyID
    } = req.body

    const job = new Job({
        jobTitle,
        jobDescription,
        jobLocation,
        companyName,
        companyID,
        addedBy:req.authUser._id,// company_hr id here ,
        seniorityLevel,
        workingTime,
        softSkills,
        technicalSkills
    })
    await job.save()
    res.status(201).json({message:"Job created"})
}

// ============================================== update job ==============================================
export const updateJob = async (req, res, next) => {
    const job = await Job.findById(req.params.id)
    if (!job) return next(new ErrorClass("Job not found",400))
    // for loop to take  data from body ans save it in job
    // user can be able to updata fully or partially data
    for (let key in req.body) {
        if (req.body[key]) job[key] = req.body[key]
    }
   
   await job.save()
    res.status(200).json({ message: "Job updated", job })
}

// ============================================== delete job ==============================================
export const deleteJob = async (req, res, next) => {
    const job = await Job.findByIdAndDelete(req.params.id)
    if (!job) return next(new ErrorClass("Job not found",400))
    res.status(200).json({ message: "Job deleted" })
}


// ============================================== get all jobs ==============================================

export const getAllJobsWithCompany = async (req, res, next) => { 
    const jobs = await Job.find().populate('addedBy',"username -_id").populate("companyID","name -_id")
    if (!jobs) return next(new ErrorClass("Jobs not found",400))
    


    res.status(200).json({ message: "Jobs fetched", jobs })
}

// ============================================== get all jobs for specific company =========================
export const getAllJobsForSpecificCompany = async(req,res,next)=>{
    const {companyName} = req.query
    const jobs = await Job.find({companyName})
    if (!jobs) return next(new ErrorClass("Jobs not found",400))
    res.status(200).json({ message: "Jobs fetched", jobs })
}


// ============================================== apply to job ==============================================
export const applyToJob = async(req,res,next)=>{
    const {jobID} = req.params
    const {userId} = req.authUser._id
    const {userTechSkills,userSoftSkills} = req.body
    const job = await Job.findById(jobID)
    if (!job) return next(new ErrorClass("Job not found",400))
    const user = await User.findById(userId)
    if (!user) return next(new ErrorClass("User not found",400))
    const newApplication = new Application({
        jobID,
        userId,
        TechSkills:userTechSkills,
        SoftSkills:userSoftSkills
    })
    console.log(newApplication);
    await newApplication.save()
    res.status(201).json({ message: "Application created" })

}