"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  Lock, 
  Mail, 
  User, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  Smartphone,
  ShoppingBag,
  Sparkles,
  Key,
  LogIn
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { data: session, status } = useSession();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
      } else if (res?.ok) {
        setLoginSuccess(true);
        toast.success("Login successful! Redirecting...");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loginSuccess && session?.user) {
      const redirectTimer = setTimeout(() => {
        if (session.user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/user");
        }
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [loginSuccess, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50/30">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
        {/* Left Side - Brand & Features */}
        <div className="lg:w-1/2">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl shadow-2xl p-8 lg:p-12 h-full">
            {/* Brand Logo */}
            <div className="mb-12">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-500 rounded-full border-2 border-primary-800" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">Tomart</span>
                  <span className="text-2xl font-bold text-accent-400">BD</span>
                </div>
              </Link>
            </div>

            {/* Welcome Text */}
            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Welcome Back to <span className="text-accent-300">TomartBD</span>
              </h1>
              <p className="text-primary-200 text-lg">
                Sign in to access exclusive deals, track orders, and manage your wishlist.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6 mb-12">
              {[
                { icon: <Sparkles className="h-5 w-5" />, text: "Exclusive Member Discounts" },
                { icon: <Shield className="h-5 w-5" />, text: "Secure & Encrypted Login" },
                { icon: <ShoppingBag className="h-5 w-5" />, text: "Fast Checkout Experience" },
                { icon: <Smartphone className="h-5 w-5" />, text: "Mobile App Coming Soon" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <div className="text-accent-300">{feature.icon}</div>
                  </div>
                  <span className="text-white font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-primary-200 text-sm">Happy Customers</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-primary-200 text-sm">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 flex items-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 w-full">
            {/* Form Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                  <LogIn className="h-5 w-5 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign In to Your Account
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {/* Success Message */}
            {loginSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-pulse">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">Login Successful!</p>
                  <p className="text-green-600 text-sm">Redirecting to your dashboard...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Login Failed</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary-500" />
                    Email Address
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 pl-12 border rounded-xl transition-all duration-200 outline-none ${
                      focusedField === 'email'
                        ? 'border-primary-500 ring-2 ring-primary-100'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                    placeholder="you@example.com"
                    required
                    disabled={isLoading}
                  />
                  <Mail className={`absolute left-4 top-3.5 h-5 w-5 transition-colors ${
                    focusedField === 'email' ? 'text-primary-500' : 'text-gray-400'
                  }`} />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary-500" />
                      Password
                    </div>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3 pl-12 pr-12 border rounded-xl transition-all duration-200 outline-none ${
                      focusedField === 'password'
                        ? 'border-primary-500 ring-2 ring-primary-100'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <Lock className={`absolute left-4 top-3.5 h-5 w-5 transition-colors ${
                    focusedField === 'password' ? 'text-primary-500' : 'text-gray-400'
                  }`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-primary-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all ${
                      rememberMe 
                        ? 'bg-primary-500 border-primary-500' 
                        : 'border-gray-300 group-hover:border-primary-300'
                    }`}>
                      {rememberMe && (
                        <CheckCircle className="h-4 w-4 text-white absolute top-0.5 left-0.5" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    Remember me for 30 days
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-primary-400 disabled:to-primary-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 font-medium">Or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard/user" })}
                disabled={isLoading}
                className="p-3 border border-gray-300 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                </svg>
                <span className="font-medium group-hover:text-primary-700">Google</span>
              </button>
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/dashboard/user" })}
                disabled={isLoading}
                className="p-3 border border-gray-300 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-medium group-hover:text-primary-700">GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary-600 hover:text-primary-800 font-semibold inline-flex items-center gap-1 group"
                >
                  <span>Create account</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-primary-800">Secure Login</p>
                  <p className="text-xs text-primary-600">
                    Your credentials are protected with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}