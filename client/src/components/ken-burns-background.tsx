import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface KenBurnsBackgroundProps {
  images: string[];
  duration?: number; // Duration of each slide in ms
  overlayOpacity?: number; // Black opacity to ensure readability over the images
  className?: string; // Optional wrapper class
}

export function KenBurnsBackground({
  images,
  duration = 8000,
  overlayOpacity = 0.6,
  className = "",
}: KenBurnsBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, duration);

    return () => clearInterval(interval);
  }, [images.length, duration]);

  if (!images || images.length === 0) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <AnimatePresence mode="popLayout">
        {images.map(
          (img, index) =>
            index === currentIndex && (
              <motion.div
                key={`${img}-${index}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{
                  opacity: { duration: 2, ease: "easeInOut" },
                  scale: { duration: duration / 1000 + 2, ease: "linear" },
                }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={img}
                  alt="Cinematic Background"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Primary Dimming Overlay */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(6, 6, 10, ${overlayOpacity})` }}
      />
      
      {/* Void gradient vignette for blending the edges into the Ultra-Premium UI */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-transparent to-transparent" 
      />
    </div>
  );
}
