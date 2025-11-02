import User from "../models/userModel.js";

// ✅ Create User (with photo upload)
export const createUser = async (req, res) => {
  try {
    const { name, batch, linkedinId, field } = req.body;
    const photo = req.file ? req.file.path : null; // uploaded via Cloudinary

    const existingUser = await User.findOne({ linkedinId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      photo,
      batch,
      linkedinId,
      field,
    });

    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Edit User (with optional photo update)
export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (req.file) {
      updates.photo = req.file.path; // new uploaded image
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error editing user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Users by Batch
export const getUsersByBatch = async (req, res) => {
  try {
    const { batch } = req.params;
    const users = await User.find({ batch });

    if (!users || users.length === 0)
      return res.status(404).json({ message: "No users found for this batch" });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching batch users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
