import express from 'express'

import { AuthController } from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from '../user/user.validation'

const router = express.Router()

router.route("/register").post(validateRequest(AuthValidation.createRegisterZodSchema), AuthController.registerUser)



export const AuthRoutes = router 
