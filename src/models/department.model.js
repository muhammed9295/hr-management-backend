import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema(
  {
    department: {
      type: String,
      required: true,
    },
    totalEmployees: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);
