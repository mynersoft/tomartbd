"use client";


import Link from 'next/link'
import { 
  FaHome, 
  FaArrowLeft, 
  FaSearch, 
  FaEnvelope,
  FaRocket,
  FaSatelliteDish 
} from 'react-icons/fa'
import { GiSpaceship } from 'react-icons/gi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-4xl">
        
        {/* Space-themed 404 */}
        <div className="relative mb-12">
          <div className="absolute -top-10 -left-10 text-blue-400 opacity-20">
            <GiSpaceship size={80} className="animate-pulse" />
          </div>
          <div className="absolute -bottom-10 -right-10 text-purple-400 opacity-20">
            <FaSatelliteDish size={60} className="animate-spin-slow" />
          </div>
          
          <div className="relative">
            <div className="text-[180px] md:text-[240px] font-black text-gray-700 opacity-30">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-[180px] md:text-[240px] font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tighter">
                404
              </h1>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Lost in the Digital Cosmos?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The gravitational pull of this page seems to have malfunctioned. 
            It appears you've ventured into uncharted territory.
          </p>
          
          {/* Interactive Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-400 transition-all hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-lg mb-4">
                <FaHome className="text-blue-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Return Home</h3>
              <p className="text-gray-400 text-sm mb-4">
                Navigate back to familiar space
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
                Launch Home <FaRocket className="animate-bounce" />
              </Link>
            </div>
            
            <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-purple-400 transition-all hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4">
                <FaSearch className="text-purple-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Search Galaxy</h3>
              <p className="text-gray-400 text-sm mb-4">
                Find what you're looking for
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search our universe..."
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500"
                />
                <button className="absolute right-2 top-2 text-purple-400">
                  <FaSearch />
                </button>
              </div>
            </div>
            
            <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-pink-400 transition-all hover:scale-105">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-500/20 rounded-lg mb-4">
                <FaEnvelope className="text-pink-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Contact Mission Control</h3>
              <p className="text-gray-400 text-sm mb-4">
                Need assistance? We're here to help
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300"
              >
                Send Signal <FaSatelliteDish className="animate-pulse" />
              </Link>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span>Navigate Back</span>
            </button>
            
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
            >
              <FaHome />
              <span>Return to Homebase</span>
              <FaRocket className="group-hover:translate-x-1 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
          
          {/* Star Background Effect */}
          <div className="mt-16 opacity-50">
            <div className="flex justify-center gap-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="text-yellow-300 animate-pulse">
                  <span className="text-2xl">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}