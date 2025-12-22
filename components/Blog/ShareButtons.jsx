// components/blog/ShareButtons.jsx
"use client";

import {
	Facebook,
	Twitter,
	Linkedin,
	Link as LinkIcon,
	Mail,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ShareButtons({ title, url, excerpt }) {
	const shareLinks = {
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
			url
		)}`,
		twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			title
		)}&url=${encodeURIComponent(url)}`,
		linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
			url
		)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
			excerpt
		)}`,
		email: `mailto:?subject=${encodeURIComponent(
			title
		)}&body=${encodeURIComponent(`${excerpt}\n\nRead more: ${url}`)}`,
	};

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Link copied to clipboard!");
		} catch (err) {
			toast.error("Failed to copy link");
		}
	};

	return (
		<div className="flex items-center gap-2">
			<a
				href={shareLinks.facebook}
				target="_blank"
				rel="noopener noreferrer"
				className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-lg transition-colors"
				aria-label="Share on Facebook">
				<Facebook className="h-5 w-5" />
			</a>

			<a
				href={shareLinks.twitter}
				target="_blank"
				rel="noopener noreferrer"
				className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-400 rounded-lg transition-colors"
				aria-label="Share on Twitter">
				<Twitter className="h-5 w-5" />
			</a>

			<a
				href={shareLinks.linkedin}
				target="_blank"
				rel="noopener noreferrer"
				className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-colors"
				aria-label="Share on LinkedIn">
				<Linkedin className="h-5 w-5" />
			</a>

			<button
				onClick={handleCopyLink}
				className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
				aria-label="Copy link">
				<LinkIcon className="h-5 w-5" />
			</button>

            
			<a
				href={shareLinks.email}
				className="p-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 rounded-lg transition-colors"
				aria-label="Share via Email">
				<Mail className="h-5 w-5" />
			</a>
		</div>
	);
}
