
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Enroll logged-in student in a course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required.",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });

    if (existing) {
      return res.status(409).json({
        message: "You are already enrolled in this course.",
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    res.status(201).json({
      message: "Successfully enrolled in course!",
      enrollment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You are already enrolled in this course.",
      });
    }

    res.status(500).json({
      message: "Failed to enroll in course.",
    });
  }
};

// Get logged-in student's enrolled courses
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.id,
    })
      .populate("course")
      .sort({ createdAt: -1 });

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load your enrollments.",
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
};
