import { Request, Response } from "express";

export const getMe = (req: Request, res: Response) => {

    console.log(req.user)
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};


export const userController = {  
    getMe
}