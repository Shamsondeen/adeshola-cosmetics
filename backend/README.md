# Adeshola Cosmetics — Backend

Express/MongoDB REST API powering the Adeshola Cosmetics e-commerce platform.

## Features
- JWT authentication for customers and administrators
- Product management and Cloudinary image uploads
- Cart-independent order creation and order history
- Order status and payment tracking
- Flutterwave payment initialization/verification
- Transactional email notifications
- Admin sales statistics
- Security middleware, rate limiting and centralized error handling

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

Never commit `.env`.
