// app/api/admin/combos/route.js
import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Combo from '@/models/Combo';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || '-createdAt';
    
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }
    
    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    const skip = (page - 1) * limit;
    
    const combos = await Combo.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Combo.countDocuments(query);
    const totalActive = await Combo.countDocuments({ isActive: true });
    const totalInactive = await Combo.countDocuments({ isActive: false });
    
    return NextResponse.json({
      success: true,
      data: combos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        totalActive,
        totalInactive,
        totalCombos: total
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}





export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Combo title is required' },
        { status: 400 }
      );
    }
    
    if (!body.products || !Array.isArray(body.products) || body.products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one product is required' },
        { status: 400 }
      );
    }
    
    if (!body.comboPrice || isNaN(body.comboPrice)) {
      return NextResponse.json(
        { success: false, error: 'Valid combo price is required' },
        { status: 400 }
      );
    }
    
    // Fetch product details from database to get current prices
    const productIds = body.products.map(p => p.productId);
    
    const productsFromDb = await Product.find({
      _id: { $in: productIds }
    }).select('name price images stock isActive');
    
    // Validate all products exist
    if (productsFromDb.length !== body.products.length) {
      return NextResponse.json(
        { success: false, error: 'Some products not found' },
        { status: 400 }
      );
    }
    
    // Validate all products are active
    const inactiveProducts = productsFromDb.filter(p => !p.isActive);
    if (inactiveProducts.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Some products are inactive' },
        { status: 400 }
      );
    }
    
    // Prepare products with cached data
    const productsWithDetails = body.products.map(comboProduct => {
      const productFromDb = productsFromDb.find(
        p => p._id.toString() === comboProduct.productId.toString()
      );
      
      if (!productFromDb) {
        throw new Error(`Product ${comboProduct.productId} not found`);
      }
      
      return {
        productId: productFromDb._id,
        name: productFromDb.name,
        price: productFromDb.price, // Cache current price
        quantity: comboProduct.quantity || 1,
        image: productFromDb.images?.[0] || ''
      };
    });
    
    // Calculate total regular price
    const totalRegularPrice = productsWithDetails.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
    
    // Calculate discount
    const comboPrice = parseFloat(body.comboPrice);
    const discountAmount = totalRegularPrice - comboPrice;
    const discountPercent = Math.round((discountAmount / totalRegularPrice) * 100);
    
    // Validate combo price
    if (comboPrice > totalRegularPrice) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Combo price (৳${comboPrice}) cannot be higher than total regular price (৳${totalRegularPrice})` 
        },
        { status: 400 }
      );
    }
    
    if (comboPrice <= 0) {
      return NextResponse.json(
        { success: false, error: 'Combo price must be greater than 0' },
        { status: 400 }
      );
    }
    
    // Generate slug
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Check for duplicate slug
    const existingCombo = await Combo.findOne({ slug });
    if (existingCombo) {
      return NextResponse.json(
        { success: false, error: 'A combo with similar title already exists' },
        { status: 400 }
      );
    }
    
    // Create combo
    const combo = await Combo.create({
      title: body.title,
      description: body.description || '',
      slug,
      products: productsWithDetails,
      comboPrice,
      totalRegularPrice,
      discountPercent,
      discountAmount,
      featuredImage: body.featuredImage || null,
      galleryImages: body.galleryImages || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      endDate: body.endDate ? new Date(body.endDate) : null,
      categories: body.categories || [],
      tags: body.tags ? body.tags.split(',').map(tag => tag.trim()) : [],
      sortOrder: body.sortOrder || 0,
      maxPurchaseLimit: body.maxPurchaseLimit || 0
    });
    
    // Return detailed response with calculations
    return NextResponse.json({
      success: true,
      message: 'Combo created successfully',
      data: {
        ...combo.toObject(),
        calculations: {
          totalRegularPrice,
          comboPrice,
          discountAmount,
          discountPercent,
          savingsPercentage: discountPercent,
          savingsAmount: discountAmount,
          perProductSavings: discountAmount / productsWithDetails.length,
          totalProducts: productsWithDetails.length,
          averageProductPrice: totalRegularPrice / productsWithDetails.length,
          averageDiscountedPrice: comboPrice / productsWithDetails.length
        },
        summary: {
          totalValue: totalRegularPrice,
          youPay: comboPrice,
          youSave: discountAmount,
          discount: `${discountPercent}%`,
          itemsCount: productsWithDetails.length
        }
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating combo:', error);
    
    // Handle duplicate key error (slug)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A combo with this title already exists' },
        { status: 400 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}