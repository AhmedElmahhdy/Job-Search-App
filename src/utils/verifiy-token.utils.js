import jwt from "jsonwebtoken"


export const verifyToken = (token,secretKey)=>{
    
    const originalToken = token.split(" ")[1]
    const tokenData = jwt.verify(originalToken,secretKey)
    
    return tokenData

}