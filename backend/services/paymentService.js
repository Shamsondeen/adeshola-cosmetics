const axios = require('axios');
const Order = require('../models/Order');

const flutterwaveSecretKey = process.env.FLUTTERWAVE_SECRET_KEY;

exports.initializePayment = async (order, callbackUrl) => {
  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: order._id.toString(),
        amount: order.totalAmount + (order.shippingPrice || 0),
        currency: 'NGN',
        payment_options: 'card, banktransfer, ussd',
        redirect_url: callbackUrl,
        customer: {
          email: order.user.email,
          name: order.user.name
        },
        customizations: {
          title: 'Luxury Cosmetics',
          description: `Payment for Order #${order._id}`,
          logo: 'https://your-logo-url.com/logo.png'
        }
      },
      {
        headers: {
          Authorization: `Bearer ${flutterwaveSecretKey}`
        }
      }
    );

    return response.data.data.link;
  } catch (error) {
    console.error('Flutterwave payment initialization error:', error.response?.data || error.message);
    throw new Error('Payment initialization failed');
  }
};

exports.verifyPayment = async (transactionId) => {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${flutterwaveSecretKey}`
        }
      }
    );

    const paymentData = response.data.data;
    
    // Update order status based on payment verification
    const order = await Order.findById(paymentData.tx_ref);
    if (!order) {
      throw new Error('Order not found');
    }

    if (paymentData.status === 'successful' && paymentData.amount === order.totalAmount + (order.shippingPrice || 0)) {
      order.paymentStatus = 'completed';
      order.paymentReference = paymentData.flw_ref;
      await order.save();
      
      return { success: true, order };
    } else {
      order.paymentStatus = 'failed';
      await order.save();
      
      return { success: false, order };
    }
  } catch (error) {
    console.error('Flutterwave payment verification error:', error.response?.data || error.message);
    throw new Error('Payment verification failed');
  }
};