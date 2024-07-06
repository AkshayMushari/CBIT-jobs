import { Job } from "../models/jobSchema.js";
import { ErrorHandler } from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

// Create a new job
export const postJob = catchAsyncErrors(async (req, res, next) => {
  req.body.postedBy = req.user._id;
  const job = await Job.create(req.body);
  res.status(201).json({
    success: true,
    job,
  });
});

// Get all jobs
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find();
  res.status(200).json({
    success: true,
    jobs,
  });
});

// Get a single job by ID
export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }
  res.status(200).json({
    success: true,
    job,
  });
});

// Get jobs posted by the logged-in employer
export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    jobs,
  });
});

// Update a job by ID
export const updateJob = catchAsyncErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id);
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }
  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    job,
  });
});

// Delete a job by ID
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }
  await job.remove();
  res.status(200).json({
    success: true,
    message: "Job deleted successfully",
  });
});
