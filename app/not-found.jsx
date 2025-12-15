import Link from 'next/link'
import { useRouter } from 'next/router'
import Navigation from '@/components/Navigation'

export default function NotFound() {
  const router = useRouter()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            404 error
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Page not found.
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
          
          <div className="mt-12">
            <div className="grid gap-4 max-w-sm mx-auto">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Go back
              </button>
              
              <Link
                href="/"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to home
              </Link>
              
              <Link
                href="/support"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}