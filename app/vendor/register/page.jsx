'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, AlertCircle, Store, User, Shield, Building, CreditCard, MapPin } from 'lucide-react';

export default function VendorRegistrationPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      role: 'seller',
    },
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const validatePhone = (value) => {
    const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
    return phoneRegex.test(value) || 'Please enter a valid Bangladeshi phone number';
  };

  const validatePassword = (value) => {
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
    if (!/(?=.*[@$!%*?&])/.test(value)) return 'Password must contain at least one special character';
    return true;
  };

  const nextStep = async () => {
    const fields = {
      1: ['name', 'email', 'phone', 'password', 'confirmPassword'],
      2: ['shopName', 'shopAddress'],
      3: ['address.area', 'address.thana', 'address.city'],
      4: ['bankAccount', 'bankName', 'bankBranch'],
    }[step];

    const isValid = await trigger(fields);
    if (isValid) {
      setStep(step + 1);
      setError('');
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const onSubmit = async (data) => {
    if (!agreedToTerms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...vendorData } = data;

      const response = await fetch('/api/auth/vendor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      setSuccess('Registration successful! Redirecting to verification...');
      
      // Store email for OTP verification
      localStorage.setItem('pendingVerificationEmail', data.email);
      
      // Redirect to OTP verification page
      setTimeout(() => {
        router.push('/vendor/verify-otp');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Account Details', icon: <User className="w-5 h-5" /> },
    { number: 2, title: 'Shop Info', icon: <Store className="w-5 h-5" /> },
    { number: 3, title: 'Location', icon: <MapPin className="w-5 h-5" /> },
    { number: 4, title: 'Bank Info', icon: <CreditCard className="w-5 h-5" /> },
    { number: 5, title: 'Review', icon: <Shield className="w-5 h-5" /> },
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Create Your Account</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register('name', { 
                    required: 'Full name is required',
                    minLength: { value: 3, message: 'Name must be at least 3 characters' }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">+88</span>
                </div>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    validate: validatePhone
                  })}
                  className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="01XXXXXXXXX"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Format: 01XXXXXXXXX (Bangladeshi number)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'Password is required',
                      validate: validatePassword
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                
                <div className="mt-3 space-y-1">
                  <h4 className="text-xs font-medium text-gray-700">Password must contain:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className={`flex items-center ${password?.length >= 8 ? 'text-green-600' : ''}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${/(?=.*[a-z])/.test(password || '') ? 'text-green-600' : ''}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      One lowercase letter
                    </li>
                    <li className={`flex items-center ${/(?=.*[A-Z])/.test(password || '') ? 'text-green-600' : ''}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      One uppercase letter
                    </li>
                    <li className={`flex items-center ${/(?=.*\d)/.test(password || '') ? 'text-green-600' : ''}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      One number
                    </li>
                    <li className={`flex items-center ${/(?=.*[@$!%*?&])/.test(password || '') ? 'text-green-600' : ''}`}>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      One special character (@$!%*?&)
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => 
                        value === password || 'Passwords do not match'
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="mt-1 text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Shop Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name *
              </label>
              <input
                {...register('shopName', { 
                  required: 'Shop name is required',
                  minLength: { value: 3, message: 'Shop name must be at least 3 characters' }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Awesome Shop"
              />
              {errors.shopName && (
                <p className="mt-1 text-sm text-red-600">{errors.shopName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Address *
              </label>
              <textarea
                {...register('shopAddress', { 
                  required: 'Shop address is required',
                  minLength: { value: 10, message: 'Please provide a detailed address' }
                })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full shop address including landmark"
              />
              {errors.shopAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.shopAddress.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area/Village *
                </label>
                <input
                  {...register('address.area', { 
                    required: 'Area is required'
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mirpur 10"
                />
                {errors.address?.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.area.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thana/Upazila *
                </label>
                <input
                  {...register('address.thana', { 
                    required: 'Thana is required'
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mirpur"
                />
                {errors.address?.thana && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.thana.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City/District *
              </label>
              <select
                {...register('address.city', { 
                  required: 'City is required'
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select City</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Khulna">Khulna</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Barishal">Barishal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
              {errors.address?.city && (
                <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Bank Information</h3>
            <p className="text-sm text-gray-600">
              Provide your bank details for payment processing. All information is encrypted and secure.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Number *
              </label>
              <input
                type="text"
                {...register('bankAccount', { 
                  required: 'Bank account number is required',
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Account number must contain only digits'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234567890"
              />
              {errors.bankAccount && (
                <p className="mt-1 text-sm text-red-600">{errors.bankAccount.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  {...register('bankName', { 
                    required: 'Bank name is required'
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sonali Bank"
                />
                {errors.bankName && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Branch *
                </label>
                <input
                  {...register('bankBranch', { 
                    required: 'Bank branch is required'
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mirpur Branch"
                />
                {errors.bankBranch && (
                  <p className="mt-1 text-sm text-red-600">{errors.bankBranch.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        const formData = watch();
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Review Your Information</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  Your information is secure. Please review all details before submission.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Account Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Phone:</span>
                    <p className="font-medium">+88{formData.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shop Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Store className="w-4 h-4 mr-2" />
                  Shop Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Shop Name:</span>
                    <p className="font-medium">{formData.shopName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Shop Address:</span>
                    <p className="font-medium text-sm">{formData.shopAddress}</p>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Area:</span>
                    <p className="font-medium">{formData.address?.area}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Thana:</span>
                    <p className="font-medium">{formData.address?.thana}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">City:</span>
                    <p className="font-medium">{formData.address?.city}</p>
                  </div>
                </div>
              </div>

              {/* Bank Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Bank Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Bank Account:</span>
                    <p className="font-medium">{formData.bankAccount}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Bank Name:</span>
                    <p className="font-medium">{formData.bankName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Branch:</span>
                    <p className="font-medium">{formData.bankBranch}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mt-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline font-medium">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                    Privacy Policy
                  </Link>
                  . I confirm that all information provided is accurate.
                </label>
              </div>
              {!agreedToTerms && step === 5 && (
                <p className="mt-1 text-sm text-red-600">
                  You must agree to the Terms & Conditions
                </p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Become a Vendor
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our marketplace and start selling your products to thousands of customers.
            Complete your registration in 5 simple steps.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            {steps.map((stepItem) => (
              <div key={stepItem.number} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                    stepItem.number === step
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : stepItem.number < step
                      ? 'bg-green-100 border-green-500 text-green-600'
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  }`}
                >
                  {stepItem.number < step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    stepItem.icon
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    stepItem.number === step
                      ? 'text-blue-600'
                      : stepItem.number < step
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {stepItem.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step Content */}
            {renderStepContent()}

            {/* Error & Success Messages */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex justify-between">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !agreedToTerms}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Step Indicator */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-500">
                Step {step} of 5
              </span>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Grow Your Business</h3>
            <p className="text-sm text-gray-600">
              Access thousands of customers and expand your market reach
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Secure Payments</h3>
            <p className="text-sm text-gray-600">
              Get paid securely with multiple payment options and regular payouts
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Seller Support</h3>
            <p className="text-sm text-gray-600">
              Dedicated support team to help you succeed on our platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}