import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import unlinkFile from "../../../shared/unLinkFIle";
import { getSingleFilePath } from "../../../shared/getFilePath";
import { User } from "./user.model";
import type { UpdateMyProfilePayload, UpdateUserStatusPayload } from "./user.validation";

import { STATUS } from "../../../enums/user";



//Get My Profile 
const getMyProfile = async (userId: string) => {
    const user = await User.findById(userId)

    if(!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User Not FOund") 
    }

    if(user.isDeleted) {
        throw new ApiError(StatusCodes.FORBIDDEN, "User is deleted")
    }
    return user 
} 


const updateMyProfile = async (userId:string, payload: UpdateMyProfilePayload, files: any ) => {
    const user =  await User.findById(userId)
        if(!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User Not FOund") 
    }

    if(user.isDeleted) {
        throw new ApiError(StatusCodes.FORBIDDEN, "User is deleted")
    }

    // handle image

    const newImagePath = getSingleFilePath(files, 'profileImage')
    if(newImagePath ){
        if(user.profileImage) {
            unlinkFile(user.profileImage)  // delete user image if exist
        }   
        payload  = { ...payload, profileImage: newImagePath} as any
    }
    
    const updated = await User.findByIdAndUpdate(
        userId, 
        {$set: payload},
        {new: true, runValidators: true}
    
    ).lean()


    return updated

}


