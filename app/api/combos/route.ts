import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Combo from '@/models/Combo';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Combo name is required' },
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
    const productIds = body.products.map((p: any) => p.productId);
    
    const productsFromDb = await Product.find({
      _id: { $in: productIds }
    }).select('name price images stock isActive variants');
    
    // Validate all products exist
    if (productsFromDb.length !== body.products.length) {
      return NextResponse.json(
        { success: false, error: 'Some products not found' },
        { status: 400 }
      );
    }
    
    // Validate all products are active
    const inactiveProducts = productsFromDb.filter((p: any) => !p.isActive);
    if (inactiveProducts.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Some products are inactive' },
        { status: 400 }
      );
    }
    
    // Helper function to get product price
    const getProductPrice = (product: any) => {
      if (product.variants && product.variants.length > 0) {
        return product.variants[0].regularPrice || product.variants[0].price || 0;
      }
      return product.regularPrice || product.price || 0;
    };
    
    // Prepare products with cached data
    const productsWithDetails = body.products.map((comboProduct: any) => {
      const productFromDb = productsFromDb.find(
        (p: any) => p._id.toString() === comboProduct.productId.toString()
      );
      
      if (!productFromDb) {
        throw new Error(`Product ${comboProduct.productId} not found`);
      }
      
      const price = getProductPrice(productFromDb);
      const image = productFromDb.images?.[0] || productFromDb.variants?.[0]?.images?.[0] || '';
      
      return {
        productId: productFromDb._id,
        name: productFromDb.name,
        price: price,
        quantity: comboProduct.quantity || 1,
        image: image
      };
    });
    
    // Calculate total regular price
    const regularPrice = productsWithDetails.reduce((total: number, product: any) => {
      return total + (product.price * product.quantity);
    }, 0);
    
    // Calculate discount
    const comboPrice = parseFloat(body.comboPrice);
    const discountAmount = regularPrice - comboPrice;
    const discountPercent = Math.round((discountAmount / regularPrice) * 100);
    
    // Validate combo price
    if (comboPrice > regularPrice) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Combo price (৳${comboPrice}) cannot be higher than total regular price (৳${regularPrice})` 
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
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Check for duplicate slug
    const existingCombo = await Combo.findOne({ slug });
    if (existingCombo) {
      return NextResponse.json(
        { success: false, error: 'A combo with similar name already exists' },
        { status: 400 }
      );
    }
    
    // Create combo
    const combo = await Combo.create({
      name: body.name,
      description: body.description || '',
      slug,
      products: productsWithDetails,
      comboPrice,
      regularPrice,
      discountPercent,
      discountAmount,
      featureImg: body.featureImg || '',
      galleryImages: body.galleryImages || [],
      isActive: body.isActive !== undefined ? body.isActive : true,
      keywords: body.keywords || [],
      type: body.type || 'regular',
      stock: body.stock || 0,
      sold: 0,
      rating: 0,
      freeDelivery: body.freeDelivery || false,
      brand: body.brand || undefined,
      category: body.category || undefined,
      vendor: body.vendor || undefined,
      metaTitle: body.metaTitle || body.name,
      metaDescription: body.metaDescription || body.description,
      sku: body.sku || undefined
    });
    
    // Return detailed response with calculations
    return NextResponse.json({
      success: true,
      message: 'Combo created successfully',
      data: {
        ...combo.toObject(),
        calculations: {
          regularPrice,
          comboPrice,
          discountAmount,
          discountPercent,
          savingsPercentage: discountPercent,
          savingsAmount: discountAmount,
          perProductSavings: discountAmount / productsWithDetails.length,
          totalProducts: productsWithDetails.length,
          averageProductPrice: regularPrice / productsWithDetails.length,
          averageDiscountedPrice: comboPrice / productsWithDetails.length
        },
        summary: {
          totalValue: regularPrice,
          youPay: comboPrice,
          youSave: discountAmount,
          discount: `${discountPercent}%`,
          itemsCount: productsWithDetails.length
        }
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating combo:', error);
    
    // Handle duplicate key error (slug)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A combo with this name already exists' },
        { status: 400 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );