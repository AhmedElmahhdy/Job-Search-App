import {ErrorClass} from "../utils/error-class.utils.js";


export const authorizationMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
      
      const user = req.authUser;
    
      if (!allowedRoles.includes(user.role)) {
        return next(
          new ErrorClass(
            "Authorization Error, You are not allowed to access this route",
            401
           
          )
        );
      }
      next();
    };
  };