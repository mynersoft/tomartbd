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
  LogIn,
  Star,
  Award,
  Truck,
  CreditCard
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-accent-50/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Side - Brand & Features */}
        <div className="lg:w-1/2">
          <div className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 rounded-3xl shadow-2xl p-6 lg:p-8 xl:p-10 h-full relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(${window.innerWidth < 768 ? 'circle at 30% 20%' : 'circle at 20% 30%'}, #fff 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />
            </div>

            {/* Brand Logo */}
            <div className="mb-8 lg:mb-10 relative z-10">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6 text-primary-700" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-accent-500 rounded-full border-2 border-primary-800 shadow" />
                </div>
                <div>
                  <span className="text-2xl lg:text-3xl font-bold text-white">Tomart</span>
                  <span className="text-2xl lg:text-3xl font-bold text-accent-300">BD</span>
                  <p className="text-primary-200 text-xs lg:text-sm mt-1">Premium E-commerce</p>
                </div>
              </Link>
            </div>

            {/* Welcome Text */}
            <div className="mb-10 lg:mb-12 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
                <Star className="h-4 w-4 text-accent-300" />
                <span className="text-accent-300 text-sm font-medium">Welcome Back!</span>
              </div>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                Your Shopping Experience <span className="text-accent-300">Awaits</span>
              </h1>
              <p className="text-primary-200 text-base lg:text-lg leading-relaxed">
                Access personalized recommendations, exclusive deals, and seamless shopping.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-10 lg:mb-12 relative z-10">
              {[
                { 
                  icon: <Award className="h-5 w-5" />, 
                  title: "Exclusive Deals", 
                  desc: "Member-only discounts up to 50%",
                  bg: "bg-accent-500/10"
                },
                { 
                  icon: <Truck className="h-5 w-5" />, 
                  title: "Free Shipping", 
                  desc: "On orders over ৳2000",
                  bg: "bg-white/10"
                },
                { 
                  icon: <Shield className="h-5 w-5" />, 
                  title: "Secure Payment", 
                  desc: "100% safe transactions",
                  bg: "bg-white/10"
                },
                { 
                  icon: <Sparkles className="h-5 w-5" />, 
                  title: "Premium Support", 
                  desc: "24/7 customer service",
                  bg: "bg-accent-500/10"
                },
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`${feature.bg} backdrop-blur-sm rounded-xl p-4 lg:p-5 border border-white/10 hover:border-accent-500/30 transition-colors`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <div className="text-accent-300">{feature.icon}</div>
                    </div>
                    <h3 className="font-bold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-primary-200 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="relative z-10">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">50K+</div>
                  <div className="text-primary-200 text-xs lg:text-sm">Customers</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">4.8</div>
                  <div className="text-primary-200 text-xs lg:text-sm">Rating</div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">98%</div>
                  <div className="text-primary-200 text-xs lg:text-sm">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 flex items-center">
          <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 xl:p-10 w-full">
            {/* Form Header */}
            <div className="text-center mb-8 lg:mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-primary-50 rounded-2xl mb-4 shadow-inner">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center shadow">
                  <LogIn className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Sign In to Continue
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Success Message */}
            {loginSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-pulse">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Login Successful!</p>
                  <p className="text-green-600 text-sm">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
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
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary-600" />
                    Email Address
                    <span className="text-red-500">*</span>
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
                    className={`w-full px-4 py-3.5 pl-12 border rounded-xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 ${
                      focusedField === 'email'
                        ? 'border-primary-500 ring-2 ring-primary-100 bg-white'
                        : 'border-gray-300 hover:border-primary-400 bg-gray-50/50'
                    } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                  <Mail className={`absolute left-4 top-3.5 h-5 w-5 transition-colors ${
                    focusedField === 'email' ? 'text-primary-600' : 'text-gray-500'
                  } ${isLoading ? 'text-gray-400' : ''}`} />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary-600" />
                      Password
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors hover:underline"
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
                    className={`w-full px-4 py-3.5 pl-12 pr-12 border rounded-xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 ${
                      focusedField === 'password'
                        ? 'border-primary-500 ring-2 ring-primary-100 bg-white'
                        : 'border-gray-300 hover:border-primary-400 bg-gray-50/50'
                    } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <Lock className={`absolute left-4 top-3.5 h-5 w-5 transition-colors ${
                    focusedField === 'password' ? 'text-primary-600' : 'text-gray-500'
                  } ${isLoading ? 'text-gray-400' : ''}`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-primary-600 transition-colors disabled:text-gray-400"
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

              {/* Remember Me & Terms */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${
                      rememberMe 
                        ? 'bg-primary-600 border-primary-600' 
                        : 'border-gray-400 group-hover:border-primary-500'
                    } ${isLoading ? 'border-gray-300' : ''}`}>
                      {rememberMe && (
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>
                  </div>
                  <span className={`text-sm transition-colors ${
                    isLoading ? 'text-gray-500' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    Remember me
                  </span>
                </label>
                
                <div className="text-sm text-gray-600">
                  By signing in, you agree to our{" "}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-800 font-medium hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-800 font-medium hover:underline">
                    Privacy
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Account</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-600 font-medium">Or continue with</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard/user" })}
                disabled={isLoading}
                className="p-3 border border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                </svg>
                <span className="font-medium text-gray-800 group-hover:text-primary-700">Google</span>
              </button>
              <button
                type="button"
                onClick={() => signIn("github", { callbackUrl: "/dashboard/user" })}
                disabled={isLoading}
                className="p-3 border border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-medium text-gray-800 group-hover:text-primary-700">GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-700 mb-2">
                New to TomartBD?
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-semibold group text-lg"
              >
                <span>Create your account</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Shield className="h-5 w-5 text-primary-700" />
                </div>
                <div>
                  <p className="font-semibold text-primary-900">Secure & Trusted</p>
                  <p className="text-sm text-primary-700">
                    All login data is encrypted with 256-bit SSL protection
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