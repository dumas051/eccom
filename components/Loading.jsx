import React from 'react'

const Loading = ({ size = "medium", text = "Loading..." }) => {
    const sizeClasses = {
        small: "w-6 h-6",
        medium: "w-8 h-8", 
        large: "w-12 h-12"
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <div className={`${sizeClasses[size]} relative`}>
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                {/* Animated ring */}
                <div className={`absolute inset-0 border-4 border-orange-600 rounded-full animate-spin border-t-transparent`}></div>
                {/* Inner pulse */}
                <div className="absolute inset-2 bg-orange-600 rounded-full animate-pulse"></div>
            </div>
            
            {text && (
                <p className="text-gray-600 text-sm font-medium animate-pulse">
                    {text}
                </p>
            )}
            
            {/* Shimmer effect */}
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-transparent via-orange-200 to-transparent animate-shimmer"></div>
            </div>
        </div>
    )
}

export default Loading