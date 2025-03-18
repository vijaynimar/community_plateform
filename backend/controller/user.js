import { user } from "../model/user.js";
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