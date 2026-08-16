const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const Order = require('../models/Order');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.firstName = user.name.split(' ')[0];
    this.url = url;

    // IMPORTANT: Only email address goes inside <> — not the name
    this.from = `Adeshola Cosmetics <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // smtp.gmail.com
      port: process.env.EMAIL_PORT, // 587
      secure: false, // MUST be false for port 587
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false, // prevents greeting timeout
      }
    });
  }

  async send(template, subject, locals = {}) {
    // 1) Render HTML
    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      {
        name: this.name,
        firstName: this.firstName,
        url: this.url,
        subject,
        ...locals
      }
    );

    // 2) Options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    };

    // 3) Send
    return await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Luxury Cosmetics!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)'
    );
  }

  async sendOrderConfirmation(order) {
    await this.send(
      'orderConfirmation',
      'Your Luxury Cosmetics Order Confirmation',
      { order }
    );
  }

  async sendOrderStatusUpdate(order) {
    await this.send(
      'orderStatusUpdate',
      `Update on Your Order #${order._id.toString().slice(-6)}`,
      { order }
    );
  }

  /**
   * ADMIN NOTIFICATION — standalone static method
   */
  static async sendNewOrderNotification(order, adminEmail) {
    const html = pug.renderFile(
      `${__dirname}/../views/email/newOrderNotification.pug`,
      {
        order,
        user: order.user,
        firstName: order.user?.name?.split(' ')[0] || 'Admin'
      }
    );

    const mailOptions = {
      from: `"Luxury Cosmetics" <${process.env.EMAIL_USERNAME}>`,
      to: adminEmail,
      subject: '🛒 New Order Received',
      html,
      text: htmlToText(html)
    };

    return await nodemailer
      .createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // required for port 587
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        },
        tls: {
          rejectUnauthorized: false,
        }
      })
      .sendMail(mailOptions);
  }

  /**
   * Combined method — sends to both customer and admin
   */
  static async sendOrderEmails(orderId, adminEmail) {
    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product', 'name price');

    if (!order) throw new Error('Order not found');

    // Customer emails
    const customerEmail = new Email(order.user);
    await customerEmail.sendOrderConfirmation(order);
    await customerEmail.sendOrderStatusUpdate(order);

    // Admin email
    await Email.sendNewOrderNotification(order, adminEmail);
  }
};
