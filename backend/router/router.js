import { Router } from "express";
import { signIn,login } from "../controller/user.js";
const router=Router()

router.post("/signIn",signIn)
router.post("/login",login)
export {router}