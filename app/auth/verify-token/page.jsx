// app/auth/verify-token/page.jsx

'use client';

import { Suspense } from 'react';
import VerifyTokenContent from './VerifyTokenContent';

export default function VerifyTokenPage() {
  return (
    <Suspense>
      <VerifyTokenContent />
    </Suspense>
  );
}