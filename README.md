# ⚡ MERN E-commerce Platform | Full-Stack E-Store with Razorpay

## Overview

This project is a high-performance, full-stack e-commerce web application built using the MERN (MongoDB, Express, React, Node.js) stack. It demonstrates modern development practices, secure authentication flows, complex payment integration, and a dedicated administrator role.

The application is architected for scalability and is optimized for free deployment on Vercel (Frontend) and Render (Backend).

## 🌟 Key Features & Technical Highlights

### Authentication & Security
- **Secure Access**: JWT Access and Refresh tokens for session management
  - User sessions are secured using HTTP-only cookies for the refresh token, mitigating XSS attacks
- **Email Verification**: Ensures real users are signing up
  - Email verification implemented via Brevo SMTP and Nodemailer

### Payment & Business Logic
- **Razorpay Integration**: Complete, functional payment gateway
  - Implemented secure checkout using Razorpay SDK with server-side signature verification
  - Ensures payment legitimacy before order creation
- **Inventory Control**: Prevents overselling
  - Atomic logic to deduct product stock and clear the user's cart only upon confirmed payment success

### Architecture & User Experience
- **Role-Based Access Control (RBAC)**: Separates management from commerce
  - Dedicated Admin Dashboard for order fulfillment and product CRUD operations
- **Modern Frontend**: Fast, responsive design
  - Built with React (Vite) and styled using Tailwind CSS for a clean, professional user interface
- **Product Catalog**: Full product lifecycle management (CRUD) backed by MongoDB

## 🚀 Getting Started (Local Development)

Follow these steps to set up and run the application on your local machine.

### Prerequisites

- Node.js (v20+)
- MongoDB Atlas account (M0 Free Cluster)
- Razorpay merchant account (for API Test Keys)
- Brevo (or other SMTP service) for email verification

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vai101/E-Commerce-Webapp.git
   cd E-Commerce-Webapp
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root of the `/backend` directory and populate it with your keys (see Environment Variables section below).

3. **Install Dependencies:**
   ```bash
   # Install Backend dependencies
   cd backend
   npm install

   # Install Frontend dependencies
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend API** (Runs on port 5000):
   ```bash
   cd backend
   npm run server
   ```

2. **Start the Frontend Client** (Runs on port 5173):
   ```bash
   cd ../frontend
   npm run dev
   ```

The application will be accessible at `http://localhost:5173`.

## 🔒 Environment Variables Configuration

### Backend Environment Variables (`backend/.env`)

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `MONGO_URI` | Connection string for your MongoDB Atlas cluster | `mongodb+srv://user:pass@cluster0.gzpw41a.mongodb.net/` |
| `JWT_SECRET` | **CRITICAL**: Private secret key for signing tokens | Use a random 64-character hex string |
| `RAZORPAY_KEY_ID` | Your public test key for Razorpay integration | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Your private secret key for Razorpay | `your_razorpay_secret` |
| `EMAIL_HOST` | SMTP server address (e.g., smtp-relay.brevo.com) | `smtp-relay.brevo.com` |
| `EMAIL_PORT` | SMTP server port | `587` |
| `EMAIL_USER` | SMTP username/email | `your-smtp-username` |
| `EMAIL_PASS` | SMTP password | `your-smtp-password` |
| `SENDER_EMAIL` | The verified email address visible to customers | `noreply@ecomstore.com` |
| `FRONTEND_URL` | For local: `http://localhost:5173`. For production: Your Vercel domain | `http://localhost:5173` |

### Frontend Environment Variables (`frontend/.env`)

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `VITE_API_URL` | API base URL. For local: `http://localhost:5000/api` | `http://localhost:5000/api` |
| `VITE_RAZORPAY_KEY_ID` | Your public Razorpay key for frontend integration | `rzp_test_...` |

## 📁 Project Structure

```
E-Commerce-Webapp/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Razorpay** - Payment gateway integration
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library with Vite build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Context** - State management

## 🚢 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Configure environment variables in Render dashboard
3. Set build command: `npm install`
4. Set start command: `npm start`

## 🔐 Security Features

- **JWT Authentication** with access and refresh tokens
- **HTTP-only cookies** for secure token storage
- **Password hashing** using bcryptjs
- **Email verification** before account activation
- **Payment signature verification** for Razorpay transactions
- **Environment variable protection** for sensitive data

## 📧 Email Configuration

The application uses SMTP for sending verification emails. Configure your preferred email service:

### Using Brevo (Recommended for free tier)
1. Sign up at [Brevo](https://www.brevo.com/)
2. Get your SMTP credentials
3. Add to your backend `.env` file

### Alternative Email Services
- Gmail SMTP
- SendGrid
- Mailgun
- Amazon SES

## 💳 Payment Gateway Setup

### Razorpay Configuration
1. Create account at [Razorpay](https://razorpay.com/)
2. Get Test API keys from dashboard
3. Add keys to environment variables
4. For production: Switch to Live API keys

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Verify MongoDB URI format
- Check network access in MongoDB Atlas
- Ensure IP whitelist includes your deployment platform

**Payment Integration Issues**
- Verify Razorpay API keys
- Check webhook configuration
- Ensure proper signature verification

**Email Verification Not Working**
- Verify SMTP credentials
- Check email service provider settings
- Ensure sender email is verified

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Open an issue on GitHub
3. Review the documentation for each integrated service

## 🔗 Useful Links

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Razorpay API Documentation](https://razorpay.com/docs/)
- [Brevo SMTP Documentation](https://developers.brevo.com/)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Render Deployment Guide](https://render.com/docs)

---

**Built with ❤️ using the MERN Stack**