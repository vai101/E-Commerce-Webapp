// frontend/src/components/Auth/VerifyEmailScreen.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/api';

const VerifyEmailScreen = () => {
    const { token } = useParams();
    const [verificationStatus, setVerificationStatus] = useState('Verifying...');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setVerificationStatus('Error: No verification token found.');
                return;
            }
            try {
                // Submit the token to the backend API endpoint
                const { data } = await apiClient.get(`/users/verify-email/${token}`);
                
                setVerificationStatus(data.message || 'Email successfully verified!');
                setIsSuccess(true);
            } catch (error) {
                const message = error.response?.data?.message || 'Verification link is invalid or expired.';
                setVerificationStatus(message);
                setIsSuccess(false);
            }
        };

        verifyToken();
    }, [token]);

     return (
        <div className="flex justify-center items-center py-20 bg-gray-800">
            <div className="w-full max-w-md p-8 text-center space-y-4 bg-gray-900 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-white">Email Verification</h2>
                <p className={`text-lg ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                    {verificationStatus}
                </p>
                {isSuccess && (
                    <Link to="/login" className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        Go to Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailScreen;