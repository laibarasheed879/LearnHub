const mongoose = require("mongoose");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users." });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "instructor", "admin"].includes(role)) {
      return res.status(400).json({ message: "Choose a valid user role." });
    }
    if (String(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "You cannot change your own role." });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }
    if (
      existingUser.role === "admin" &&
      role !== "admin" &&
      (await User.countDocuments({ role: "admin" })) <= 1
    ) {
      return res.status(409).json({
        message: "At least one administrator account must remain active.",
      });
    }
    if (
      existingUser.role === "instructor" &&
      role !== "instructor" &&
      (await Course.exists({ instructorId: existingUser._id }))
    ) {
      return res.status(409).json({
        message: "Reassign or delete this instructor's courses before changing the role.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    return res.status(200).json({
      message: "User role updated successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user role." });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }
    if (String(req.params.id) === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (
      user.role === "admin" &&
      (await User.countDocuments({ role: "admin" })) <= 1
    ) {
      return res.status(409).json({
        message: "At least one administrator account must remain active.",
      });
    }

    if (
      user.role === "instructor" &&
      (await Course.exists({ instructorId: user._id }))
    ) {
      return res.status(409).json({
        message: "Delete or reassign this instructor's courses before removing the account.",
      });
    }

    await Enrollment.deleteMany({ student: user._id });
    await user.deleteOne();
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user." });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const [users, courses, enrollments, progress] = await Promise.all([
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Enrollment.aggregate([
        { $group: { _id: null, average: { $avg: "$progress" } } },
      ]),
    ]);

    const usersByRole = users.reduce((result, item) => {
      result[item._id] = item.count;
      return result;
    }, { student: 0, instructor: 0, admin: 0 });

    return res.status(200).json({
      users: Object.values(usersByRole).reduce((total, count) => total + count, 0),
      usersByRole,
      courses,
      enrollments,
      averageProgress: Math.round(progress[0]?.average || 0),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load analytics." });
  }
};

module.exports = { getUsers, updateUserRole, deleteUser, getAnalytics };
