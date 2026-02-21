import { USER_ROLES, STATUS } from "../../../enums/user";

export type IUser = {
  name:string,
  role:USER_ROLES,
  email:string,
  profileImage: string,
  password: string,
  verified:boolean,
  phone?:string,
  status: STATUS,
  authentication?: {
    isResetPassword: boolean,
    oneTimeCode: number,
    expiredAt: Date
  }
}