
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "admin@learnhub.com";
    const password = "AdminLearnHub2026!";
    const name = "LearnHub Admin";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Admin email already exists.");
      console.log("Current role:", existingUser.role);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully!");
    console.log("Email:", email);
    console.log("Role: admin");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
