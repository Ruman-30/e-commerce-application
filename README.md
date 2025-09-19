🛒 E-Commerce Backend (Express + MongoDB + Redis + Razorpay)

A production-ready backend API for a modern e-commerce platform, built with Node.js, Express, MongoDB, and Redis.
It supports authentication, payments, product management, carts, orders, reviews, OAuth login, caching, and secure token refresh flow — all following industry best practices.

🚀 Features
🔐 Authentication & Security

JWT Access + Refresh tokens (with rotation & DB replacement).

Google OAuth 2.0 login.

Forgot/Reset password flow using crypto tokens (15 min expiry).

Secure cookies for refresh tokens.

Rate limiting with Redis + express-rate-limit.

Input validation with express-validator.

Protected routes (role-based: admin vs user).

👤 User Management

Register & login with email/password.

Google login support.

Logout with refresh token invalidation.

Forgot/reset password with secure email verification (SendGrid).

📦 Products

Create, update, delete (admin only).

Product image upload via Multer + Cloudinary.

Pagination, filtering, and category-based search.

MongoDB Atlas Search for full-text search.

Redis caching for product lists & single products.

🛒 Cart

Persistent cart per user (1 active cart per user).

Add/update/remove items.

Clear cart.

Auto-create cart when adding first item.

📑 Orders

Place order from cart (COD & Online).

Razorpay payment integration.

COD → instant email + stock deduction.

Online payment → order confirmation after payment.

Order update/delete routes.

Email notifications for order confirmation.

⭐ Reviews

Only users who purchased a product can review.

Rating + text stored.

Product average rating + count updated automatically.

📧 Emails

SendGrid for transactional emails (password reset, order confirmation).

⚡ Performance

Redis caching for frequently accessed product data.

Redis-backed rate limiting.

Efficient MongoDB queries with pagination, limit & skip.

🗂️ Project Structure
.
├── config/         # Config files (env, keys, DB, etc.)
├── controllers/    # Route controllers
├── dao/            # Data access layer
├── db/             # Database connection
├── docs/           # Swagger/OpenAPI docs
├── middleware/     # Auth, error handling, rate limiters
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── services/       # Business logic
├── utils/          # Helpers (tokens, validators, etc.)


This layered architecture separates concerns and makes the project scalable & production-ready.

🛠️ Tech Stack

Backend Framework: Express.js

Database: MongoDB Atlas
 + Mongoose

Cache / Rate Limiting: Redis

Authentication: JWT (access & refresh tokens), Google OAuth

File Storage: Cloudinary

Emails: SendGrid

Payments: Razorpay

Validation: express-validator

API Docs: Swagger/OpenAPI

🔒 Security Best Practices

HttpOnly, Secure cookies for refresh tokens.

Passwords hashed with bcrypt.

Rate limiting & brute force protection.

Input sanitization & validation.

Refresh token rotation (replaces old refresh token in DB).

📖 API Documentation

Swagger docs available at:

http://localhost:5000/docs

🚀 Getting Started
1️⃣ Clone repo
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend

2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables

Create a .env file in root:

PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
REDIS_HOST=localhost
REDIS_PORT=6379
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
SENDGRID_API_KEY=your_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret

4️⃣ Run server
npm run dev

🧪 Testing

You can test APIs using:

Postman (collection included in /docs).

Swagger UI (/docs).

📌 Future Improvements

Multi-device refresh token support (session tracking).

Background jobs with Bull + Redis for email sending.

Webhooks for Razorpay payment verification.

Unit/integration testing with Jest + Supertest.

Role-based Access Control (RBAC).

👨‍💻 Author

Ruman Khan
Backend Developer | Node.js | MongoDB | Express | Redis | Cloud-native APIs
