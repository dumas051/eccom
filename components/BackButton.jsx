'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';

const BackButton = ({ 
    customText = "Back", 
    customAction = null, 
    customHref = null,
    className = "",
    showIcon = true 
}) => {
    const router = useRouter();
    const { router: appRouter } = useAppContext();

    const handleBack = () => {
        if (customAction) {
            customAction();
        } else if (customHref) {
            router.push(customHref);
        } else {
            // Check if there's a previous page in history
            if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
            } else {
                // Fallback to home page if no history
                router.push('/');
            }
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors duration-200 ${className}`}
            aria-label="Go back"
        >
            {showIcon && (
                <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                    />
                </svg>
            )}
            {customText}
        </button>
    );
};

export default BackButton; 