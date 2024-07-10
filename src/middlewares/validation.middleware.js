import { ErrorClass } from "../utils/error-class.utils.js";


const reqKeys = ['body', 'query', "params", "headers"];

export const validationMiddleware=(schema)=>{
    return(req,res,next)=>{
        let errors=[];
        for(const key of reqKeys)
        {
            const validationresult=schema[key]?.validate(req[key],{abortEarly: false})
            if(validationresult?.error)
                errors.push(...validationresult.error.details)
        }
        if(errors.length) return res.status(400).json({
            err_msg: "validation error",
            errors: errors.map(ele => ele.message)
        })
        next()
    }
}