// components/blog/ShareButtons.jsx
"use client";

import { useState } from "react";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link as LinkIcon, 
  Mail, 
  MessageCircle,
  Whatsapp,
  Clipboard,
  CheckCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function ShareButtons({ title, url, excerpt }) {
  const [copied, setCopied] = useState(false);
  const [hoveredPlatform, setHoveredPlatform] = useState(null);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(excerpt)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${excerpt}\n\nRead more: ${url}`)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!", {
        icon: "📋",
        style: {
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #34D399',
        },
      });
      
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const platforms = [
    { 
      key: 'facebook', 
      icon: Facebook, 
      color: 'bg-blue-500 hover:bg-blue-600',
      label: 'Facebook',
      hoverColor: 'text-blue-600'
    },
    { 
      key: 'twitter', 
      icon: Twitter, 
      color: 'bg-blue-400 hover:bg-blue-500',
      label: 'Twitter',
      hoverColor: 'text-blue-400'
    },
    { 
      key: 'linkedin', 
      icon: Linkedin, 
      color: 'bg-blue-700 hover:bg-blue-800',
      label: 'LinkedIn',
      hoverColor: 'text-blue-700'
    },
    { 
      key: 'whatsapp', 
      icon: Whatsapp, 
      color: 'bg-green-500 hover:bg-green-600',
      label: 'WhatsApp',
      hoverColor: 'text-green-500'
    },
    { 
      key: 'telegram', 
      icon: MessageCircle, 
      color: 'bg-blue-500 hover:bg-blue-600',
      label: 'Telegram',
      hoverColor: 'text-blue-500'
    },
    { 
      key: 'email', 
      icon: Mail, 
      color: 'bg-red-500 hover:bg-red-600',
      label: 'Email',
      hoverColor: 'text-red-500'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Platform Buttons */}
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <motion.a
            key={platform.key}
            href={shareLinks[platform.key]}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredPlatform(platform.key)}
            onMouseLeave={() => setHoveredPlatform(null)}
          >
            <div className={`p-3 rounded-xl ${platform.color} text-white shadow-md hover:shadow-lg transition-all duration-200`}>
              <platform.icon className="h-5 w-5" />
            </div>
            
            {/* Tooltip */}
            {hoveredPlatform === platform.key && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
              >
                {platform.label}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
              </motion.div>
            )}
          </motion.a>
        ))}

        {/* Copy Link Button */}
        <motion.button
          onClick={handleCopyLink}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={`p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${
            copied 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900'
          }`}>
            {copied ? (
              <CheckCircle className="h-5 w-5 text-white" />
            ) : (
              <LinkIcon className="h-5 w-5 text-white" />
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {copied ? 'Copied!' : 'Copy Link'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        </motion.button>
      </div>

      {/* URL Display */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 mb-1">Share this URL:</p>
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-600 truncate">{url}</p>
            </div>
          </div>
          <button
            onClick={handleCopyLink}
            className="ml-3 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-xl border border-gray-200 text-center">
          <div className="text-lg font-bold text-primary-600">1.2K</div>
          <div className="text-xs text-gray-500">Shares</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-200 text-center">
          <div className="text-lg font-bold text-accent-600">45</div>
          <div className="text-xs text-gray-500">Comments</div>
        </div>
        <div className="bg-white p-3 rounded-xl border border-gray-200 text-center">
          <div className="text-lg font-bold text-green-600">89</div>
          <div className="text-xs text-gray-500">Bookmarks</div>
        </div>
      </div>
    </div>
  );
}