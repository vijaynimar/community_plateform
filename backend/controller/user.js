import { user } from "../model/user.js";
import jwt from "jsonwebtoken"
import argon2 from "argon2";
export const signIn=async(req,res)=>{
    const {username,email,password}=req.body
    if(!username || !email || !password){
        return res.status(400).json({message:"all fields are required"})
    }
    try{
        const userExist=await user.findOne({email})
        if(userExist){
            return res.status(404).json({message:"user already exist"})
        }
        const hashed=await argon2.hash(password)
        const newUser=new user({
            username:username,
            email:email,
            password:hashed
        })
        await newUser.save()
        res.status(201).json({message:"user created sucessfully"})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"error in signIn"})
    }
}


export const login=async(req,res)=>{
    // console.log("login")
    const{email,password}=req.body
  
    if (!email || !password) {
        return res.status(400).json({ msg: "Email and password are required" });
    }
 
    try{
        const dbExist=await user.findOne({email})
        if(!dbExist){
            // console.log("line55");
            return res.status(404).json({msg:"User not exist"})
        }
        const hashed=await argon2.verify(dbExist.password,password)
        if(hashed){
            // console.log("line60")
        const token=jwt.sign({ id: dbExist._id,username: dbExist.username, email: dbExist.email},process.env.JWT_SECRET_KEY,{expiresIn:"2day"})
        // console.log(token)
        return res.status(200).json({token:token})
        }
        return res.status(401).json({msg:"Invalid credentials"})

    }catch(err){
        console.log(err);
        res.status(500).json({msg:"server error in login"})
    }
}