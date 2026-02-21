import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

const registerUser = catchAsync(async(req:Request, res:Response) => {
    const result = await AuthService.registerToDB(req.body)
    sendResponse(res, {
        success: true,
        message: "User registered successfully",
        statusCode: StatusCodes.CREATED,
        data:result
    })
})


export const AuthController = {
    registerUser
}