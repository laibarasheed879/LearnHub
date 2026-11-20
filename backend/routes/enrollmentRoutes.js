
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const requireRoles = require("../middleware/roleMiddleware");

const {
  enrollInCourse,
  getMyEnrollments,
} = require("../controllers/enrollmentController");

// Both endpoints require login
router.post("/", protect, requireRoles("student"), enrollInCourse);
router.get("/my-courses", protect, requireRoles("student"), getMyEnrollments);

module.exports = router;
