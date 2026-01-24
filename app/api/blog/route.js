import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { v4 as uuidv4 } from 'uuid';

// Utility function to upload image to server/cloud storage
async function uploadImageToServer(base64Data, filename) {
  try {
    // Remove data URL prefix if present
    const base64Image = base64Data.split(';base64,').pop();
    const buffer = Buffer.from(base64Image, 'base64');
    
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}-${filename}`;
    
    // In production, upload to S3, Cloudinary, etc.
    // For now, we'll save to public/uploads (make sure directory exists)
    const fs = await import('fs');
    const path = await import('path');
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);
    
    return `/uploads/${uniqueFilename}`;
  } catch (error) {
    console.error('Image upload error:', error);
    return null;
  }
}

// Process content with base64 images
async function processContentImages(content) {
  if (!content) return content;
  
  const base64Regex = /data:image\/([a-zA-Z]*);base64,([^"]*)/g;
  const matches = [...content.matchAll(base64Regex)];
  
  let processedContent = content;
  
  for (const match of matches) {
    const [fullMatch, imageType, base64Data] = match;
    
    try {
      const filename = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${imageType}`;
      const uploadedUrl = await uploadImageToServer(fullMatch, filename);
      
      if (uploadedUrl) {
        processedContent = processedContent.replace(fullMatch, uploadedUrl);
      }
    } catch (error) {
      console.error('Failed to process image:', error);
    }
  }
  
  return processedContent;
}

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const author = searchParams.get('author');
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    if (status) query.status = status;
    if (category) query.category = category.toLowerCase();
    if (tag) query.tags = { $in: [tag.toLowerCase()] };
    if (featured === 'true') query.isFeatured = true;
    if (author) query['author.id'] = author;
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // For public API, only show published posts
    if (!status && request.headers.get('referer')?.includes('/admin')) {
      // Admin can see all
    } else {
      query.status = 'published';
    }
    
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('title slug excerpt coverImage category tags status isFeatured author views likes readTime publishedAt createdAt seo.metaTitle seo.metaDescription'),
      Blog.countDocuments(query)
    ]);
    
    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('GET BLOGS ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      title,
      content,
      excerpt,
      coverImage,
      images,
      metaTitle,
      metaDescription,
      keywords,
      category,
      tags,
      status,
      isFeatured,
      author,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonicalUrl,
      relatedPosts,
    } = body;

    /* ================= VALIDATION ================= */
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    if (!author?.name) {
      return NextResponse.json(
        { success: false, message: 'Author name is required' },
        { status: 400 }
      );
    }

    /* ================= SLUG GENERATION ================= */
    let baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    // Check for existing slugs and make unique
    let slug = baseSlug;
    let counter = 1;
    
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    /* ================= IMAGE PROCESSING ================= */
    // Process content images from base64 to server URLs
    const processedContent = await processContentImages(content);
    
    // Process cover image if it's base64
    let processedCoverImage = coverImage;
    if (coverImage && coverImage.startsWith('data:image')) {
      const uploadedUrl = await uploadImageToServer(coverImage, 'cover-image');
      if (uploadedUrl) processedCoverImage = uploadedUrl;
    }
    
    // Process additional images
    const processedImages = [];
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.url && img.url.startsWith('data:image')) {
          const uploadedUrl = await uploadImageToServer(img.url, 'blog-image');
          if (uploadedUrl) {
            processedImages.push({
              ...img,
              url: uploadedUrl
            });
          }
        } else if (img.url) {
          processedImages.push(img);
        }
      }
    }

    /* ================= AUTO EXCERPT ================= */
    const autoExcerpt = 
      excerpt ||
      processedContent
        .replace(/<[^>]*>?/gm, '')
        .substring(0, 200)
        .trim() + '...';

    /* ================= READ TIME ================= */
    const cleanContent = processedContent.replace(/<[^>]*>?/gm, '');
    const words = cleanContent.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200));

    /* ================= CREATE BLOG ================= */
    const blog = await Blog.create({
      title,
      slug,
      content: processedContent,
      excerpt: autoExcerpt,
      coverImage: processedCoverImage,
      images: processedImages,
      seo: {
        metaTitle: metaTitle || title.substring(0, 60),
        metaDescription: metaDescription || autoExcerpt.substring(0, 160),
        keywords: keywords || [],
        canonicalUrl,
        ogTitle: ogTitle || metaTitle || title.substring(0, 60),
        ogDescription: ogDescription || metaDescription || autoExcerpt.substring(0, 160),
        ogImage: ogImage || processedCoverImage,
        twitterTitle: twitterTitle || metaTitle || title.substring(0, 60),
        twitterDescription: twitterDescription || metaDescription || autoExcerpt.substring(0, 160),
        twitterImage: twitterImage || processedCoverImage,
      },
      category: category?.toLowerCase(),
      tags: tags?.map(tag => tag.toLowerCase()) || [],
      status: status || 'draft',
      isFeatured: isFeatured || false,
      author: {
        name: author.name,
        id: author.id || null,
        avatar: author.avatar || null,
      },
      readTime,
      publishedAt: status === 'published' ? new Date() : null,
      relatedPosts: relatedPosts || [],
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Blog created successfully',
        data: blog,
        seo: {
          metaTitle: blog.seo.metaTitle,
          metaDescription: blog.seo.metaDescription,
          canonicalUrl: blog.seo.canonicalUrl,
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('BLOG CREATE ERROR:', error);
    
    // Handle duplicate key errors (unique slug)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'A blog with similar title already exists' },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to create blog' },
      { status: 500 }
    );
  }
}

// PUT method for updating blog
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Blog ID is required' },
        { status: 400 }
      );
    }
    
    // Process images if content is being updated
    if (updateData.content) {
      updateData.content = await processContentImages(updateData.content);
    }
    
    const blog = await Blog.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        lastModifiedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
    
  } catch (error) {
    console.error('UPDATE BLOG ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE method
export async function DELETE(req) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Blog ID is required' },
        { status: 400 }
      );
    }
    
    const blog = await Blog.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true }
    );
    
    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Blog archived successfully',
      data: blog
    });
    
  } catch (error) {
    console.error('DELETE BLOG ERROR:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to archive blog' },
      { status: 500 }
    );
  }
}