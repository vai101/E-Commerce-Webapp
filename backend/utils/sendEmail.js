const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const sendVerificationEmail = async (user) => {
   
    const verificationToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
    );

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, 
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        }
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL, 
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

    await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;
