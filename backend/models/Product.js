const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  images: [{ type: String, required: true }],
  category: { 
    type: String, 
    required: true,
    enum: ['skincare', 'makeup', 'haircare', 'fragrance', 'bath-body', 'men', 'women'] 
  },
  stock: { type: Number, required: true, default: 0 },
  slug: { type: String, unique: true, lowercase: true },
  status: { 
    type: String, 
    enum: ['available', 'sold-out', 'coming-soon'], 
    default: 'available' 
  },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


productSchema.pre('save', function(next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/ /g, "-");
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);