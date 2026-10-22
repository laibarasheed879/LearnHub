const express = require("express");
const cors = require("cors");
require("dotenv").config();
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const connectDB = require("./config/db");
const courseRoutes = require("./routes/courseRoutes");
const app = express();
const authRoutes = require("./routes/authRoutes");
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
// Connect to MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to LearnHub API!" });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`LearnHub server running on port ${PORT}`);
  });
}

module.exports = app;