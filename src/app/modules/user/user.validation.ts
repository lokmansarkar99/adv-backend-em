import {z} from "zod"
import { USER_ROLES } from "../../../enums/user"


const createRegisterZodSchema = z.object({
    body: z.object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
        role: z.enum([USER_ROLES.ADMIN, USER_ROLES.USER]).default(USER_ROLES.USER),
        profileImage:z.string().optional(),

        

    })
})


const createLoginZodSchema = z.object({
    body: z.object({
        email: z.string({message: "Email is required"}).email("Invalid email address"),
        password: z.string({ message: "Password is required" }).min(8, "Password must be at least 8 characters long")
    })
})



export const AuthValidation = {
    createRegisterZodSchema,
    createLoginZodSchema
}

  type RegisterPayload = z.infer<
  typeof createRegisterZodSchema
>["body"];

type LoginPayload = z.infer<
  typeof createLoginZodSchema
>["body"];

export type {RegisterPayload, LoginPayload}