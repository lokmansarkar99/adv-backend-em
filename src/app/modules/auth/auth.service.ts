import brcypt from "bcrypt";
import { StatusCodes } from "http-status-codes";    
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelper } from "../../../helpers/jwtHelper";
import { User } from "../user/user.model";
import { ILoginData } from "../../../types/auth";
import generateOTP from "../../../utils/generateOTP";
import cryptoToken from "../../../utils/cryptoToken";
import { RegisterPayload, LoginPayload } from "../user/user.validation";
import { STATUS } from "../../../enums/user";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailHelper } from "../../../helpers/emailHelper";


// Register 

const registerToDB = async (payload:RegisterPayload ) => {
    const {email} = payload

    const isExistUser = await User.findOne({email})
    if(isExistUser) {
        throw new ApiError(StatusCodes.CONFLICT, "User already exists with this email")
    }

    const user = (await User.create(payload))    

    const otp = generateOTP()

await User.findOneAndUpdate({email: payload.email}, {
    authentication: {
        oneTimeCode: otp,
        expiredAt: new Date(Date.now() + 5 * 60 * 1000)

    }
})

const emailData = emailTemplate.createAccount( {
    name: user.name,
    email: user.email,
    otp
})
    

emailHelper.sendEmail({
    to: user.email,
    subject: "Verify your account",
    html: emailData.html
})
    const userData = {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }
    return { message: "User registered successfully, please verify your email", user: userData }
}



export const logintoDB = async (payload: LoginPayload) => {
    const {email, password} = payload
    const user = await User.findOne({email}).select("+password")
    if(!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found with this email")
    }

if(!user.verified) {
    throw new ApiError( StatusCodes.BAD_REQUEST, "Vefify your account and login")
}


if(user.status === STATUS.INACTIVE) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "You are inactive user")
}


    const isPasswordMathched = await brcypt.compare(password, user.password)
    if(!isPasswordMathched) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials")
    }

    const userData = {
        _id: user._id,
        email: user.email,
        name:user.name,
        role:user.role
    }

    const accessToken = jwtHelper.createToken(userData, config.jwt.jwt_secret as Secret, config.jwt.jwt_expire_in as string)
    const refeshToken = jwtHelper.createToken(userData, config.jwt.jwt_refresh_secret as Secret, config.jwt.jwt_refresh_expire_in as string )


        

    return {
        accessToken,
        refeshToken,
        user:userData
    }
}





export const AuthService = { 
    registerToDB,
    logintoDB
}