"use client"
import React, { useState } from 'react';
import { FaMouse, FaKeyboard } from 'react-icons/fa';

const CategoryFilter = ({ selectedCategory, onCategoryChange, showAll = true }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const categories = [
        { id: 'all', name: 'All Products', icon: null, color: 'bg-gray-500' },
        { id: 'Mouse', name: 'Mouse', icon: FaMouse, color: 'bg-blue-500' },
        { id: 'Keyboard', name: 'Keyboard', icon: FaKeyboard, color: 'bg-green-500' },
    ];

    const handleCategoryClick = (categoryId) => {
        onCategoryChange(categoryId === 'all' ? null : categoryId);
        setIsExpanded(false);
    };

    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

    return (
        <div className="relative">
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm transition-all duration-200 ease-out hover:shadow-md"
                >
                    {selectedCategoryData?.icon && (
                        <selectedCategoryData.icon className="w-4 h-4 text-gray-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                        {selectedCategoryData?.name || 'All Products'}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Desktop Category Pills */}
            <div className="hidden md:flex flex-wrap gap-3 mb-6">
                {categories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id || (!selectedCategory && category.id === 'all');
                    
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ease-out ${
                                isSelected
                                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300 hover:shadow-md hover:scale-105'
                            }`}
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            <span className="text-sm font-medium">{category.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Mobile Dropdown */}
            {isExpanded && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg animate-slide-down">
                    <div className="p-2">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategory === category.id || (!selectedCategory && category.id === 'all');
                            
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ease-out ${
                                        isSelected
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    <span className="text-sm font-medium">{category.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryFilter; 