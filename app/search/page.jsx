'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);

  // Fetch search results when query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    // Replace this with your actual API endpoint
    fetch(`/api/products?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error(err));
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Search</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="border px-3 py-2 w-full rounded"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
      </form>

      {query && (
        <div>
          <h2 className="text-xl font-medium mb-2">Results for “{query}”:</h2>
          {results.length > 0 ? (
            <ul className="list-disc pl-5">
              {results.map((item, idx) => (
                <li key={idx}>{item.name}</li> // adjust according to your API
              ))}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}