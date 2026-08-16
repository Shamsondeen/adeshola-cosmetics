const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const ApiFeatures = require('../utils/apiFeatures');


exports.createProduct = asyncHandler(async (req, res) => {
  let {
    name,
    description,
    price,
    discountedPrice,
    category,
    stock,
  } = req.body;

  
  price = Number(price);
  stock = Number(stock);
  if (discountedPrice) discountedPrice = Number(discountedPrice);

  const images = req.files && req.files.length > 0
    ? req.files.map((file) => file.path)
    : [];

  if (images.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }


  const status = stock > 0 ? "available" : "sold-out";

  const product = await Product.create({
    name,
    description,
    price,
    discountedPrice,
    category,
    stock,
    images,
    status
  });

  res.status(201).json(product);

});



exports.getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ createdAt: -1 })
  res.json(products);
});

exports.getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  // Count total products
  const totalProducts = await Product.countDocuments();

  // Fetch paginated products
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    products,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit),
    totalProducts
  });
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const products = await features.query;

  res.json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

exports.getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

  exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const features = new ApiFeatures(
    Product.find({ category: req.params.category }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
   
  const products = await features.query;

  res.json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountedPrice,
    images,
    category,
    stock,
    status,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.discountedPrice = discountedPrice !== undefined ? discountedPrice : product.discountedPrice;
  product.images = images || product.images;
  product.category = category || product.category;
  product.stock = stock !== undefined ? stock : product.stock;
  product.status = status || product.status;

  const updatedProduct = await product.save();
  
  res.json({
    status: 'success',
    data: {
      product: updatedProduct
    }
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await product.deleteOne();
  
  res.json({
    status: 'success',
    data: null
  });
});

// Update only product status (Admin)
exports.updateProductStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.status = status;
  await product.save();

  res.json(product); // always return updated product
});


exports.getProductStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const productsByStatus = await Product.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { status: "$_id", count: 1, _id: 0 } }
  ]);

  res.json({
    totalProducts,
    productsByStatus
  });
});

exports.searchProducts = asyncHandler(async (req, res) => {
  const { keyword, category } = req.query;

  let query = {};

  if (keyword) {
    query.name = {
      $regex: keyword,
      $options: 'i',
    };
  }

  if (category) {
    query.category = category;
  }

  const products = await Product.find(query);
  res.json(products);
});

