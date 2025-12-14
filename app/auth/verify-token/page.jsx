// app/auth/verify-token/page.jsx

'use client';

import { Suspense } from 'react';
import VerifyTokenContent from './VerifyTokenContent';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function VerifyTokenPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyTokenContent />
    </Suspense>
  );
}