import { Company } from "../../../db/collections/company.collection.js";
import { ErrorClass } from "../../utils/error-class.utils.js";

// ============================================== add company ==============================================
export const addCompany = async (req, res, next) => {
    const { name, description, industry, address, numberOfEmloyes, emailCompany } = req.body;
    // prepare data
    const company = {
      name,
      description,
      industry,
      address,
      numberOfEmloyes,
     emailCompany:emailCompany,
      companyHr:req.authUser._id
    };
  const isCompanyNameExists = await Company.findOne({ emailCompany });
  // check if companyName exist
  if (isCompanyNameExists) {
    return next(new ErrorClass("companyName exist", 400));
  }
  // find with companyEmail
  const isCompanyEmailExists = await Company.findOne({ emailCompany });
  // check if companyEmail exist
  if (isCompanyEmailExists) {
    return next(new ErrorClass("companyEmail exist ", 400));
  }
  // create company
  const newCompany = await Company.create(company);
  // failed
  if (!newCompany) {
    return next(new ErrorClass("Creation Failed", 409));
  }
    res.status(201).json({ message: "Company created" });
  };

// ============================================== update company ==============================================
export const updateCompany = async (req, res, next) => {
  
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(400).send("Company not found");
    // for loop to take  data from body ans save it in company
    // user can be able to updata fully or partially data
    for (let key in req.body) {
        if (req.body[key]) company[key] = req.body[key]
    }
    
        await company.save();
    res.status(200).json({ message: "Company updated" });
  };

// ============================================== delete company ==============================================
export const deleteCompany = async (req, res, next) => {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    if (!company) return next(new Error("Company not found",400)); //res.status(400).json("Company not found");
    res.status(200).json({ message: "Company deleted" });
  };

// ============================================== search for company by name ==============================================
export const searchForCompanyByName = async (req, res, next) => {
    const { name } = req.body;
    const company = await Company.findOne({ name });
    if (!company) return next(new Error("Company not found",400)); 
    res.status(200).json(company);
}
  