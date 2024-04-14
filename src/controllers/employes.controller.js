import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Employee } from "../models/employes.model.js";

const addEmployees = asyncHandler(async (req, res) => {
  // Get all employees info from the frontend
  const {
    firstName,
    lastName,
    qualification,
    yearOfExperience,
    department,
    email,
    phoneNumber,
  } = req.body;

  // Check all the required fields are not empty
  if (
    [firstName, lastName, yearOfExperience, department, phoneNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new apiError(400, "All fields are required");
  }

  // Check for images or avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }

  // Upload avatar to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new apiError(400, "Avatar upload failed, file is not fetched");
  }

  // Create employees object and create in database
  const employees = await Employee.create({
    firstName,
    lastName,
    qualification,
    yearOfExperience,
    department,
    email,
    phoneNumber,
    avatar: avatar.url,
  });

  // Final check if the user is created successfully
  if (!employees) {
    throw new apiError(
      500,
      "Something went wrong while registering an employee"
    );
  }
  // Return employee object response.
  return res
    .status(200)
    .json(new apiResponse(200, employees, "Employee created successfully"));
});

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({});

  if (!employees) {
    throw new apiError(500, "Something went wrong while fetching employees");
  }

  return res
    .status(200)
    .json(new apiResponse(200, employees, "Employee fetched successfully"));
});

const getSingleEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id?.trim()) {
    throw new apiError(400, "Employee id is required");
  }

  const singleEmployee = await Employee.findById(id);

  if (!singleEmployee) {
    throw new apiError(404, "Employee not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, singleEmployee, "Employee found successfully"));
});

const updateSingleEmployee = asyncHandler(async (req, res) => {
  const {
    id,
    firstName,
    lastName,
    qualification,
    yearOfExperience,
    department,
    email,
    phoneNumber,
  } = req.body;

  const avatarLocalPath = req.file?.path;

  const newAvatar = !avatarLocalPath
    ? ""
    : await uploadOnCloudinary(avatarLocalPath);

  const updatedFields = {
    id,
    firstName,
    lastName,
    qualification,
    yearOfExperience,
    department,
    email,
    phoneNumber,
    avatar: newAvatar.url,
  };
  Object.keys(updatedFields).forEach(
    (key) =>
      (updatedFields[key] === "" || undefined) && delete updatedFields[key]
  );

  const employee = await Employee.findByIdAndUpdate(
    id,
    {
      $set: updatedFields,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new apiResponse(200, employee, "Employee updated"));
});

const deleteSingleEmployee = asyncHandler(async (req, res) => {
  
  try {
    //Get the id from the url params
    const { id } = req.params;
  
    // Validate the id
    if (!id?.trim()) {
      throw new apiError(400, "Employee id is required");
    }
  
    //Find the id on the Employee database and delete it
    const employee = await Employee.findByIdAndDelete(id);
  
    if (!employee) {
      throw new apiError(404, "Employee not found");
    }
    // Send the response
    return res
      .status(200)
      .json(new apiResponse(200, employee, "Employee deleted successfully"));
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).send({ message: "Error deleting employee" });
  }
});

export {
  addEmployees,
  getEmployees,
  getSingleEmployee,
  updateSingleEmployee,
  deleteSingleEmployee,
};
