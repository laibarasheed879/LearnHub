
const express = require("express");
const router = express.Router();

const {
  getCourses,
  getCourseById,
  getMyCourses,
  getInstructorEnrollments,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");
const requireRoles = require("../middleware/roleMiddleware");
const multer = require("multer");
const {
  getCourseLessons,
  uploadLesson,
  downloadLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const acceptedLessonTypes = new Set([
  "application/pdf",
  "text/plain",
  "video/mp4",
  "video/quicktime",
  "video/webm",
]);
const parseLessonUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!acceptedLessonTypes.has(file.mimetype)) {
      return callback(
        new Error("Upload a PDF, plain text, or MP4, MOV, or WebM video.")
      );
    }
    return callback(null, true);
  },
}).single("file");

const handleLessonUpload = (req, res, next) => {
  parseLessonUpload(req, res, (error) => {
    if (error) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      return res.status(status).json({ message: error.message });
    }
    return next();
  });
};

// Public routes: anyone can view courses
router.get("/", getCourses);
router.get(
  "/my-courses",
  protect,
  requireRoles("instructor"),
  getMyCourses
);
router.get(
  "/instructor/enrollments",
  protect,
  requireRoles("instructor"),
  getInstructorEnrollments
);
router.get(
  "/:courseId/lessons",
  protect,
  requireRoles("admin", "instructor", "student"),
  getCourseLessons
);
router.post(
  "/:courseId/lessons",
  protect,
  requireRoles("admin", "instructor"),
  handleLessonUpload,
  uploadLesson
);
router.get(
  "/:courseId/lessons/:lessonId/file",
  protect,
  requireRoles("admin", "instructor", "student"),
  downloadLesson
);
router.delete(
  "/:courseId/lessons/:lessonId",
  protect,
  requireRoles("admin", "instructor"),
  deleteLesson
);
router.get("/:id", getCourseById);

// Admins manage the catalogue; instructors manage only their own courses.
router.post("/", protect, requireRoles("admin", "instructor"), createCourse);
router.put("/:id", protect, requireRoles("admin", "instructor"), updateCourse);
router.delete(
  "/:id",
  protect,
  requireRoles("admin", "instructor"),
  deleteCourse
);

module.exports = router;
