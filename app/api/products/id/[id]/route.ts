import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Product from '@/models/Product';

// Helper function to generate slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

// GET single product by ID
export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await Product.findById(id)
      .populate('category', 'name icon')
      .populate('brand', 'name');

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (err) {
    console.error('GET Product Error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// UPDATE product by ID
export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Generate slug if name is being updated
    if (body.name) {
      const baseSlug = generateSlug(body.name);

      // Check if slug already exists (excluding current product)
      const existingProduct = await Product.findOne({
        slug: baseSlug,
        _id: { $ne: id },
      });

      if (existingProduct) {
        // Append timestamp to make slug unique
        body.slug = `${baseSlug}-${Date.now()}`;
      } else {
        body.slug = baseSlug;
      }
    }

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    })
      .populate('category', 'name icon')
      .populate('brand', 'name');

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (err) {
    console.error('PUT Product Error:', err);

    // Handle duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          error: `${field} already exists. Please use a different ${field}.`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// DELETE product by ID
export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (err) {
    console.error('DELETE Product Error:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
