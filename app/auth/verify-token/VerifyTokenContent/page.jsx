// app/auth/verify-token/VerifyTokenContent.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyTokenContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setVerificationStatus('error');
      setMessage('No verification token provided.');
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (verificationStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      router.push('/login');
    }
  }, [verificationStatus, countdown, router]);

  const verifyToken = async (verificationToken) => {
    try {
      setIsLoading(true);
      setVerificationStatus('verifying');
      setMessage('Verifying your token...');

      const response = await fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage(data.message || 'Your account has been successfully verified!');
      } else {
        setVerificationStatus('error');
        setMessage(data.error || 'Invalid or expired verification token.');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('An error occurred during verification. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setMessage('Email address is required to resend verification.');
      return;
    }

    try {
      setMessage('Sending new verification email...');
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'New verification email sent!');
      } else {
        setMessage(data.error || 'Failed to resend verification email.');
      }
    } catch (error) {
      setMessage('Failed to resend verification email.');
      console.error('Resend error:', error);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        );
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'verifying':
        return 'Verifying Your Token';
      case 'success':
        return 'Verification Successful!';
      case 'error':
        return 'Verification Failed';
      default:
        return 'Verification Status';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verifying':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading && verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="text-3xl font-bold text-blue-600">YourLogo</div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Account Verification
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-4 shadow-xl rounded-lg sm:px-10 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <h3 className="mt-6 text-lg font-medium text-blue-600">Verifying Your Token</h3>
            <p className="mt-2 text-gray-600">Please wait while we verify your token...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {/* Your Logo Here */}
          <div className="text-3xl font-bold text-blue-600">YourLogo</div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Account Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {email && `Verifying account for: ${email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="text-center">
            {getStatusIcon()}
            
            <div className="mt-6">
              <h3 className={`text-lg font-medium ${getStatusColor()}`}>
                {getStatusTitle()}
              </h3>
              
              <p className="mt-2 text-gray-600">
                {message}
              </p>

              {verificationStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-50 rounded-md">
                  <p className="text-green-800 text-sm">
                    Redirecting to login in {countdown} seconds...
                  </p>
                </div>
              )}

              {verificationStatus === 'error' && email && (
                <button
                  onClick={resendVerification}
                  className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Resend Verification Email
                </button>
              )}

              <div className="mt-6 space-y-3">
                {verificationStatus === 'success' && (
                  <Link
                    href="/login"
                    className="inline-block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Go to Login
                  </Link>
                )}

                {verificationStatus === 'error' && (
                  <Link
                    href="/register"
                    className="inline-block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Back to Registration
                  </Link>
                )}

                <Link
                  href="/"
                  className="inline-block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Having trouble? <Link href="/contact" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}