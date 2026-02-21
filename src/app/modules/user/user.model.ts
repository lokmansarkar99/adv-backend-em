import {Schema, model} from "mongoose"
import { IUser } from "./user.interface"
import { STATUS, USER_ROLES } from "../../../enums/user"
import  bcrypt  from 'bcrypt';
import config from "../../../config";


const userSchema = new Schema<IUser>(
  {
  name: {
    type: String,
    required:true
  },

  role: {
    type:String,
    enum: Object.values(USER_ROLES),
    required: true,
    default: USER_ROLES.USER
  },

  email: {
    type: String,
    required: true,
    unique:true,
    lowercase: true,
  },

  profileImage: {
    type: String,
    required: false,
    default: ""
  },

  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8
  },

  status: {
    type: String,
    enum: Object.values(STATUS),
    default: STATUS.ACTIVE
  },

  verified: {
    type: Boolean,
    default: false
  },

  authentication: {
    type: {
      isResetPassword: {
        type: Boolean,
        default:false
      },
      oneTimeCode: {
        type: Number,
        default: null
      },
      expiredAt: {
        type: Date,
        default: null
      }
    },
    default: {
      isResetPassword: false,
      oneTimeCode: null,
      expiredAt: null
    }, 
    select: false
  }

}, {
  timestamps: true
})



// Middlewares

userSchema.pre("save", async function () {
  if(this.isNew) {

    if(this.password) {
      this.password = await bcrypt.hash(this.password,Number(config.bcrypt_salt_rounds),)
      
    }
  }

  else{
    if(this.isModified("password") && this.password ) {
      this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds))
    }
  }


  
})



export const User = model<IUser>("User", userSchema)