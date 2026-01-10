import { connectDB } from '@/lib/db';
import Review from '@/models/Review';
import  {getIdFromReq } from "@/lib/getIdFromReq";

export default async function handler(req, res) {


const id = getIdFromReq(req);

  await connectDB();
  


  switch (req.method) {
    case 'GET':
      return getReview(req, res, id);
    case 'PUT':
      return updateReview(req, res, id);
    case 'DELETE':
      return deleteReview(req, res, id);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ 
        success: false, 
        message: `Method ${req.method} not allowed` 
      });
  }
}

async function getReview(req, res, id) {
  try {
    const review = await Review.findById(id).lean();
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}

async function updateReview(req, res, id) {
  try {
    const { userId } = req.body;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this review' 
      });
    }

    // Only allow updating certain fields
    const allowedUpdates = ['rating', 'comment', 'images'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).lean();

    // Update product rating
    await updateProductRating(updatedReview.productId);

    res.status(200).json({
      success: true,
      data: updatedReview,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}

async function deleteReview(req, res, id) {
  try {
    const { userId } = req.body;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this review' 
      });
    }

    await Review.findByIdAndDelete(id);

    // Update product rating
    await updateProductRating(review.productId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
}