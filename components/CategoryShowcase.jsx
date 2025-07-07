"use client"
import React, { useState, useEffect } from 'react';
import { FaMouse, FaKeyboard, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const CategoryShowcase = () => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const categories = [
        
    ];

    const handleCategoryClick = (categoryId) => {
        if (categoryId === 'Mouse') {
            router.push('/mouse');
        } else if (categoryId === 'Keyboard') {
            router.push('/keyboard');
        }
    };

    return (
        <div className={`py-16 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
            <div className="flex flex-col items-center mb-12">
                
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-16 lg:px-32 max-w-4xl mx-auto">
                {categories.map((category, index) => {
                    const Icon = category.icon;
                    return (
                        <div
                            key={category.id}
                            className={`group cursor-pointer ${category.bgColor} rounded-xl p-8 transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-2`}
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                                    <Icon className={`w-8 h-8 text-white`} />
                                </div>
                                <FaArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-300 ease-out group-hover:translate-x-1" />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-200">
                                {category.name}
                            </h3>
                            
                            <p className="text-gray-600 mb-6 text-base leading-relaxed">
                                {category.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">
                                    {category.count}
                                </span>
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out`}>
                                    <FaArrowRight className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* View All Categories Button */}
            <div className="flex justify-center mt-12">
                <button
                    onClick={() => router.push('/all-products')}
                    className="flex items-center gap-1 px-7 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105"
                >
                    View All Products
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
                </button>
            </div>
        </div>
    );
};

export default CategoryShowcase; 