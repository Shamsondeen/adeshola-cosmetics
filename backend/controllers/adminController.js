const Product = require("../models/Product");
const Order = require("../models/Order");
const catchAsync = require("../utils/catchAsync");

exports.getDashboardStats = catchAsync(async (req, res) => {
  const [totalProducts, availableProducts, soldOutProducts, totalOrders, pendingOrders, completedOrders, revenue] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "available" }),
    Product.countDocuments({ status: "sold-out" }),
    Order.countDocuments(),
    Order.countDocuments({ status: { $in: ["created", "pending", "awaiting-confirmation"] } }),
    Order.countDocuments({ status: "delivered" }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }])
  ]);
  res.json({ status: "success", data: { totalProducts, availableProducts, soldOutProducts, totalOrders, pendingOrders, completedOrders, revenue: revenue[0]?.total || 0 } });
});
