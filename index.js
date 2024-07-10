import express from "express";
import { connectDB } from "./db/dbconnections.js";
import userRotuer from "./src/modules/user/user.routes.js";
import { config } from "dotenv";
import { globaleResponse } from "./src/middlewares/error-handling.middleware.js";
import companyRouter from "./src/modules/company/company.routes.js";
import jobRouter from "./src/modules/job/job.routes.js";


const app = express();
connectDB()
config() 


app.use(express.json())

app.use("/user",userRotuer)
app.use("/company",companyRouter)
app.use("/job",jobRouter)

app.use(globaleResponse);

 

app.listen(process.env.PORT , ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)})