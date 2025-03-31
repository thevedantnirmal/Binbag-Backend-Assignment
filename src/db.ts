import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
  email:{type:String,unique:true,required:true},
  password:{ type:String, required:true},
address:{ type:String, required:true},
bio:String,
profile_picture_URL:String


})

export const userModel=mongoose.model("users",UserSchema)