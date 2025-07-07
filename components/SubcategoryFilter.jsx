"use client"
import React, { useState } from 'react';

const SubcategoryFilter = ({ selectedCategory, selectedSubcategory, onSubcategoryChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const subcategories = {
        Mouse: [
            { id: 'all', name: 'All Mice' },
            { id: 'Gaming Mouse', name: 'Gaming Mouse' },
            { id: 'Office Mouse', name: 'Office Mouse' },
            { id: 'Wireless Mouse', name: 'Wireless Mouse' },
        ],
        Keyboard: [
            { id: 'all', name: 'All Keyboards' },
            { id: 'Gaming Keyboard', name: 'Gaming Keyboard' },
            { id: 'Mechanical Keyboard', name: 'Mechanical Keyboard' },
            { id: 'Wireless Keyboard', name: 'Wireless Keyboard' },
        ],
    };

    const currentSubcategories = subcategories[selectedCategory] || [];

    if (!selectedCategory || currentSubcategories.length <= 1) {
        return null;
    }

    const handleSubcategoryClick = (subcategoryId) => {
        onSubcategoryChange(subcategoryId === 'all' ? null : subcategoryId);
        setIsExpanded(false);
    };

    const selectedSubcategoryData = currentSubcategories.find(sub => sub.id === selectedSubcategory);

    return (
        <div className="relative mb-4">
            {/* Mobile Filter Button */}
            <div className="md:hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm transition-all duration-200 ease-out hover:bg-gray-100"
                >
                    <span className="text-gray-600">
                        {selectedSubcategoryData?.name || 'All Types'}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Desktop Subcategory Pills */}
            <div className="hidden md:flex flex-wrap gap-2">
                {currentSubcategories.map((subcategory) => {
                    const isSelected = selectedSubcategory === subcategory.id || (!selectedSubcategory && subcategory.id === 'all');
                    
                    return (
                        <button
                            key={subcategory.id}
                            onClick={() => handleSubcategoryClick(subcategory.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ease-out ${
                                isSelected
                                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                            }`}
                        >
                            {subcategory.name}
                        </button>
                    );
                })}
            </div>

            {/* Mobile Dropdown */}
            {isExpanded && (
                <div className="absolute top-full left-0 right-0 z-40 bg-white border border-gray-200 rounded-lg shadow-lg animate-slide-down">
                    <div className="p-2">
                        {currentSubcategories.map((subcategory) => {
                            const isSelected = selectedSubcategory === subcategory.id || (!selectedSubcategory && subcategory.id === 'all');
                            
                            return (
                                <button
                                    key={subcategory.id}
                                    onClick={() => handleSubcategoryClick(subcategory.id)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ease-out ${
                                        isSelected
                                            ? 'bg-orange-50 text-orange-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {subcategory.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubcategoryFilter; 