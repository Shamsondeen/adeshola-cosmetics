const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (await Admin.findOne({ email })) return res.status(400).json({ message: "Admin already exists" });
  const admin = await Admin.create({ name, email, password });
  res.status(201).json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await bcrypt.compare(password || "", admin.password))) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ token: generateToken(admin._id), admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
});

const getAdminProfile = asyncHandler(async (req, res) => {
  res.json({ user: { _id: req.admin._id, name: req.admin.name, email: req.admin.email, role: req.admin.role } });
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (await User.findOne({ email })) return res.status(400).json({ message: "User already exists" });
  const user = await User.create({ name, email, password, phone, address });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ token: generateToken(user._id), user: { id: user._id, _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role } });
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.json({ user: { _id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone, address: req.user.address, role: req.user.role } });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const allowed = ["name", "phone", "address"];
  allowed.forEach((field) => { if (req.body[field] !== undefined) user[field] = req.body[field]; });
  await user.save();
  res.json({ user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role } });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

module.exports = { registerAdmin, loginAdmin, getAdminProfile, registerUser, loginUser, getUserProfile, updateUserProfile, getAllUsers };
