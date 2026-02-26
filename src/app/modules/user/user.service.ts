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



// ADMIN : Get All Users

const getAllUsers = async (query: Record<string, unknown>) => {
        const page = Number(query.page) || 1
        const limit = Number(query.limit) || 10 
       const skip = (page - 1) * limit;


       const filter: Record<string, unknown> = {isDeleted: false}

       if(query.role) filter.role = query.role
       if(query.search) {
        filter.$or = [
            {email: { 
                $regex: query.search, $options:  "i"
            }}
        ]
       }

       const [users, total] = await Promise.all([
        User.find(filter).skip(skip).limit(limit).lean(),
        User.countDocuments(filter)
       ])
}


export const UserService = {
    getMyProfile,
    updateMyProfile,
    getAllUsers
}