const mongoose = require("mongoose");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");

const canManageCourse = (course, user) =>
  user.role === "admin" || String(course.instructorId) === user.id;

const canAccessCourse = async (course, user) => {
  if (canManageCourse(course, user)) return true;
  if (user.role !== "student") return false;

  return Boolean(
    await Enrollment.exists({ course: course._id, student: user.id })
  );
};

const getCourseLessons = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (!(await canAccessCourse(course, req.user))) {
      return res.status(403).json({
        message: "Enroll in this course to access its lessons.",
      });
    }

    const lessons = await Lesson.find({ course: course._id })
      .select("-fileData")
      .sort({ createdAt: 1 });
    return res.status(200).json(lessons);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch course lessons." });
  }
};

const uploadLesson = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.courseId)) {
      return res.status(400).json({ message: "Invalid course ID." });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (!canManageCourse(course, req.user)) {
      return res.status(403).json({
        message: "You can only add lessons to courses assigned to you.",
      });
    }

    const title = req.body.title?.trim();
    if (!title || !req.file) {
      return res.status(400).json({
        message: "Lesson title and file are required.",
      });
    }

    const lesson = await Lesson.create({
      course: course._id,
      instructor: req.user.id,
      title,
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
      fileData: req.file.buffer,
    });

    const result = lesson.toObject();
    delete result.fileData;
    return res.status(201).json({
      message: "Lesson uploaded successfully.",
      lesson: result,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Failed to upload lesson." });
  }
};

const downloadLesson = async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.courseId) ||
      !mongoose.isValidObjectId(req.params.lessonId)
    ) {
      return res.status(400).json({ message: "Invalid course or lesson ID." });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (!(await canAccessCourse(course, req.user))) {
      return res.status(403).json({
        message: "Enroll in this course to access its lessons.",
      });
    }

    const lesson = await Lesson.findOne({
      _id: req.params.lessonId,
      course: course._id,
    }).select("+fileData");

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    const safeFileName = lesson.fileName.replace(/["\\\r\n]/g, "_");
    res.set("Content-Type", lesson.contentType);
    res.set("Content-Disposition", `attachment; filename="${safeFileName}"`);
    res.set("X-Content-Type-Options", "nosniff");
    return res.status(200).send(lesson.fileData);
  } catch (error) {
    return res.status(500).json({ message: "Failed to download lesson." });
  }
};

const deleteLesson = async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.courseId) ||
      !mongoose.isValidObjectId(req.params.lessonId)
    ) {
      return res.status(400).json({ message: "Invalid course or lesson ID." });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (!canManageCourse(course, req.user)) {
      return res.status(403).json({
        message: "You can only remove lessons from courses assigned to you.",
      });
    }

    const lesson = await Lesson.findOneAndDelete({
      _id: req.params.lessonId,
      course: course._id,
    });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found." });
    }

    return res.status(200).json({ message: "Lesson deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete lesson." });
  }
};

module.exports = {
  getCourseLessons,
  uploadLesson,
  downloadLesson,
  deleteLesson,
};
