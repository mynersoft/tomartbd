
// app/api/admin/combos/route.js
import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Combo from '@/models/Combo';
import {getIdFromReq} from "@/lib/getIdFromReq"

export async function PUT(request) {
  try {
    await dbConnect();
    
    const id = await getIdFromReq(request);
    const body = await request.json();
    
    // Find existing combo
    const existingCombo = await Combo.findById(id);
    if (!existingCombo) {
      return NextResponse.json(
        { success: false, error: 'Combo not found' },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData = { ...body };
    
    // If products are being updated, fetch new product details
    if (body.products && Array.isArray(body.products)) {
      const productIds = body.products.map(p => p.productId);
      
      const productsFromDb = await Product.find({
        _id: { $in: productIds }
      }).select('name price images');
      
      if (productsFromDb.length !== body.products.length) {
        return NextResponse.json(
          { success: false, error: 'Some products not found' },
          { status: 400 }
        );
      }
      
      // Prepare products with cached data
      updateData.products = body.products.map(comboProduct => {
        const productFromDb = productsFromDb.find(
          p => p._id.toString() === comboProduct.productId.toString()
        );
        
        return {
          productId: productFromDb._id,
          name: productFromDb.name,
          price: productFromDb.price,
          quantity: comboProduct.quantity || 1,
          image: productFromDb.images?.[0] || ''
        };
      });
    }
    
    // If title is being updated, generate new slug
    if (body.title && body.title !== existingCombo.title) {
      const newSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Check for duplicate slug (excluding current combo)
      const duplicateCombo = await Combo.findOne({ 
        slug: newSlug, 
        _id: { $ne: id } 
      });
      
      if (duplicateCombo) {
        return NextResponse.json(
          { success: false, error: 'A combo with this title already exists' },
          { status: 400 }
        );
      }
      
      updateData.slug = newSlug;
    }
    
    // Update combo
    const updatedCombo = await Combo.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true,
        runValidators: true 
      }
    );
    
    // Manually trigger calculations since findByIdAndUpdate bypasses middleware
    await updatedCombo.calculatePrices();
    await updatedCombo.save();
    
    // Calculate final values for response
    const totalRegularPrice = updatedCombo.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
    
    const discountAmount = totalRegularPrice - updatedCombo.comboPrice;
    const discountPercent = Math.round((discountAmount / totalRegularPrice) * 100);
    
    return NextResponse.json({
      success: true,
      message: 'Combo updated successfully',
      data: {
        ...updatedCombo.toObject(),
        calculations: {
          totalRegularPrice,
          comboPrice: updatedCombo.comboPrice,
          discountAmount,
          discountPercent,
          savingsPercentage: discountPercent,
          savingsAmount: discountAmount
        }
      }
    });
    
  } catch (error) {
    console.error('Error updating combo:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate combo title' },
        { status: 400 }
      );
    }
    
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