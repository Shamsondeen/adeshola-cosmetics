const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");

const protectAdmin = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return res.status(401).json({ message: "Not authorized" });
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(401).json({ message: "Admin not found" });
    req.admin = admin; next();
  } catch { return res.status(401).json({ message: "Invalid or expired admin token" }); }
});
module.exports = { protectAdmin };
