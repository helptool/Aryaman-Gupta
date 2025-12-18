import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Timer to detect when mouse stops moving
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Check if mobile (touch device)
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Set moving state
      setIsMoving(true);
      
      // Clear existing timer
      if (idleTimer.current) clearTimeout(idleTimer.current);
      
      // Set new timer to detect idle stop (150ms delay for smoothness)
      idleTimer.current = setTimeout(() => {
        setIsMoving(false);
      }, 150);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over clickable elements
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('interactive') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('resize', checkMobile);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Primary Cursor Shape */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        style={{
             x: position.x,
             y: position.y,
             translateX: '-50%',
             translateY: '-50%',
        }}
        animate={{
          // Dimensions:
          // Hover: Large Square Reticle (48x48)
          // Moving: Wide Rectangle (32x16)
          // Idle: Standard Square (20x20)
          width: isHovered ? 48 : (isMoving ? 32 : 20),
          height: isHovered ? 48 : (isMoving ? 16 : 20),
          
          // Rotation:
          // Hover: -45deg (Diamond Reticle)
          // Moving: -105deg (Rotates beyond vertical to tilt left like a standard pointer)
          // Idle: 0deg (Square)
          rotate: isHovered ? -45 : (isMoving ? -105 : 0),
          
          // Shape Morphing via Clip Path:
          // Moving: Diamond Polygon
          // Idle/Hover: Full Square Polygon
          clipPath: isMoving && !isHovered 
            ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' 
            : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            
          // Visual Style
          backgroundColor: isHovered ? 'rgba(231, 226, 217, 0.05)' : (isMoving ? '#E7E2D9' : 'transparent'),
          borderColor: isHovered ? 'rgba(231, 226, 217, 0.8)' : '#E7E2D9',
          borderWidth: isMoving ? 0 : 1.5, // Filled when moving, stroked when idle
          borderRadius: 0,
        }}
        transition={{ 
          // Smooth spring physics for fluid morphing
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          mass: 0.5 
        }}
      >
          {/* Internal Crosshair - Only visible on hover */}
          <motion.div 
            className="absolute w-full h-[1px] bg-accent/60"
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div 
            className="absolute h-full w-[1px] bg-accent/60"
            animate={{ scaleY: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
      </motion.div>
    </>
  );
};

export default CustomCursor;