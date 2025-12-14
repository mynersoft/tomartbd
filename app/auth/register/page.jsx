"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check, AlertCircle, User, Mail, Lock } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Password validation rules
  const passwordRules = [
    { label: "At least 8 characters", met: form.password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(form.password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(form.password) },
    { label: "Contains number", met: /\d/.test(form.password) },
    { label: "Contains special character", met: /[!@#$%^&*]/.test(form.password) },
  ];

  const passwordsMatch = form.password === form.confirmPassword;
  const allRulesMet = passwordRules.every(rule => rule.met);
  const isFormValid = form.name && form.email && form.password && passwordsMatch && allRulesMet;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (!passwordsMatch) {
      toast.error("Passwords do not match!", {
        icon: "❌",
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5',
        },
      });
      setIsLoading(false);
      return;
    }

    if (!allRulesMet) {
      toast.error("Please meet all password requirements!", {
        icon: "⚠️",
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #FCD34D',
        },
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully! Redirecting to login...", {
          icon: "🎉",
          duration: 3000,
          style: {
            background: '#D1FAE5',
            color: '#065F46',
            border: '1px solid #34D399',
          },
        });
        
        // Show loading toast before redirect
        setTimeout(() => {
          toast.loading("Redirecting to login page...", {
            duration: 1000,
          });
        }, 2000);
        
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        toast.error(data.message || "Registration failed. Please try again.", {
          icon: "❌",
          duration: 4000,
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5',
          },
        });
      }
    } catch (err) {
      toast.error("Network error. Please check your connection.", {
        icon: "🔌",
        duration: 4000,
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5',
        },
      });
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            duration: 3000,
          },
          error: {
            duration: 4000,
          },
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
          {/* Left Side - Information */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join Our Community
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Create your account and unlock exclusive features. Start your journey with us today.
              </p>

              {/* Features List */}
              <div className="space-y-4">
                {[
                  { icon: "✨", title: "Personalized Experience", desc: "Custom dashboard tailored to your needs" },
                  { icon: "🔒", title: "Secure & Private", desc: "End-to-end encryption for your data" },
                  { icon: "⚡", title: "Lightning Fast", desc: "Optimized performance across all devices" },
                  { icon: "🎯", title: "Advanced Features", desc: "Access premium tools and insights" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600">
                  Fill in your details to get started
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none"
                      placeholder="John Doe"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none"
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                      disabled={isLoading}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none"
                      placeholder="Create a strong password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Rules */}
                  <div className="mt-3 space-y-2">
                    {passwordRules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {rule.met ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border border-gray-300" />
                        )}
                        <span className={`text-xs ${rule.met ? "text-emerald-600" : "text-gray-500"}`}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    {form.confirmPassword && (
                      <span className={`text-sm font-medium ${passwordsMatch ? "text-emerald-600" : "text-red-600"}`}>
                        {passwordsMatch ? "Passwords match" : "Passwords don't match"}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-200 outline-none ${
                        form.confirmPassword
                          ? passwordsMatch
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm your password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 mt-1"
                    disabled={isLoading}
                    required
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <button 
                      type="button" 
                      className="text-emerald-600 hover:text-emerald-800 font-medium"
                      onClick={() => toast("Terms of Service page would open here", {
                        icon: "📄",
                        position: "bottom-center",
                      })}
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button 
                      type="button" 
                      className="text-emerald-600 hover:text-emerald-800 font-medium"
                      onClick={() => toast("Privacy Policy page would open here", {
                        icon: "🔒",
                        position: "bottom-center",
                      })}
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">Already have an account?</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Login Link */}
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                disabled={isLoading}
                className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-medium py-3 px-4 rounded-xl transition-all duration-200"
              >
                Sign In Instead
              </button>

              {/* Footer */}
              <p className="text-center text-gray-500 text-xs mt-8">
                By creating an account, you agree to our terms and acknowledge our privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}