import mongoose from "mongoose";
import "dotenv/config"
const connection=async()=>{
    try{
        await mongoose.connect(process.env.mongo_url)
        console.log("connected to mongo sucessfully");
    }catch(err){
        console.log("err in mongo connection");
    }
}
export default connection