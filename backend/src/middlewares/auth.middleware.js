import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';

export const verifyUser=asyncHandler(async(req,_,next)=>{
    try {
        
        const token =req.cookies?.accessToken || req.header("Authorisation")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorised")
        }
        const decodededToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodededToken._id);
        if(!user){
            throw new ApiError(401,"Invalid Token")
        }

        req.user = user;
        next()
    } catch (error) {
        
    }
})
