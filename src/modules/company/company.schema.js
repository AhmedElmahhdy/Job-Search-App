// import Joi from "joi";

// export const addCompanySchema = Joi.object({
//     body: Joi.object({
//         name: Joi.string().required().label("Enter valid name"),
//         description: Joi.string().min(5).required(),
//         industry: Joi.string().required(),
//         address: Joi.string().required(),
//         numberOfEmployees: Joi.string().required(),
//         emailCompany: Joi.string().email({
//             minDomainSegments: 2,
//             maxDomainSegments: 4,
//             tlds: { allow: ["com", "net", "org"] },
//         }),
//         companyHr: Joi.string().required(),
//     }),
// })



 import Joi from "joi";
// import { generalFields } from "../../middlewares/validationMiddleware.js";

// export const addCompanySchema = {
//   body : joi.object().required().keys({
//       name: joi.string().required().label("enter valid company name"),
//       description: joi.string().required().label("enter description"),
//       industry: joi.string().required().label("enter industry"),
//       address : joi.string().required().label("enter address"),
//       numberOfEmployees: joi.string().pattern(/^\d+-\d+$/).required(),
//       emailCompany: generalFields.email.required().label("enter valid companyEmail"),
//   }),
//   params : joi.object().required().keys({}),
//   query : joi.object().required().keys({}),
// }



// export const addcompany_schema={
//     body:Joi.object({
//     name: Joi.string().required().alphanum().min(3).max(10).label("enter valid company name"),
//      description: Joi.string().required(),
//      industry: Joi.string().required(),
//      address: Joi.string().required(),
//      numberOfEmloyes: Joi.string().pattern(/^\d+-\d+$/).required(),
//      emailCompany: Joi.string().email({
//                     minDomainSegments: 2,
//                     maxDomainSegments: 4,
//                     tlds: { allow: ["com", "net", "org"] },
//                 }).label("enter valid companyEmail"),
//      companyHr:Joi.string().required(),

//     })
// }

export const updatecompany_schema={
   body:Joi.object({
      companyName: Joi.string(),
    description: Joi.string(),
    industry: Joi.string(),
    address: Joi.string(),
    numberOfEmployees: Joi.string().pattern(/^\d+-\d+$/),
    companyEmail: Joi.string().email({ tlds: { allow: ["com", "net", "org"] } }),

   })
}

export const searchcompanyschema={
   query:Joi.object({
       companyname:Joi.string().required()
   }),


}