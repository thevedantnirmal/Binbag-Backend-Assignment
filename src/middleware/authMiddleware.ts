import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const tokenHeader=req.headers["authorization"]

    if(!tokenHeader||!tokenHeader.startsWith("Bearer " )){
        res.status(401).json({
            message:"Authorisation Failed. Please login again"
        })
        return;
 
  
}
 const token=tokenHeader?.split(" ")[1]
 try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET as unknown as string)
    //@ts-ignore
    req.userId=decoded.userId
    next()

 }
 catch{
    res.status(401).json({
        message:"Invalid Token"
    })
 }
}