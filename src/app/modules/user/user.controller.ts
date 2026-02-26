import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserService } from "./user.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
export const getMe = (req: Request, res: Response) => {

    console.log(req.user)
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};



const getMyProfile = catchAsync(async(req:Request, res:Response) => {

  const userId = req.user?.id
  const result = await UserService.getMyProfile(userId)
  sendResponse(res , {
  success:true,
  message: "Profile fetched successfully",
  statusCode: StatusCodes.OK,
  data: result
})
})



const updateProfile = catchAsync(async (req: Request, res: Response) => {

  const userId = req.user?.id
  const payload = req.body
  const files = req.files
    const result = await UserService.updateMyProfile(userId, payload, files)

  sendResponse(res , {
    success: true,
    message: "User updated successfully",
    statusCode: StatusCodes.OK,
    data: result 
  })
})



export const userController = {  
    getMe,
    getMyProfile,
    updateProfile
}


