import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AnalyticsService } from "./anlytics.service";
import { StatusCodes } from "http-status-codes";


const activeUsers = catchAsync(async (req:Request, res: Response) => {
    const result = await AnalyticsService.getActiveUser()

    sendResponse(res , {
        success: true,
        statusCode: StatusCodes.OK,
        message: "Active User fetched Successfully",
        data: result
    })
})


export const AnalyticsController = {
    activeUsers
}