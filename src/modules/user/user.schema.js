import Joi from "joi";


export const userSignUpSchema = Joi.object({
    body: Joi.object({
        firstname: Joi.string().min(3).max(10).alphanum(),
        lastname: Joi.string().min(3).max(10).alphanum(),
        email: Joi.string().email({
            minDomainSegments: 2,
            maxDomainSegments: 4,
            tlds: { allow: ["com", "net", "org"] },
          }).required(),
        password: Joi.string()
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!%*?&])[A-Za-z\d$!%*?&]{8,}$/
          )
          .required()
          .messages({
            "string.pattern.base":
              "Password must have at least one lowercase letter, one uppercase letter, one number and one special character",
            "any.required": "You need to provide a password",
            "string.min": "Password should have a minimum length of 3 characters",
          })
      .options({ presence: "required" }),

        recoveryemail: Joi.string().email({
            minDomainSegments: 2,
            maxDomainSegments: 4,
            tlds: { allow: ["com", "net", "org"] },
          }).required(),
        DOB: Joi.date().iso().required().messages({
            'date.base': 'Date of birth must be a valid date.',
            'date.format': 'Date of birth must be in YYYY-MM-DD format.',
            'any.required': 'Date of birth is required.'
          }),
        
        mobileNumber: Joi.number().min(11).max(11).required(),
        
        
    })
  
})