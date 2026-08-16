const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers } = require("../controllers/authController");
const { protect } = require("../middleware/userAuth");
const { protectAdmin } = require("../middleware/adminAuth");

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/users", protectAdmin, getAllUsers);
module.exports = router;
