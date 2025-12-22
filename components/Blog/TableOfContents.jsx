// components/blog/TableOfContents.jsx
"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown } from "lucide-react";

export default function TableOfContents({ content }) {
	const [headings, setHeadings] = useState([]);
	const [activeId, setActiveId] = useState("");
	const [isExpanded, setIsExpanded] = useState(true);

	useEffect(() => {
		const extractHeadings = () => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(content, "text/html");
			const headingElements = doc.querySelectorAll("h2, h3, h4");

			const extractedHeadings = Array.from(headingElements).map(
				(heading) => ({
					id:
						heading.id ||
						heading.textContent.toLowerCase().replace(/\s+/g, "-"),
					text: heading.textContent,
					level: parseInt(heading.tagName.substring(1)),
				})
			);

			setHeadings(extractedHeadings);
		};

		extractHeadings();
	}, [content]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{ rootMargin: "0% 0% -80% 0%" }
		);

		headings.forEach((heading) => {
			const element = document.getElementById(heading.id);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, [headings]);

	const scrollToHeading = (id) => {
		const element = document.getElementById(id);
		if (element) {
			window.scrollTo({
				top: element.offsetTop - 100,
				behavior: "smooth",
			});
		}
	};

	if (headings.length === 0) return null;

	return (
		<div className="mb-8 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors">
				<div className="flex items-center gap-3">
					<List className="h-5 w-5 text-primary-600" />
					<span className="font-semibold text-gray-900">
						Table of Contents
					</span>
					<span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
						{headings.length} sections
					</span>
				</div>
				<ChevronDown
					className={`h-5 w-5 text-gray-600 transition-transform ${
						isExpanded ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isExpanded && (
				<div className="p-4">
					<ul className="space-y-2">
						{headings.map((heading) => (
							<li key={heading.id}>
								<button
									onClick={() => scrollToHeading(heading.id)}
									className={`w-full text-left p-2 rounded-lg transition-colors ${
										activeId === heading.id
											? "bg-primary-50 text-primary-700"
											: "hover:bg-gray-100 text-gray-700"
									}`}
									style={{
										paddingLeft: `${
											(heading.level - 2) * 20 + 12
										}px`,
									}}>
									<span
										className={`inline-block w-2 h-2 rounded-full mr-3 ${
											activeId === heading.id
												? "bg-primary-500"
												: "bg-gray-300"
										}`}
									/>
									{heading.text}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
