import { Router } from "express";
import { signIn } from "../controller/user.js";
const router=Router()

router.post("/signIn",signIn)

export {router}