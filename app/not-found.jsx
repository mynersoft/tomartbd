import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Animated 404 */}
        <div className="relative">
          <div className="text-9xl font-black text-gray-800 opacity-10">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-9xl font-bold text-gray-800 tracking-tighter">
              404
            </h1>
          </div>
        </div>
        
        {/* Content */}
        <h2 className="text-4xl font-bold text-gray-900 mt-8">
          Oops! Lost in Space?
        </h2>
        
        <p className="text-lg text-gray-600 mt-4 max-w-md mx-auto">
          The page you're looking for seems to have drifted off into the digital cosmos. 
          Don't worry, we can help you find your way back home.
        </p>
        
        {/* Error Message (Optional) */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
          <p className="text-yellow-800 text-sm">
            <span className="font-semibold">Possible reasons:</span> The page might have been moved, deleted, or you might have typed the wrong URL.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            <HomeIcon className="w-5 h-5" />
            Back to Homepage
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Go Back
          </button>
        </div>
        
        {/* Search Suggestion */}
        <div className="mt-12">
          <p className="text-gray-500 text-sm">
            Can't find what you're looking for?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}