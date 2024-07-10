import { Router } from "express";
import * as userControllers from "./user.controllers.js"
import { auth } from "../../middlewares/authentication.middleware.js"; 
import { errorHandler } from "../../middlewares/error-handling.middleware.js";
import { userSignUpSchema } from "./user.schema.js";

import { authorizationMiddleware } from "../../middlewares/authorization.js";
import { systemRoles } from "../../utils/system-roles.js";


const userRotuer = Router();

userRotuer.post("/signup",
//errorHandler(validationMiddleware(userSignUpSchema)),
errorHandler(userControllers.signUp )
);

userRotuer.get("/verify/:token",
    errorHandler(userControllers.verifySignUpUser)
 );
userRotuer.post("/signin",
    errorHandler(userControllers.signIn)
) ;
userRotuer.put("/logout/:id",
    errorHandler(auth()),
    errorHandler(userControllers.logOut)
) ;
userRotuer.put("/update/:id",
    errorHandler(auth()),
    errorHandler(userControllers.update)
);
userRotuer.delete("/delete/:id",
    errorHandler(auth()),
   errorHandler( userControllers.deleteAccount)
);
userRotuer.get("/get/:id",
    errorHandler(auth()),
    errorHandler(userControllers.getUserData)
 );
userRotuer.get("/getprofile/:id",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    errorHandler(userControllers.getProfileData)
);
userRotuer.post("/updatepassword",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    errorHandler(userControllers.updatePassword)
);
userRotuer.put("/forgetpassword",
    errorHandler(userControllers.forgetPassword)
);
userRotuer.patch("/verifyotp/:id",
    errorHandler(userControllers.verificationOtpCode)
);



export default userRotuer
