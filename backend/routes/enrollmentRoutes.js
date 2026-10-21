
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  enrollInCourse,
  getMyEnrollments,
} = require("../controllers/enrollmentController");

// Both endpoints require login
router.post("/", protect, enrollInCourse);
router.get("/my-courses", protect, getMyEnrollments);

module.exports = router;
