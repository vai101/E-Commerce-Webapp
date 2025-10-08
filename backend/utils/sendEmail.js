const SibApiV3Sdk = require('sib-api-v3-sdk');
const jwt = require('jsonwebtoken');

const sendVerificationEmail = async (user) => {
    // Generate verification token and URL
    const verificationToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    // Set up Brevo API configuration
    SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Define sender and receiver
    const sender = { email: process.env.SENDER_EMAIL, name: "E-commerce Store" };
    const receivers = [{ email: user.email }];

    // Compose HTML content
    const htmlContent = `
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
    `;

    // Construct email payload
    const email = {
        sender,
        to: receivers,
        subject: 'E-commerce Store: Verify Your Email Address',
        htmlContent
    };

    // Send email via Brevo API
    try {
        await apiInstance.sendTransacEmail(email);
    } catch (err) {
        throw new Error('Brevo email sending failed: ' + err.message);
    }
};

module.exports = sendVerificationEmail;
