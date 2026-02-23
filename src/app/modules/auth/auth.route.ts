import express from 'express'

import { AuthController } from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from '../user/user.validation'

const router = express.Router()

router.route("/register").post(validateRequest(AuthValidation.createRegisterZodSchema), AuthController.registerUser)
router.route("/login").post(validateRequest(AuthValidation.createLoginZodSchema), AuthController.loginUser)



export const AuthRoutes = router 
