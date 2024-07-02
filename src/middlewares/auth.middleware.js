import { ApiError } from "../utils/apiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import { jwt } from "jsonwebtoken";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError(404, "Unauthorized request")
        }
    
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodeToken?._Id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(404, "Invalid Access Token")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }

 })