'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubcategoryFilter from "@/components/SubcategoryFilter";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { FaMouse, FaTimes } from "react-icons/fa";

const MouseProductsContent = () => {
    const { products } = useAppContext();
    const searchParams = useSearchParams();
    const search = searchParams.get('search')?.toLowerCase() || '';
    
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Filter only mouse products
    const mouseProducts = products.filter(product => product.category === 'Mouse');

    // Apply search and subcategory filters
    const filteredProducts = mouseProducts.filter(product => {
        if (!product || !product.name) return false;
        
        // Search filter
        const matchesSearch = !search || 
            product.name.toLowerCase().includes(search) ||
            (product.description && product.description.toLowerCase().includes(search));
        
        // Subcategory filter
        const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
        
        return matchesSearch && matchesSubcategory;
    });

    // Simulate loading when filters change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [selectedSubcategory, search]);

    const handleSubcategoryChange = (subcategory) => {
        setSelectedSubcategory(subcategory);
    };

    const clearFilters = () => {
        setSelectedSubcategory(null);
    };

    const hasActiveFilters = selectedSubcategory;

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                {/* Header */}
                <div className="flex flex-col items-start pt-12 w-full">
                    <div className="flex items-center justify-between w-full mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FaMouse className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <h1 className="text-3xl font-bold text-gray-900">Gaming Mice</h1>
                                    <p className="text-gray-600">Precision and performance for every click</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Results count and clear filters */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {filteredProducts.length} mouse{filteredProducts.length !== 1 ? 's' : ''} found
                            </span>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-all duration-200 ease-out"
                                >
                                    <FaTimes className="w-3 h-3" />
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Subcategory Filter */}
                    <SubcategoryFilter
                        selectedCategory="Mouse"
                        selectedSubcategory={selectedSubcategory}
                        onSubcategoryChange={handleSubcategoryChange}
                    />
                </div>

                {/* Products Grid */}
                <div className="w-full">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loading size="large" text="Filtering mice..." />
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-14">
                            {filteredProducts.map((product, index) => (
                                <div 
                                    key={product._id || index} 
                                    className="bg-white rounded-lg shadow p-4 text-gray-900 animate-fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <FaMouse className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No mice found</h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your filters or search terms
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ease-out"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

const MouseProducts = () => {
    return (
        <Suspense fallback={<Loading size="large" text="Loading mice..." />}>
            <MouseProductsContent />
        </Suspense>
    );
};

export default MouseProducts; 