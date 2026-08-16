const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'Nigeria' },
    postalCode: String
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['card', 'bank-transfer', 'pay-on-delivery'],
    default: 'card'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentReference: String,
  totalAmount: { type: Number, required: true },
  shippingPrice: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ['created', 'pending', 'shipped', 'delivered', 'awaiting-confirmation', 'cancelled'],
    default: 'created'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-update updatedAt before save
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-populate user (name, email) and items.product (name, price)
function autoPopulate(next) {
  this.populate('user', 'name email')
      .populate('items.product', 'name price');
  next();
}

// Only for queries
orderSchema.pre(/^find/, autoPopulate);


module.exports = mongoose.model('Order', orderSchema);
