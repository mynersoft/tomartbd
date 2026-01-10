import {connectDB } from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import User from '@/models/User';

export default async function handler(req, res) {
  await connectDB();

  switch (req.method) {
    case 'GET':
      return getReviews(req, res);
    case 'POST':
      return createReview(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ 
        success: false, 
        message: `Method ${req.method} not allowed` 
      });
  }
}

async function getReviews(req, res) {
  try {
    const { productId, page = 1, limit = 5, sort = 'newest', rating } = req.query;
    
    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required' 
      });
    }

    // Build filter
    const filter = { 
      productId,
      status: 'approved'
    };
    
    if (rating && rating !== 'all') {
      filter.rating = parseInt(rating);
    }

    // Build sort
    let sortOption = {};
    switch(sort) {
      case 'newest':
        sortOption.createdAt = -1;
        break;
      case 'oldest':
        sortOption.createdAt = 1;
        break;
      case 'highest':
        sortOption.rating = -1;
        break;
      case 'lowest':
        sortOption.rating = 1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [reviews, total, stats] = await Promise.all([
      Review.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Review.countDocuments(filter),
      getReviewStats(productId)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      data: reviews,
      stats,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalReviews: total,
        hasMore: parseInt(page) < totalPages
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}

async function createReview(req, res) {
  try {
    const { productId, userId, rating, comment, userName, userAvatar } = req.body;

    // Validate required fields
    if (!productId || !userId || !rating || !comment || !userName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ 
      productId, 
      userId 
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      });
    }

    // Check if user has purchased this product (for verified purchase)
    const userOrders = await Order.find({ 
      userId,
      'items.productId': productId,
      status: 'delivered'
    });

    const isVerifiedPurchase = userOrders.length > 0;

    // Create review
    const review = await Review.create({
      productId,
      userId,
      userName,
      userAvatar: userAvatar || '',
      rating,
      comment,
      isVerifiedPurchase,
      status: 'pending', // Admin approval required
      images: req.body.images || []
    });

    // Update product rating
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully and pending approval'
    });

  } catch (error) {
    console.error('Error creating review:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}

async function getReviewStats(productId) {
  const stats = await Review.aggregate([
    {
      $match: { 
        productId: new mongoose.Types.ObjectId(productId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$productId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingCounts: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0
      }
    };
  }

  // Calculate rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats[0].ratingCounts.forEach(rating => {
    distribution[rating] = (distribution[rating] || 0) + 1;
  });

  return {
    averageRating: parseFloat(stats[0].averageRating.toFixed(1)),
    totalReviews: stats[0].totalReviews,
    ratingDistribution: distribution
  };
}

async function updateProductRating(productId) {
  const stats = await getReviewStats(productId);
  
  await Product.findByIdAndUpdate(productId, {
    averageRating: stats.averageRating,
    reviewCount: stats.totalReviews,
    ratingDistribution: stats.ratingDistribution
  });
}