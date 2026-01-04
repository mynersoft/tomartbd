'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
  User,
  Mail,
  Lock,
  Shield,
  Sparkles,
  Award,
  Gift,
  ArrowRight,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  // Password validation rules
  const passwordRules = [
    { label: 'At least 8 characters', met: form.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(form.password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(form.password) },
    { label: 'Contains number', met: /\d/.test(form.password) },
    {
      label: 'Contains special character',
      met: /[!@#$%^&*]/.test(form.password),
    },
  ];

  const passwordsMatch = form.password === form.confirmPassword;
  const allRulesMet = passwordRules.every((rule) => rule.met);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (!allRulesMet) {
      newErrors.password = 'Please meet all password requirements';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!passwordsMatch) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = () => {
    setAgreeToTerms(!agreeToTerms);
    if (errors.terms) {
      setErrors((prev) => ({ ...prev, terms: '' }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form', {
        icon: '⚠️',
        style: {
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #FCD34D',
        },
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account created successfully! Redirecting to login...', {
          icon: '🎉',
          duration: 3000,
          style: {
            background: '#D1FAE5',
            color: '#065F46',
            border: '1px solid #34D399',
          },
        });

        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        toast.error(data.error || 'Registration failed. Please try again.', {
          icon: '❌',
          duration: 4000,
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5',
          },
        });
      }
    } catch (err) {
      console.log(err);
      
      toast.error('Network error. Please check your connection.', {
        icon: '🔌',
        duration: 4000,
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5',
        },
      });
      console.error('Registration error:', err);
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

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/20 flex items-center justify-center p-4">
        {/* Registration Form Container */}
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 w-full">
            {/* Form Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4 shadow-inner">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center shadow">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary-600" />
                    Full Name
                    <span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3.5 pl-12 border rounded-xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 ${
                      focusedField === 'name'
                        ? 'border-primary-500 ring-2 ring-primary-100 bg-white'
                        : errors.name
                          ? 'border-red-500 ring-2 ring-red-100 bg-white'
                          : 'border-gray-300 hover:border-primary-400 bg-gray-50/50'
                    } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  <User
                    className={`absolute left-4 top-3.5 h-5 w-5 transition-colors ${
                      focusedField === 'name' || errors.name
                        ? errors.name
                          ? 'text-red-500'
                          : 'text-primary-600'
                        : 'text-gray-500'
                    } ${isLoading ? 'text-gray-400' : ''}`}
                  />
                </div>
                {errors.name && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>

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
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3.5 pl-12 border rounded-xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 ${
                      focusedField === 'email'
                        ? 'border-primary-500 ring-2 ring-primary-100 bg-white'
                        : errors.email
                          ? 'border-red-500 ring-2 ring-red-100 bg-white'
                          : 'border-gray-300 hover:border-primary-400 bg-gray-50/50'
                    } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                  <Mail
                    className={`absolute left-4 top-3.5 h-5 w-5 transition-colors ${
                      focusedField === 'email' || errors.email
                        ? errors.email
                          ? 'text-red-500'
                          : 'text-primary-600'
                        : 'text-gray-500'
                    } ${isLoading ? 'text-gray-400' : ''}`}
                  />
                </div>
                {errors.email && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3.5 pl-12 pr-12 border rounded-xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 ${
                      focusedField === 'password'
                        ? 'border-primary-500 ring-2 ring-primary-100 bg-white'
                        : errors.password
                          ? 'border-red-500 ring-2 ring-red-100 bg-white'
                          : 'border-gray-300 hover:border-primary-400 bg-gray-50/50'
                    } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Create a strong password"
                    disabled={isLoading}
                  />
                  <Lock
                    className={`absolute left-4 top-3.5 h-5 w-5 transition-colors ${
                      focusedField === 'password' || errors.password
                        ? errors.password
                          ? 'text-red-500'
                          : 'text-primary-600'
                        : 'text-gray-500'
                    } ${isLoading ? 'text-gray-400' : ''}`}
                  />
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
                {errors.password && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}

                {/* Password Rules */}
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-800 mb-3">
                    Password Requirements:
                  </p>
                  <div className="space-y-2">
                    {passwordRules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            rule.met
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {rule.met ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${rule.met ? 'text-green-700 font-medium' : 'text-gray-600'}`}
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary-600" />
                      Confirm Password
                      <span className="text-red-500">*</span>
                    </div>
                  </label>
                  {form.confirmPassword && !errors.confirmPassword && (
                    <span
                      className={`text-sm font-medium ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {passwordsMatch
                        ? '✓ Passwords match'
                        : "✗ Passwords don't match"}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) =>
                      handleChange('confirmPassword', e.target.value)
                    }
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-4 py-3.5 pl-12 pr-12 border rounded-xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 ${
                      focusedField === 'confirmPassword'
                        ? 'border-primary-500 ring-2 ring-primary-100 bg-white'
                        : errors.confirmPassword
                          ? 'border-red-500 ring-2 ring-red-100 bg-white'
                          : form.confirmPassword
                            ? passwordsMatch
                              ? 'border-green-500 bg-green-50/50'
                              : 'border-red-500 bg-red-50/50'
                            : 'border-gray-300 hover:border-primary-400 bg-gray-50/50'
                    } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    placeholder="Re-enter your password"
                    disabled={isLoading}
                  />
                  <Lock
                    className={`absolute left-4 top-3.5 h-5 w-5 transition-colors ${
                      focusedField === 'confirmPassword' ||
                      errors.confirmPassword
                        ? errors.confirmPassword
                          ? 'text-red-500'
                          : 'text-primary-600'
                        : 'text-gray-500'
                    } ${isLoading ? 'text-gray-400' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-primary-600 transition-colors disabled:text-gray-400"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions - Fixed Checkbox */}
              <div
                className={`p-4 rounded-xl transition-all duration-200 ${
                  errors.terms
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                      disabled={isLoading}
                    />
                    <div
                      className={`w-6 h-6 border-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
                        agreeToTerms
                          ? 'bg-primary-500 border-primary-500'
                          : errors.terms
                            ? 'border-red-500'
                            : 'border-gray-400 group-hover:border-primary-500'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {agreeToTerms && <Check className="h-4 w-4 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-sm transition-colors ${
                        isLoading ? 'text-gray-500' : 'text-gray-800'
                      }`}
                    >
                      I agree to the{' '}
                      <Link
                        href="/terms"
                        className="text-primary-600 hover:text-primary-800 font-medium hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/privacy"
                        className="text-primary-600 hover:text-primary-800 font-medium hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </Link>
                    </span>
                    {errors.terms && (
                      <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.terms}</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 disabled:bg-gray-100 text-primary-600 hover:text-primary-700 disabled:text-gray-400 font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow hover:shadow-md disabled:shadow-none disabled:cursor-not-allowed group border border-primary-200 hover:border-primary-300 disabled:border-gray-300"
              >
                {isLoading ? (
                  <span>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating Account...
                
                    </span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-600 font-medium">
                Already have an account?
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Login Link */}
            <Link
              href="/auth/login"
              className={`w-full border-2 text-primary-600 font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group ${
                isLoading
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-primary-600 hover:bg-primary-50 hover:border-primary-700'
              }`}
              onClick={(e) => isLoading && e.preventDefault()}
            >
              <span>Sign In Instead</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Security Badge */}
            <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Shield className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-primary-900">
                    Secure Registration
                  </p>
                  <p className="text-sm text-primary-700">
                    Your information is protected with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-500 text-xs mt-6">
              By creating an account, you agree to our terms and acknowledge our
              privacy policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
