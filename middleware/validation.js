// middleware/validation.js
export const validateRegistration = (data) => {
  const { name, email, password, role } = data;
  const errors = [];

  // Name validation
  if (!name?.trim()) errors.push('Name is required');
  else if (name.length > 100) errors.push('Name too long');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim()) errors.push('Email is required');
  else if (!emailRegex.test(email)) errors.push('Invalid email');
  else if (email.length > 255) errors.push('Email too long');

  // Password validation
  if (!password?.trim()) errors.push('Password is required');
  else if (password.length < 8) errors.push('Password too short');
  else if (password.length > 128) errors.push('Password too long');
  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push('Weak password');
  }

  // Role validation
  if (role && !['user', 'admin', 'moderator'].includes(role)) {
    errors.push('Invalid role');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
      password: password?.trim(),
      role: role || 'user',
    },
  };
};
