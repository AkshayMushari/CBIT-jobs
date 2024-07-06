import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { ErrorHandler } from "../middlewares/error.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

// Post an application
export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.body;
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }
  req.body.applicantID = { user: req.user._id, role: "Job Seeker" };
  req.body.employerID = { user: job.postedBy, role: "Employer" };
  const application = await Application.create(req.body);
  res.status(201).json({
    success: true,
    application,
  });
});

// Get all applications for an employer
export const employerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const applications = await Application.find({ "employerID.user": req.user._id });
  res.status(200).json({
    success: true,
    applications,
  });
});

// Get all applications for a job seeker
export const jobseekerGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const applications = await Application.find({ "applicantID.user": req.user._id });
  res.status(200).json({
    success: true,
    applications,
  });
});

// Delete an application
export const jobseekerDeleteApplication = catchAsyncErrors(async (req, res, next) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    return next(new ErrorHandler("Application not found", 404));
  }
  if (application.applicantID.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("You are not authorized to delete this application", 403));
  }
  await application.remove();
  res.status(200).json({
    success: true,
    message: "Application deleted successfully",
  });
});
