E-Commerce Webapp
A full-featured MERN stack e-commerce platform supporting user authentication, product catalog, payment via Razorpay, cart, admin product management, and secure email verification.

Features
User Registration & Login (JWT-based authentication)

Email Verification (via Nodemailer and SMTP)

Admin Dashboard (product creation, updates, role-based access)

Product Listings (MongoDB-based with full CRUD)

Cart & Checkout (persistent cart, address form)

Payment Integration (Razorpay gateway, secure signature verification)

Order Management (admin-only order summary and status updates)

Responsive UI (React + Tailwind CSS)

Environment-Sensitive Config (with .env variables for sensitive keys)

Security Best Practices (helmet, CORS, error handling)

Getting Started
Prerequisites
Node.js v20+

MongoDB Atlas account or local instance

Razorpay merchant account (for development keys)

SMTP credentials (Brevo recommended)

Vercel or Render.com for deployment

Installation
Clone the repo

text
git clone https://github.com/vai101/E-Commerce-Webapp.git
cd E-Commerce-Webapp
Configure Environment Variables

Copy and customize .env files for both /backend and /frontend

See backend/.env and frontend/.env.example

Install dependencies

text
# Backend
cd backend
npm install
# Frontend
cd ../frontend
npm install
Start development servers

text
# Backend (+ auto-reload for development)
npm run server
# Frontend
npm run dev
Important .env Variables
Backend (example)
text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
EMAIL_HOST=smtp-provider.com
EMAIL_PORT=587
EMAIL_USER=your_smtp_username
EMAIL_PASS=your_smtp_password
SENDER_EMAIL=your_verified_sender@example.com
ADMIN_EMAIL=admin@example.com
PORT=5000
Frontend (example)
text
VITE_API_URL=http://localhost:5000/api