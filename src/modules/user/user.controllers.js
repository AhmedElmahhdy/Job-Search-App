import { User } from "../../../db/collections/user.collection.js";
import { sendEmailService } from "../../services/send-email.services.js";
import createOtp from "../../services/send-otp.js";
import { ErrorClass } from "../../utils/error-class.utils.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// ============================== sign up ===============================
export const signUp = async (req,res,next)=>{
    const {firstname,lastname,email,Password,recoveryemail,DOB,mobileNumber} = req.body
    // check if user exist
    const isUserExist = await User.findOne({
        $or:[ 
            {email},
            {mobileNumber}
        ]
    })
    if(isUserExist) return next (new ErrorClass("User already exist", 400))
    // hash password 
    const hashedPassword = bcryptjs.hashSync(Password,process.env.SALT_ROUND)
    // prepare user data
    const user = new User({
        firstname,
        lastname,
        email,
        password:hashedPassword,
        recoveryemail,
        DOB,
        mobileNumber,
        username: firstname + " " + lastname
    })
    // generate token
    const userToken = jwt.sign({id:user._id},process.env.JWT_VALIDATION_SECRET)

    // sent email
    const validationLink = `${req.protocol}://${req.headers.host}/user/verify/${userToken}`
    const isSentEmail = await sendEmailService({
        to: email,
        from: "Job search app <" + process.env.EMAIL_USER + ">",
        subject: "Sign Up verification",
        text:`
            <h1>Welcome to Job Search App ${user.username}.</h1> <br>
            <a href="${validationLink}"> Click here to verify your account</a>`
    
    })
    if (!isSentEmail) {
    return res.status(500).json({ message: "Failed to send email" });
    }
    // save user 
     const savedUser = await user.save()
    // return user data without sensitive data
    const { password , status, __v, isVerified, _id, role,otpCode,otpExpiresAt,isOtpVerified, ...userWithoutSensitiveData } = savedUser.toObject();

res.status(201).json({message:"User created",userWithoutSensitiveData})

}

// ============================= verify sign up user ===============================
export const verifySignUpUser = async (req,res,next)=>{
    // destruct token from params
    const {token} = req.params
    // decode token
    const {id} = jwt.verify(token,process.env.JWT_VALIDATION_SECRET)
    // check if user exist
    const user = await User.findById(id)
    if(!user) return next(new ErrorClass("User not found", 400))
    // cheack if user is verified or not 
    if(user.isVerified) return next(new ErrorClass("User already verified", 400))
    // update user status to verified
    user.isVerified = true
    await user.save()
    res.status(200).send("User verified")
}
// ============================= sign in ===============================
export const signIn = async (req,res,next)=>{
    // destuct data from req body
    const {email,password,mobileNumber} = req.body
    // cheak if user exist or not 
    const isUserExist = await User.findOne({
        $or:[ 
            {email},
            {mobileNumber}
        ]
    })
    if(!isUserExist) return next(new ErrorClass("User not found", 400))

    // check if user is verified or not
    if(!isUserExist.isVerified) return next(new ErrorClass("User not verified", 400))

    // check password
    const isMatch = bcryptjs.compareSync(password,isUserExist.password)
    if(!isMatch)return next(new ErrorClass("Password not match", 400))
    // generate token
    const token = jwt.sign({id:isUserExist._id},process.env.JWT_AUTHENTICAtiON_SECRET)
    const secretToken = "Job-Search-App " + token
    // upadate status 
    await User.findByIdAndUpdate(isUserExist._id,{status:"online"})
     
    res.status(200).json({message:"logged in",secretToken})
}
// ============================= log out ===============================
export const logOut = async (req,res,next)=>{
    // destruct token from req auth 
   const {id}= req.authUser
  
   // update status
   const updatedUser = await User.findByIdAndUpdate(id,{status:"offline"},{new:true}).where('status').equals("online")
   if(!updatedUser) return next(new ErrorClass(" Cannot logOut User was be deleted or offline", 400))

      res.status(200).json("logged out")
}
/*
    *3. update account.
    - you can update ( email , mobileNumber , recoveryEmail , DOB , lastName , firstName)
    - if user update the email , mobileNumber make sure that the new data doesn’t conflict with any existing data in your  database
    - User must be loggedIn
    - after update , user must be logged out by calling /logOut by axios and return
     response with message "data updated successfully please sign in again to continue your session" 
    - only the owner of the account can update his account data by=> cheack id in token and id in body
 */

    // ============================= update user ===============================
export const update = async(req,res,next)=>{
    const userData = req.authUser
    const newUserData = req.body
    const {id} = req.params
    const {email,mobileNumber} = userData
    
    if (userData.id !== id) return next (new ErrorClass("you can't update this account", 400))
    // prepare data before update
    for (let key in req.body) {
        if (req.body[key]) userData[key] = req.body[key]
    }
    userData.username = userData.firstname + " " + userData.lastname
    if (email || mobileNumber) {
        userData.status = "offline"
        if (email){
            userData.isVerified = false
        }
       
    }
    // update user data
    await userData.save()
    // sent email if user update email
    if (email){
        const validationLink = `${req.protocol}://${req.headers.host}/user/verify/${userToken}`
        const isSentEmail = await sendEmailService({
            to: email,
            from: "Job search app <" + process.env.EMAIL_USER + ">",
            subject: "re-verify your account",
            text:`
                <h1>Welcome to Job Search App ${userData.username}.</h1> <br>
                <a href="${validationLink}"> Click here to re-verify your account</a>`
        
        })
        if (!isSentEmail) {
        return next(new ErrorClass("Email not sent", 400))
        }
    }
 
    res.json("not update")

   
}

 /**
  * 4. Delete account
    - only the owner of the account can delete his account data
    - User must be loggedIn
     */   
// ================================= delete account =================================
export const deleteAccount = async(req,res,next)=>{
    // destruct id from params and user data from authentication middleware
    const userData = req.authUser
    const {id} = req.params
    // cheack the user is Owner of this account 
    if (userData.id !== id) return res.status(400).json("you can't delete this account")
    // if user is the Owner of this account , delete it
    const deletedUser = await User.findByIdAndDelete(userData.id)
    if (!deletedUser) return res.status(400).json("user not found")
    res.json("deleted")
}


/**
  5. Get user account data 
    - only the owner of the account can get his account data
    - User must be loggedIn
 */

    // ================================== get user data ==================================
export const getUserData = async(req,res,next)=>{
    // destruct id from params and user data from authentication middleware
    const userData = req.authUser
    const {id} = req.params
    // cheack the user is Owner of this account 
    if (userData.id !== id) return next(new ErrorClass("you can't get this account", 400))

    res.json(req.authUser)
}


/**
 6. Get profile data for another user 
    - send the userId in params or query
 */

//==================================== get profile data =================================
export const getProfileData = async(req,res,next)=>{
    const {id} = req.params
    const user = await User.findById(id).select("-password -__v -isVerified -_id")// remove sensitive data from user
    if (!user) return next(new ErrorClass("user not found", 400))
    res.json(user)
}



// update password 
/**
steps:
    1- user must be loggedIn
    2- send the old password
    3- send the new password
    4- send the confirm new password
    5- if all the data is valid , update password
 */

// ================================= update password ================================
export const updatePassword = async(req,res,next)=>{
    const userData = req.authUser
    const {oldPassword, newPassword,confirmNewPassword} = req.body
    // sure that user send all required data in body 
    if (!oldPassword || !newPassword || !confirmNewPassword) return next(new ErrorClass("please send all required data", 400))
    const oldUserPassword = userData.password
    if(!oldPassword) return next(new ErrorClass("User is Not Found", 400))
    const cheackOldPassword =  bcryptjs.compareSync(oldPassword,oldUserPassword)
    if (!cheackOldPassword) return next(new ErrorClass("wrong password please Enter old password again", 400))
    if (newPassword !== confirmNewPassword) return next(new ErrorClass("new password and confirm new password must be same", 400))
    const newPasswordHash = bcryptjs.hashSync(newPassword,10)
    
   await User.findByIdAndUpdate(userData.id,{password:newPasswordHash},{new:true})
    
    res.json("updated successfully")
}

// forget password
//Forget password (make sure of your data security specially the OTP and the newPassword )

export const forgetPassword = async(req,res)=>{
    const {email, mobileNumber} = req.body
    
    const user = await User.findOne({$or:[{email},{mobileNumber}]})
    if (!user) return res.status(400).json("user not found")
    // send email with otp 
    // 1- generate otp and save it in database
    const userOtp = createOtp()
    user.otpCode = userOtp
    //2- send email with otp
    const isSentEmail = await sendEmailService({
        to: email,
        from: "Job search app <" + process.env.EMAIL_USER + ">",
        subject: "Forget Password Verification",
        text:`
            <h1>Password Verfication OTP is ${userOtp} .</h1> <br>`
    
    }
    )
    if (!isSentEmail) {
     return res.status(500).json({ message: "Failed to send email" });
    }   
    await user.save()
    res.json("Forget password email sent successfully")

}

// ================================= verification otp code ================================
export const verificationOtpCode = async(req,res)=>{
    const {email ,otp} = req.body
    const user = await User.findOne({$or:[{email}]})
    if (!user)
         return next(new ErrorClass("user not found", 400))
     if (user.otpCode != otp && user.otpExpiresAt < Date.now())
         return next(new ErrorClass("otp expired or wrong", 400))
    user.isOtpVerified = true
    await user.save()
   
    res.json("OTP verified successfully")
}


// ================================= rest password ================================
export const restPassword = async(req,res)=>{
    const {email,newPassword,confirmNewPassword} = req.body

    const user = await User.findOne({$or:[{email}]})
    if (!user) return res.status(400).json("user not found")

    if (newPassword !== confirmNewPassword) return res.status(400).json("password not match")

    const newPasswordHash = bcryptjs.hashSync(newPassword,10)
    if (user.isOtpVerified == false) return res.status(400).json("OTP Not Verified")
     await User.findByIdAndUpdate(user.id,{password:newPasswordHash},{new:true})
res.json("Updated Password Successfully")
}



