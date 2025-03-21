import express from 'express';
import cors from 'cors';
import connection from './db.js';
import { router } from './router/router.js';
const app=express()
app.use(cors())
app.use(express.json());

const port = 3110
app.use(router)
connection()
app.listen(port,()=>{
    console.log(`Server is running on port ${port} 🚀`)
})