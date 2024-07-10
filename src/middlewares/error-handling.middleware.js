import { ErrorClass } from "../utils/error-class.utils.js";

export const errorHandler = (API) => {
  return (req, res, next) => {
     API(req, res, next).catch((err) => {
     
       return next(new ErrorClass(err.message, err.status));
    });
  };
};

export const globaleResponse = (err, req, res , next) => {
  if (err) {
   
   res.json({error:'Faill Response',message:err.message,stack:err.stack})
  }
};







  