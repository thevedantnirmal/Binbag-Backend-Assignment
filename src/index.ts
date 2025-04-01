import express from 'express'
import { configDotenv } from 'dotenv'
import { userModel } from './db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authMiddleware } from './middleware/authMiddleware'
import mongoose from 'mongoose'
configDotenv()
const app=express()
app.use(express.json())

app.post("/register",async(req,res)=>{
    const {email,password,address, profilePicture,bio}=req.body;
    const hashedPassword=await bcrypt.hash(password,5)
    try{
        await userModel.create({
            email:email,password:hashedPassword,address:address,bio:bio,profile_picture_URL:profilePicture
        })
        res.status(200).json({
            message:"User succsesfully created"
        })
    }
    catch{
        res.status(401).json({
            message:"Unable to create user"
        })
    }


})
app.post("/login",async(req,res)=>{
 const {email,password}=req.body
 try{
 const user=await userModel.findOne({
    email:email
 })
 if(user){
    const verify=await bcrypt.compare(password,user.password)
    if(verify){
        const token=jwt.sign({userId:user._id.toString()},process.env.JWT_SECRET as unknown as string)
        res.json({
            token
        })
    }
    else {res.status(401).json({ message:"Wrong Credentials"})
     return}
 }


}
 catch{
    res.status(401).json({
        message:"User not found"
    })
    return
 }
})
app.get("/profile",authMiddleware,async(req,res)=>{
    //@ts-ignore
  const userId=req.userId;
  try{
 const user= await userModel.findOne({
    _id:userId
 })
res.json({
    //@ts-ignore
    email:user.email,
    //@ts-ignore
    bio:user.bio,
     //@ts-ignore
     address:user.address,
     //@ts-ignore
     profilePic:user.profile_picture_URL
    

})
}
catch{
    res.status(401).json({
        message:"Trouble retrieving data"
    })
}})
app.put("/update",authMiddleware,async(req,res)=>{
 //@ts-ignore
 const userId=req.userId;
 const {bio, address,profile_picture_URL}=req.body
 try{
    const user=await userModel.updateOne({
        _id:userId
    }, {
 bio,address,profile_picture_URL
    })
    res.json({
        message:"User succesfully updated"
    })
 }
 catch{
    res.status(401).json({
        message:"Unable to update user"
    })
 }
})
mongoose.connect(process.env.connection_string as string)
app.listen(3000) 