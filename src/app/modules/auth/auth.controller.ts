import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes"
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

import config from "../../../config";
import { setAuthCookie } from "../../../utils/setCookie";
import { access } from "node:fs";

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

    setAuthCookie(res, {refreshToken: result.refeshToken})


    sendResponse(res, {
        success:true,
        message: "Login Successful",
        statusCode: StatusCodes.OK,
        data:result
    })
})


const refreshToken = catchAsync (async (req:Request, res:Response) => {
    const result  = await AuthService.refreshToken(req.body)
    console.log(result)
    sendResponse(res, {
        success:true,
        statusCode: 200,
    message: "user refresh token successfully",
        data: { accessToken: result }
    })
})



const logout = catchAsync(async (req: Request, res: Response) => {
    console.log(req.cookies.refreshToken)
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "lax",
  });

  
  return sendResponse(res, {
    success: true,
    message: "Logout successful",
    statusCode: StatusCodes.OK,
    data: null,
  });
});
export const AuthController = {
    registerUser,
    loginUser,
    refreshToken,
    logout
}