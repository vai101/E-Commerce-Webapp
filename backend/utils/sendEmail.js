// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const sendVerificationEmail = async (user) => {
    // 1. Generate a temporary, short-lived token for verification
    const verificationToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET, // Uses your custom JWT secret
        { expiresIn: '1h' } // Link expires in 1 hour
    );

    // 2. Construct the verification URL
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // 3. Configure the Email Transporter using generic SMTP (Brevo)
    // IMPORTANT: It uses EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS from .env
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // e.g., smtp-relay.brevo.com
        port: process.env.EMAIL_PORT, // e.g., 587
        secure: false, // Use 'false' for port 587 (TLS), 'true' for port 465 (SSL)
        auth: {
            user: process.env.EMAIL_USER, // Brevo SMTP Login
            pass: process.env.EMAIL_PASS, // Brevo SMTP Key
        }
    });

    // 4. Define the Email Content
    const mailOptions = {
        from: process.env.SENDER_EMAIL, // Must be the verified 'From' address
        to: user.email,
        subject: 'E-commerce Store: Verify Your Email Address',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0056b3;">Welcome to the E-commerce Store!</h2>
                <p>Thanks for registering. Please click the button below to verify your email address and activate your account:</p>
                <div style="margin: 20px 0;">
                    <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-weight: bold;">
                        Verify Email
                    </a>
                </div>
                <p style="font-size: 12px; color: #777;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; font-size: 12px;">${verificationUrl}</p>
                <p style="font-size: 14px; margin-top: 30px;">This link expires in 1 hour.</p>
            </div>
        `,
    };

    // 5. Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
