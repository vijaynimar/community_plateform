import { Photo } from "../model/photos.js";
import { user } from "../model/user.js";
import { Images } from "../model/allImages.js";
import { profile } from "../model/userProfile.js";
import jwt from "jsonwebtoken"
import {v2} from "cloudinary"
import fs from "fs"
import "dotenv/config"

export const uploadImage=async(req,res)=>{
    const token=req.headers.authorization
    if(!token){
        return res.status(404).json({message:"token needed"})
    }
    const {description}=req.body
    let photo;
    if(req.file){
        photo=req.file.path
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)

        const {email,username}=decoded
        console.log(email)
        const userExist=await user.findOne({email:email})
        if(!userExist){
            return res.status(400).json({message:"user not exist"})
        }
        let url=""
        if(req.file){
             let reponse=await v2.uploader.upload(photo)
            url=reponse.secure_url
             await fs.promises.unlink(photo);  // Asynchronous file deletion
        }
        let userProfile="";
        const userImage=await profile.findOne({email})
        if(userImage){
            if(userImage.image)
            userProfile=userImage.image
        }
        let newPhoto=new Photo({
            userId:userExist._id,
            description:description,
            username:username,
            userProfile:userProfile,
            photo:url,
            likeBy:[],
            comments:[],
            likes:0
        })
        const photo_id=await newPhoto.save()
        const userpostExist=await Images.findOne({email:email})
        // console.log(userpostExist)
        if(userpostExist){
            userpostExist.images.push(photo_id._id)
            await userpostExist.save()
        }else{
            const newPost=new Images({
                userId:userExist._id,
                images:[photo_id._id],
                username:username,
                email:email
            })
        await newPost.save()
        }
        res.status(201).json({message:"post uploaded sucessfully"})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"error in uploadImage"})
    }
}


export const getAillImage=async(req,res)=>{
    const token=req.headers.authorization
    if(!token){
        return res.status(404).json({message:"token needed"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        const {email,username}=decoded
        const data=await Images.findOne({email})
        const images=data.images
        // console.log(images.length)
        let arr=[]
        for(let i=0;i<images.length;i++){
            let dataImage=await Photo.findOne({_id:images[i]})
            arr.push(dataImage)
        }
        res.status(200).json({photos:arr})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"error in get all image"})
    }
}