"use client"
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const PageTransition = ({ children }) => {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`min-h-screen transition-all duration-300 ease-out ${
      isTransitioning 
        ? 'opacity-0 translate-y-4' 
        : 'opacity-100 translate-y-0'
    }`}>
      {children}
    </div>
  );
};

export default PageTransition; 