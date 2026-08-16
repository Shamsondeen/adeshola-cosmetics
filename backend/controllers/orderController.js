const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const asyncHandler = require("express-async-handler");
const { paymentService } = require("../services/paymentService");
const Email = require("../services/emailService");

exports.addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice = 0,
  } = req.body;

  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Not authorized, user missing");
  }

  let itemsPrice = 0;
  let totalAmount = 0;

  if (orderItems && orderItems.length > 0) {
    itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    totalAmount = itemsPrice + shippingPrice;
  }

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  let createdOrder = await Order.create({
    user: req.user._id,
    items: orderItems.map((item) => ({
      product: item.product,
      quantity: item.qty,
      price: item.price,
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalAmount: totalAmount || req.body.totalAmount,
    paymentStatus:
      paymentMethod === "bank-transfer" || paymentMethod === "pay-on-delivery"
        ? "pending"
        : "initiated",
    status: "created",
  });

  createdOrder = await createdOrder.populate("user", "name email");

  // 📩 Notify admin of new order
  await Email.sendNewOrderNotification(
    createdOrder,
    process.env.ADMIN_EMAIL || "admin@example.com"
  );

  // 📩 Send confirmation to customer
  const customerEmail = new Email(createdOrder.user);
  await customerEmail.sendOrderConfirmation(createdOrder);

  res.status(201).json(createdOrder);
});

exports.getAllOrders = catchAsync(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: { orders },
  });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid or missing order ID" });
  }

  const order = await Order.findById(id).populate("user", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (order.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to view this order" });
  }

  res.json({ success: true, data: order });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(400).json({ message: "Invalid user in request" });
  }

  const orders = await Order.find({ user: req.user._id })
    .sort("-createdAt")
    .populate("items.product", "name price images");

  res.json(orders);
});

exports.updateOrderStatus = catchAsync(async (req, res) => {
  const { status, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();

  // 📩 Send confirmation if payment is completed
  if (paymentStatus === "completed") {
    const user = await User.findById(order.user);
    if (user) {
      await new Email(user).sendOrderConfirmation(order);
    }
  }

  // 📩 Always send an order status/payment update email to customer
  if (order.user) {
    await new Email(order.user).sendOrderStatusUpdate(order);
  }

  res.json({ success: true, data: order });
});

// controllers/orderController.js
// controllers/orderController.js
exports.getMonthlySales = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const sales = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01T00:00:00Z`),
          $lte: new Date(`${year}-12-31T23:59:59Z`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalSales: { $sum: "$totalAmount" },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Always build an array of 12 months
  const result = months.map((month, index) => {
    const monthData = sales.find((s) => s._id === index + 1);
    return monthData ? monthData.totalSales : 0;
  });

  res.json({
    labels: months,
    data: result,
    year,
  });
});


// Get distinct order years
exports.getAvailableYears = asyncHandler(async (req, res) => {
  const years = await Order.aggregate([
    {
      $group: {
        _id: { $year: "$createdAt" }, // extract year from createdAt
      },
    },
    { $sort: { "_id": 1 } }, // sort ascending
  ]);

  // Format response into a simple array of years
  const yearList = years.map((y) => y._id);

  res.json({ years: yearList });
});




exports.confirmBankTransfer = asyncHandler(async (req, res) => {
  const { id } = req.params; // order id
  const order = await Order.findById(id).populate("user", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.paymentMethod !== "bank-transfer") {
    return res.status(400).json({ message: "Not a bank transfer order" });
  }

  order.paymentStatus = "pending";
  order.status = "awaiting-confirmation";
  await order.save();

  // 📩 Notify admin of new bank transfer order
  await Email.sendNewOrderNotification(
    order,
    process.env.ADMIN_EMAIL || "admin@example.com"
  );

  // 📩 Notify customer of update
  await new Email(order.user).sendOrderStatusUpdate(order);

  res.json({
    success: true,
    message: "Payment reported. Awaiting admin confirmation.",
    data: order,
  });
});

exports.initiatePayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to pay for this order");
  }

  const callbackUrl = `${process.env.BACKEND_URL}/api/orders/${order._id}/verify-payment`;
  const paymentLink = await paymentService.initializePayment(order, callbackUrl);

  res.json({ paymentLink });
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const { transaction_id } = req.query;
  if (!transaction_id) {
    res.status(400);
    throw new Error("Transaction ID is required");
  }

  const { success, order } = await paymentService.verifyPayment(transaction_id);

  if (success) {
    order.paymentStatus = "completed";
    order.status = "paid";
    await order.save();

    const user = await User.findById(order.user);
    if (user) {
      await new Email(user).sendOrderConfirmation(order);
      await new Email(user).sendOrderStatusUpdate(order); // 📩 Send status update too
    }

    await Email.sendNewOrderNotification(
      order,
      process.env.ADMIN_EMAIL || "admin@example.com"
    );

    res.redirect(`${process.env.FRONTEND_URL}/order-success/${order._id}`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/order-failed/${order._id}`);
  }
});
