import express from 'express'

import { AuthController } from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from '../user/user.validation'
import { checkAuth } from '../../middlewares/checkAuth'
import { USER_ROLES } from '../../../enums/user'

const router = express.Router()

router.route("/register").post(validateRequest(AuthValidation.createRegisterZodSchema), AuthController.registerUser)
router.route("/login").post(validateRequest(AuthValidation.createLoginZodSchema), AuthController.loginUser)

router.post('/refresh-token', AuthController.refreshToken)


router.post('/logout', checkAuth(USER_ROLES.USER, USER_ROLES.ADMIN), AuthController.logout )


export const AuthRoutes = router 
