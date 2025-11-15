🛒 Urban Cart — Full Stack E-Commerce Application
🌍 Live Website

🔗 https://e-commerce-application-hazel.vercel.app

<p align="center"> <img src="https://img.shields.io/badge/Type-Full%20Stack-blueviolet?style=for-the-badge"/> <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white"/> <img src="https://img.shields.io/badge/Backend-Node%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white"/> <img src="https://img.shields.io/badge/Database-MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"/> <img src="https://img.shields.io/badge/Cache-Redis-D92C20?style=for-the-badge&logo=redis&logoColor=white"/> </p>

A production-ready E-Commerce platform with authentication, product catalog, cart, checkout, online payments, order management, admin dashboard, reviews, and more.

✨ Features
🔐 Authentication & Security

JWT Access + Refresh Tokens (rotation + DB replacement)

Google OAuth 2.0 Login

Forgot / Reset Password via email

Secure HttpOnly cookies

Rate Limiting (Redis)

Role-based Authorization (Admin/User)

👤 Users

Register / Login / Google Login

Update profile

View order history

📦 Product Features

Admin: Add / Edit / Delete products

Cloudinary image uploads

Pagination, filtering, category search

MongoDB Atlas full-text search

Redis caching (Single + List)

🛒 Cart

Add / update / remove items

Auto-create cart on first product addition

Persistent per user

📑 Orders & Payments

Checkout with COD & Razorpay Online

Auto stock deduction

Email confirmations

⭐ Reviews

Only verified purchasers can review

Auto-updates rating & count

📧 Emails via SendGrid

Password reset

Order confirmation

🖥️ Frontend Tech Stack
Category	Tech
Framework	React + Vite
Styling	Tailwind CSS
State Management	Redux Toolkit
Server State	React Query
Forms	RHF + Zod Validation
Routing	React Router v6
Animations	Framer Motion
Notifications	React Toastify
Deploy	Vercel
📌 Frontend Pages
Page	Description
/	Home: Banners, categories, featured products
/products	Listing with filters & search
/product/:id	Product detail, reviews, add to cart
/cart	Update/Remove items + checkout
/checkout	COD/Online payment
/orders	User orders list
/login /register	Auth + Google OAuth
/admin/*	Product & order management
🛠 Backend Tech Stack
Feature	Tech
Framework	Express.js
Database	MongoDB Atlas (Mongoose)
Cache/Rate Limit	Redis
Auth	JWT + Google OAuth
File Storage	Cloudinary (Multer)
Emails	SendGrid
Payments	Razorpay
Docs	Swagger / OpenAPI
📖 API Docs

Swagger URL (local):

http://localhost:3000/docs

🚀 Future Improvements

Wishlist + Address Book

Bull + Redis Background Jobs

Razorpay Webhooks

Multi-Device Session Tracking

Admin Dashboard with analytics

Jest + Supertest full test coverage

👨‍💻 Author

Ruman Khan
Full-Stack Web Developer
Node.js | React | MongoDB | Redis | Cloud Native APIs

<p align="left"> <a href="https://github.com/Ruman-30"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"/></a> <a href="https://www.linkedin.com/in/ruman-khan-152190271"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"/></a> </p>
