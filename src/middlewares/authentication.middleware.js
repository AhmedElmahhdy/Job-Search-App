import jwt from "jsonwebtoken";
import {User} from "../../db/collections/user.collection.js";
import {ErrorClass} from "../utils/error-class.utils.js";

export const auth = () => {
  return async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
      return next(
        new ErrorClass("Token is required", 404, "Token is required")
      );
    }
    if (!token.startsWith(process.env.PREFIX_SECRET)) {
      return next(new ErrorClass("Invalid token", 400, "Invalid token"));
    }
   
    const originalToken = token.split(" ")[1];
    const data = jwt.verify(originalToken, process.env.JWT_AUTHENTICAtiON_SECRET);
    
    if (!data?.id) {
      return next(
        new ErrorClass("Invalid token payload", 400, "Invalid token payload")
      );
    }
    // find user by userId
    const isUserExists = await User.findById(data?.id);
    if (!isUserExists) {
      return next(new ErrorClass("User not found", 404, "User not found"));
    }
    // add the user data in req object
    req.authUser = isUserExists;

    return next();
  };
};
