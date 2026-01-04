// components/blog/ReadingProgress.jsx
"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ReadingProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-600 origin-left z-50 shadow-lg"
        style={{ scaleX }}
      />

      {/* Reading Stats */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 p-3">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Progress</div>
                <div className="text-lg font-bold text-primary-600">
                  {Math.round(scaleX.get() * 100)}%
                </div>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Time Left</div>
                <div className="text-lg font-bold text-accent-600">
                  {Math.max(0, Math.round((1 - scaleX.get()) * 10))}min
                </div>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Speed</div>
                <div className="text-lg font-bold text-green-600">
                  {scaleX.get() > 0.3 ? "Fast" : "Slow"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}