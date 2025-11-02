import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      required: false,
    },
    batch: {
      type: String,
      required: true,
    },
    linkedinId: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
    field: {
      type: String,
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
