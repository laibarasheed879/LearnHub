
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");
const mongoose = require("mongoose");
const courseFields = [
  "title",
  "description",
  "instructor",
  "category",
  "price",
  "image",
  "duration",
  "level",
];

const getCourseFields = (body, includeInstructor = true) =>
  courseFields.reduce((fields, field) => {
    if (field !== "instructor" || includeInstructor) {
      if (body[field] !== undefined) fields[field] = body[field];
    }
    return fields;
  }, {});

// GET: All courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses." });
  }
};

// GET: Single course
const getCourseById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course." });
  }
};

// GET: Courses owned by the logged-in instructor
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your courses." });
  }
};

// GET: Enrollments for courses owned by the logged-in instructor
const getInstructorEnrollments = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user.id }).select("_id");
    const enrollments = await Enrollment.find({
      course: { $in: courses.map((course) => course._id) },
    })
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enrolled students." });
  }
};

// POST: Create course
const createCourse = async (req, res) => {
  try {
    const isInstructor = req.user.role === "instructor";
    const fields = getCourseFields(req.body, !isInstructor);
    const course = await Course.create({
      ...fields,
      ...(isInstructor
        ? { instructor: req.user.name, instructorId: req.user.id }
        : {}),
    });
    res.status(201).json({
      message: "Course created successfully!",
      course,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to create course." });
  }
};

// PUT: Update course
const updateCourse = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const existingCourse = await Course.findById(req.params.id);

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (
      req.user.role === "instructor" &&
      String(existingCourse.instructorId) !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only edit courses assigned to you.",
      });
    }

    const fields = getCourseFields(req.body, req.user.role === "admin");
    const course = await Course.findByIdAndUpdate(req.params.id, fields, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      message: "Course updated successfully!",
      course,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to update course." });
  }
};

// DELETE: Remove course
const deleteCourse = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (
      req.user.role === "instructor" &&
      String(course.instructorId) !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only delete courses assigned to you.",
      });
    }

    await course.deleteOne();
    await Promise.all([
      Enrollment.deleteMany({ course: course._id }),
      Lesson.deleteMany({ course: course._id }),
    ]);

    res.status(200).json({
      message: "Course deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course." });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  getMyCourses,
  getInstructorEnrollments,
  createCourse,
  updateCourse,
  deleteCourse,
};
