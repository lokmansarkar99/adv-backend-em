import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

import config from "../../../config";

const registerUser = catchAsync(async(req:Request, res:Response) => {
    const result = await AuthService.registerToDB(req.body)
    sendResponse(res, {
        success: true,
        message: "User registered successfully",
        statusCode: StatusCodes.CREATED,
        data:result
    })
})


const loginUser = catchAsync(async(req:Request, res:Response) => {
    const result = await AuthService.logintoDB(req.body)

    const {accessToken, refeshToken} = await result
res.cookie("accessToken", accessToken, {
    httpOnly:true,
    sameSite: "lax",
    secure: config.node_env ==="production",
    maxAge: 15 * 60 * 1000
})


    sendResponse(res, {
        success:true,
        message: "Login Successful",
        statusCode: StatusCodes.OK,
        data:result
    })
})


 
export const AuthController = {
    registerUser,
    loginUser
}