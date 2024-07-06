import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a user
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;
  const user = await User.create({ name, email, password, phone, role });
  const token = user.getJWTToken();
  res.status(201).json({
    success: true,
    token,
    user,
  });
});

// Login a user
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  const token = user.getJWTToken();
  res.status(200).json({
    success: true,
    token,
    user,
  });
});

// Logout a user
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Get user details
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});
