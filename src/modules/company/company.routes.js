import { auth } from "../../middlewares/authentication.middleware.js";
import {authorizationMiddleware} from "../../middlewares/authorization.js";
import { Router } from "express";
import {errorHandler} from "../../middlewares/error-handling.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import * as companyControllers from "./company.controllers.js"
import * as companySchema from "./company.schema.js";

const companyRouter = Router();

companyRouter.post("/add",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    errorHandler(companyControllers.addCompany)
)

companyRouter.put("/update/:id",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    errorHandler(validationMiddleware(companySchema.updatecompany_schema)),
    errorHandler(companyControllers.updateCompany)
)

companyRouter.delete("/delete/:id",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR)),
    errorHandler(companyControllers.deleteCompany)
)

companyRouter.get("/get",
    errorHandler(auth()),
    errorHandler(authorizationMiddleware(systemRoles.COMPANY_HR_USR)),
    errorHandler(companyControllers.searchForCompanyByName)
)


export default companyRouter