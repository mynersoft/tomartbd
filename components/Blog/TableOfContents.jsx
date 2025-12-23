// components/blog/TableOfContents.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { List, ChevronDown, Hash, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const observerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Extract headings from content
  useEffect(() => {
    if (!content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = Array.from(doc.querySelectorAll("h2, h3, h4"));
    
    const extractedHeadings = headingElements.map((heading, index) => {
      const id = heading.id || heading.textContent.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      
      if (!heading.id) {
        heading.id = id;
      }
      
      return {
        id,
        text: heading.textContent,
        level: parseInt(heading.tagName.substring(1)),
        index,
      };
    }).filter(heading => heading.text.trim().length > 0);
    
    setHeadings(extractedHeadings);
  }, [content]);

  // Setup intersection observer for active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const handleIntersection = (entries) => {
      if (isScrolling) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "-20% 0% -70% 0%",
      threshold: 0.2,
    });

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observerRef.current.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings, isScrolling]);

  // Smooth scroll to heading
  const scrollToHeading = (id) => {
    setIsScrolling(true);
    setActiveId(id);
    
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset scrolling flag after scroll completes
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  // Toggle expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (headings.length === 0) return null;

  const completedHeadings = headings.filter(h => 
    document.getElementById(h.id)
  ).length;
  const progress = (completedHeadings / headings.length) * 100;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
              <List className="h-5 w-5 text-primary-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center border-2 border-white">
              <span className="text-xs font-bold text-white">{headings.length}</span>
            </div>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-900">Table of Contents</h3>
            <p className="text-sm text-gray-500">Navigate through sections</p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Progress Bar */}
      <div className="px-5 pb-3">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Contents */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0">
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 group ${
                      activeId === heading.id
                        ? "bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 shadow-sm"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className={`flex-shrink-0 mt-0.5 ${
                      activeId === heading.id ? "text-primary-600" : "text-gray-400"
                    }`}>
                      {heading.level === 2 ? (
                        <BookOpen className="h-4 w-4" />
                      ) : heading.level === 3 ? (
                        <Hash className="h-3.5 w-3.5" />
                      ) : (
                        <Hash className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium block truncate ${
                        activeId === heading.id
                          ? "text-primary-800"
                          : "text-gray-700"
                      }`}>
                        {heading.text}
                      </span>
                      <div className={`h-1 w-8 rounded-full mt-2 transition-all duration-300 ${
                        activeId === heading.id
                          ? "bg-gradient-to-r from-primary-500 to-accent-500"
                          : "bg-gray-300 group-hover:bg-gray-400"
                      }`} />
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded ${
                      activeId === heading.id
                        ? "bg-primary-100 text-primary-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {heading.level === 2 ? "Section" : heading.level === 3 ? "Topic" : "Sub"}
                    </div>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Sections:</span>
                  <span className="font-bold text-gray-900">{headings.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-bold text-primary-600">{completedHeadings}</span>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="mt-4 p-3 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg">
                <p className="text-xs text-accent-800">
                  <span className="font-semibold">Tip:</span> Use ↑↓ keys to navigate between sections
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}