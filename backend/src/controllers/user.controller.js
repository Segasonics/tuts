import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {redis} from '../lib/redis.js'

const generateRefreshAndAccessToken=async(userId)=>{
   try {
      console.log("User ID:", userId);
      const user = await User.findById(userId);
      console.log("Fetched User:", user);
      if (!user) {
         throw new ApiError(404, "User not found");
       }
      const refreshToken = user.generateRefreshToken();
      const accessToken = user.generateAccessToken();

      user.refreshToken = refreshToken;
      console.log("Before saving:", user);
      await user.save({validateBeforeSave:false});
      console.log("After saving:", user);

      return {refreshToken,accessToken}
   } catch (error) {
      throw new ApiError(500,"Something went wrong while generating tokens")
   }
}

const storeRefreshToken =async(userId,refreshToken)=>{
   await redis.set(`refreshToken:${userId}`,refreshToken,"EX",7*24*60*60)
}

const registerUser = asyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;

    if([username,email,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }
     const existingUser= await User.findOne({$or:[{email},{username}]});
     if(existingUser){
        throw new ApiError(409,"User already exist")
     }

     const user = await User.create({
        username,
        email,
        password
     });

     const findUser = await User.findById(user._id).select("-password -refreshToken")
     if(!user){
        throw new ApiError(500,"Sorry something went wrong while registering");

     }

     return res
     .status(201)
     .json( new ApiResponse(201,findUser,"Registered successfully"))
});

const loginUser=asyncHandler(async(req,res)=>{
   const{email,password}=req.body;

   if(!email || !password){
      throw new ApiError(500,"email or password is required")
   };

   const user= await User.findOne({email});
   if(!user){
      throw new ApiError(404, "user does not exist")
   }

   const isPasswordValid = await user.isPasswordCorrect(password);
   if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials")
   }

   const {refreshToken,accessToken}=await generateRefreshAndAccessToken(user?._id);
   await storeRefreshToken(user._id,refreshToken)
   
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   await redis.set(`user:${user._id}`, JSON.stringify(loggedInUser), "EX", 600);
   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new ApiResponse(
            200,
            {
               user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
         )
      )

})

const logoutUser = asyncHandler(async (req, res) => {
   const userId=req.user._id;

   if(userId){
      await redis.del(`refreshToken:${userId}`)
   }
   await User.findByIdAndUpdate(
      //got this req.user from the middleware
      userId,
      {


         $unset: {
            refreshToken: 1 //This removes the field from the document
         }
      },
      {
         new: true
      }

   )
  

   const options={
      httpOnly:true,
      secure:true
   }
   return res.status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged Out"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
   const userId = req.user._id;
   const cachedUser = await redis.get(`user:${userId}`);
   if (cachedUser) {
     console.log("User data retrieved from Redis");
     return res.status(200).json(new ApiResponse(200, JSON.parse(cachedUser), "User authenticated (cached)"));
   }

   const user = await User.findById(userId).select("-password -refreshToken");
   if (!user) {
     throw new ApiError(401, "Unauthorized: User not found");
   }
 
   await redis.set(`user:${userId}`, JSON.stringify(user), "EX", 600);
   return res.status(200).json(new ApiResponse(200, user, "User authenticated"));
 });
 

export {registerUser,loginUser,logoutUser,getCurrentUser}