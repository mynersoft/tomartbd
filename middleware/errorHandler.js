// middleware/errorHandler.js
export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (handler) => async (req) => {
  try {
    return await handler(req);
  } catch (error) {
    console.error('Handler error:', error);

    // Handle AppError instances
    if (error.isOperational) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error.details,
        },
        { status: error.statusCode }
      );
    }

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors).map((err) => err.message),
        },
        { status: 400 }
      );
    }

    if (error.name === 'MongoError' && error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate key error',
          details: 'A user with this email already exists',
        },
        { status: 409 }
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : null,
      },
      { status: 500 }
    );
  }
};
