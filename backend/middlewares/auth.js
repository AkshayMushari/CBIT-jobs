import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import { ErrorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const decoded = jwt.verify(token, process.env.jabfbasaagfkasfk);
    
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    next(new ErrorHandler("Invalid Token", 401));
  }
});
