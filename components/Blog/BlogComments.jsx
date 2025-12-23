// components/blog/BlogComments.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  MessageCircle, 
  Heart, 
  Reply, 
  Send, 
  MoreVertical,
  CheckCircle,
  Flag,
  Edit,
  Trash2,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogComments({ postId }) {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: "/images/avatars/john.jpg",
        verified: true,
        role: "Premium Member"
      },
      content: "This is an amazing article! The tips about e-commerce optimization are really helpful for my business.",
      likes: 42,
      liked: false,
      replies: 5,
      timestamp: "2 hours ago",
      isAuthor: false
    },
    {
      id: 2,
      user: {
        name: "Sarah Johnson",
        avatar: "/images/avatars/sarah.jpg",
        verified: false,
        role: "Regular Reader"
      },
      content: "I've been implementing these strategies and already seeing improvements in conversion rates. Thanks for sharing!",
      likes: 28,
      liked: true,
      replies: 2,
      timestamp: "4 hours ago",
      isAuthor: false
    },
    {
      id: 3,
      user: {
        name: "Alex Chen",
        avatar: "/images/avatars/alex.jpg",
        verified: true,
        role: "Industry Expert"
      },
      content: "Great insights! Could you elaborate more on the AI integration part? Looking forward to your next article.",
      likes: 56,
      liked: false,
      replies: 12,
      timestamp: "1 day ago",
      isAuthor: false
    }
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);

  const handleLike = (commentId) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const newLiked = !comment.liked;
        return {
          ...comment,
          liked: newLiked,
          likes: newLiked ? comment.likes + 1 : comment.likes - 1
        };
      }
      return comment;
    }));
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCommentObj = {
        id: comments.length + 1,
        user: {
          name: "You",
          avatar: null,
          verified: false,
          role: "Commenter"
        },
        content: newComment,
        likes: 0,
        liked: false,
        replies: 0,
        timestamp: "Just now",
        isAuthor: false
      };

      setComments([newCommentObj, ...comments]);
      setNewComment("");
      setLoading(false);
    }, 500);
  };

  const handleSubmitReply = (commentId) => {
    if (!replyText.trim()) return;

    // Add reply logic here
    setReplyingTo(null);
    setReplyText("");
  };

  const CommentItem = ({ comment, level = 0 }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`${level > 0 ? 'ml-8 mt-4' : ''}`}
    >
      <div className={`bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${
        comment.isAuthor ? 'border-l-4 border-l-primary-500' : ''
      }`}>
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                {comment.user.avatar ? (
                  <Image
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                )}
              </div>
              {comment.user.verified && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900">{comment.user.name}</h4>
                {comment.isAuthor && (
                  <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                    Author
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{comment.timestamp}</span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-gray-100 rounded">{comment.user.role}</span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* Comment Content */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                comment.liked
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${comment.liked ? 'fill-red-600' : ''}`} />
              <span className="text-sm font-medium">{comment.likes}</span>
            </button>
            
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Reply className="h-4 w-4" />
              <span className="text-sm font-medium">Reply</span>
            </button>
            
            {comment.replies > 0 && (
              <span className="text-sm text-gray-500">
                {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700" title="Edit">
              <Edit className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600" title="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700" title="Report">
              <Flag className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Reply Input */}
        <AnimatePresence>
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex gap-3">
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.user.name}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                    rows="2"
                  />
                </div>
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  className="self-end px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center shadow-sm">
            <MessageCircle className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
            <p className="text-gray-600">Join the discussion</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>
          <div className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
            {comments.length} Comments
          </div>
        </div>
      </div>

      {/* Add Comment */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              rows="3"
            />
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={loading || !newComment.trim()}
            className="self-start px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Post Comment
              </>
            )}
          </button>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>Markdown supported</span>
            <span>•</span>
            <span>Be respectful</span>
          </div>
          <span>{newComment.length}/1000 characters</span>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {/* Empty State */}
      {comments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Comments Yet</h3>
          <p className="text-gray-600 mb-6">Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Load More */}
      {comments.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-xl font-medium transition-colors">
            Load More Comments
          </button>
        </div>
      )}
    </div>
  );
}