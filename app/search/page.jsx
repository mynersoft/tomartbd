import { Suspense } from 'react';
import SearchClient from './SearchClient';

export const dynamic = 'force-dynamic'; // optional, still recommended

export default function SearchPage() {
  return (
    <Suspense fallback={<p className="p-6 text-center">Loading search...</p>}>
      <SearchClient />
    </Suspense>
  );
}