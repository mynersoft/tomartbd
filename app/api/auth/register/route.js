import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectDB } from '@/lib/db';
import { validateRegistration } from '@/middleware/validation';
import { errorHandler } from '@/middleware/errorHandler';


export async function POST(req) {
  try {
    // Connect to database first
    await connectDB();

    // Only allow POST method
    if (req.method !== 'POST') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Try to parse request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateRegistration(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.sanitizedData;
    const role = validation.sanitizedData.role || 'user';

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: 'Email already registered',
          suggestion: 'Please use a different email or try logging in',
        },
        { status: 409 }
      );
    }

    // Hash password with configurable salt rounds
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      avatar: '',
      address: {
        area: '',
        thana: '',
        city: '',
        label: 'home',
        isDefault: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Generate safe response without sensitive data
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      address: user.address,
      createdAt: user.createdAt,
    };

    console.log(`New user registered: ${user.email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: userResponse,
      },
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Return proper JSON error response
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'Something went wrong',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}







// // Main handler function
// const registerHandler = async (req) => {
//   // Only allow POST method
//   if (req.method !== 'POST') {
//     return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
//   }

//   try {
//     // Parse request body
//     const body = await req.json();

//     // Validate input
//     const validation = validateRegistration(body);
//     if (!validation.isValid) {
//       return NextResponse.json(
//         {
//           error: 'Validation failed',
//           details: validation.errors,
//         },
//         { status: 400 }
//       );
//     }

//     const { name, email, password, role } = validation.sanitizedData;

//     // Connect to database
//     await connectDB();

//     // Check for existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         {
//           error: 'Email already registered',
//           suggestion: 'Please use a different email or try logging in',
//         },
//         { status: 409 }
//       );
//     }

//     // Hash password with configurable salt rounds
//     const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create user with additional fields
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       isActive: true,
//       emailVerified: false,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       lastLogin: null,
//       profile: {
//         avatar: null,
//         phone: null,
//         address: null,
//       },
//     });

//     // Generate safe response without sensitive data
//     const userResponse = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       isActive: user.isActive,
//       emailVerified: user.emailVerified,
//     };

//     // Optional: Send welcome email
//     if (process.env.SEND_WELCOME_EMAIL === 'true') {
//       // await sendWelcomeEmail(user.email, user.name);
//     }

//     // Log successful registration
//     console.log(`New user registered: ${user.email}`);

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'User registered successfully',
//         user: userResponse,
//       },
//       {
//         status: 201,
//         headers: {
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-store',
//         },
//       }
//     );
//   } catch (error) {
//     // Re-throw for error handler middleware
//     console.log(error);

//     throw error;
//   }
// };

// // Export wrapped handler with error handling
// export const POST = errorHandler(registerHandler);
