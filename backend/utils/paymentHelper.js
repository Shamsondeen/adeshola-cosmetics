const axios = require('axios');
const Order = require('../models/Order');
const { sendPaymentSuccessEmail, sendPaymentFailureEmail } = require('./emailSender');

const initiatePayment = async (order, user) => {
  try {
    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      {
        tx_ref: order._id.toString(),
        amount: order.totalPrice,
        currency: 'NGN',
        payment_options: 'card',
        redirect_url: `${process.env.FRONTEND_URL}/order/${order._id}`,
        customer: {
          email: user.email,
          name: user.name,
        },
        customizations: {
          title: 'Cosmetics Store Payment',
          description: 'Payment for items in cart',
          logo: 'https://your-logo-url.com/logo.png',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return response.data.data.link;
  } catch (error) {
    console.error('Error initiating payment:', error.response ? error.response.data : error.message);
    throw new Error('Payment initiation failed');
  }
};

const verifyPayment = async (transactionId) => {
  try {
    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Error verifying payment:', error.response ? error.response.data : error.message);
    throw new Error('Payment verification failed');
  }
};

const handlePaymentWebhook = async (payload) => {
  const { tx_ref, status, transaction_id } = payload;

  try {
    const order = await Order.findById(tx_ref);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.isPaid) {
      return { message: 'Order already paid' };
    }

    if (status === 'successful') {
      const verification = await verifyPayment(transaction_id);

      if (
        verification.status === 'successful' &&
        verification.amount === order.totalPrice &&
        verification.currency === 'NGN'
      ) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: transaction_id,
          status: verification.status,
          update_time: Date.now(),
          email_address: verification.customer.email,
        };

        await order.save();

        // Send payment success email
        await sendPaymentSuccessEmail(order.user.email, order);

        return { message: 'Payment verified and order updated' };
      } else {
        throw new Error('Payment verification failed');
      }
    } else {
      // Send payment failure email
      const user = await User.findById(order.user);
      await sendPaymentFailureEmail(user.email, order);

      return { message: 'Payment failed' };
    }
  } catch (error) {
    console.error('Error handling payment webhook:', error.message);
    throw error;
  }
};

module.exports = { initiatePayment, verifyPayment, handlePaymentWebhook };