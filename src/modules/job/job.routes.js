import { Router } from "express";
import * as jobControllers from "./job.controllers.js"
import { errorHandler } from "../../middlewares/error-handling.middleware.js";
import { auth } from "../../middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../middlewares/authorization.js";
import { systemRoles } from "../../utils/system-roles.js";
const jobRouter = Router();

jobRouter.post("/add",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    errorHandler(jobControllers.addJob)
)  

jobRouter.put("/update/:id",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    errorHandler(jobControllers.updateJob)
)

jobRouter.delete("/delete/:id",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    errorHandler(jobControllers.deleteJob)
)

jobRouter.get("/getjobs",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR_USR)),
    errorHandler(jobControllers.getAllJobsWithCompany)
)

jobRouter.get("/get",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR_USR)),
    errorHandler(jobControllers.getAllJobsForSpecificCompany)
)

jobRouter.post("/applytojob/:jobID",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.USER)),
    errorHandler(jobControllers.applyToJob)
)

export default jobRouter