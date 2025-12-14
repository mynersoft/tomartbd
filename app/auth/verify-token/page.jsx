// app/auth/verify-token/page.jsx

'use client';

import { Suspense } from 'react';
import VerifyTokenContent from './VerifyTokenContent';

export default function VerifyTokenPage() {
  return (
    <Suspense fallback={
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
            <h3 className="mt-6 text-lg font-medium text-blue-600">Loading...</h3>
            <p className="mt-2 text-gray-600">Please wait while we load the verification page</p>
          </div>
        </div>
      </div>
    }>
      <VerifyTokenContent />
    </Suspense>
  );
}