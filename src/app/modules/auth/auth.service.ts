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


// Register 

const registerToDB = async (payload:RegisterPayload ) => {
    const {email} = payload

    const isExistUser = await User.findOne({email})
    if(isExistUser) {
        throw new ApiError(StatusCodes.CONFLICT, "User already exists with this email")
    }

    const user = await User.create(payload)
    return user
}

export const AuthService = { 
    registerToDB
}