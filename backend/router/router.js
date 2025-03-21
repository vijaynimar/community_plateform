import { Router } from "express";
import { signIn,login } from "../controller/user.js";
import { profileMulter } from "../middleware/multer.js";
import { profileUpload } from "../controller/userprofile.js";
import { getProfile } from "../controller/userprofile.js";
import { uploadImage ,getAillImage,allImages} from "../controller/photos.js";
const router=Router()
router.post("/signIn",signIn)
router.post("/login",login)
router.post("/profileUpload",profileMulter.single("photo"),profileUpload)
router.get("/getprofile",getProfile)
router.post("/create-post",profileMulter.single("post"),uploadImage)
router.get("/getAllimage",getAillImage)
router.get("/dashboardImages",allImages)
export {router}