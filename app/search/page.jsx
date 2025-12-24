'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Search Products</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, brand, category, or tags..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
      </form>

      {loading && <p>Loading results...</p>}

      {query && !loading && (
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Results for "{query}":
          </h2>

          {results.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((product) => (
                <li key={product._id} className="border p-4 rounded shadow">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand} - {product.category}</p>
                  {product.isOnSale ? (
                    <p className="text-red-600 font-semibold">
                      Sale Price: ${product.salePrice.toFixed(2)}
                    </p>
                  ) : (
                    <p className="text-gray-800">Price: ${product.price.toFixed(2)}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found for "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
}