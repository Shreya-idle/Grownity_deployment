import express from 'express'
import { logout ,googleLogin } from "../controller/AuthControl.js"; 
const authRoutes = express.Router() 


authRoutes.post('/google-login', googleLogin)
authRoutes.post('/logout', logout)

export default authRoutes;