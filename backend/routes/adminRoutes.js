const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const requireRoles = require("../middleware/roleMiddleware");
const {
  getUsers,
  updateUserRole,
  deleteUser,
  getAnalytics,
} = require("../controllers/adminController");

router.use(protect, requireRoles("admin"));
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/analytics", getAnalytics);

module.exports = router;
