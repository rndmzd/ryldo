import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail, resendVerificationEmail } from '../../services/api';

const EmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await verifyEmail(token);
                setStatus({ type: 'success', message: 'Email verified successfully!' });
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus({ type: 'error', message: error.response?.data?.message || 'Verification failed' });
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token, navigate]);

    const handleResendVerification = async () => {
        setIsResending(true);
        try {
            await resendVerificationEmail();
            setStatus({ type: 'success', message: 'Verification email resent successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to resend verification email' });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Email Verification
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {status.message && (
                        <div className={`mb-4 rounded-md p-4 ${status.type === 'success' ? 'bg-green-50' : 'bg-red-50'
                            }`}>
                            <p className={`text-sm ${status.type === 'success' ? 'text-green-800' : 'text-red-800'
                                }`}>
                                {status.message}
                            </p>
                        </div>
                    )}

                    {status.type === 'error' && (
                        <div className="mt-6">
                            <button
                                onClick={handleResendVerification}
                                disabled={isResending}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isResending ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isResending ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                        </div>
                    )}

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    or
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Return to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification; 