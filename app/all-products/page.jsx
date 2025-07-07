'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryFilter from "@/components/CategoryFilter";
import SubcategoryFilter from "@/components/SubcategoryFilter";
import Loading from "@/components/Loading";
import BackButton from "@/components/BackButton";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const AllProductsContent = () => {
    const { products } = useAppContext();
    const searchParams = useSearchParams();
    const search = searchParams.get('search')?.toLowerCase() || '';
    
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Filter products based on search, category, and subcategory
    const filteredProducts = products.filter(product => {
        if (!product || !product.name) return false;
        
        // Search filter
        const matchesSearch = !search || 
            product.name.toLowerCase().includes(search) ||
            (product.description && product.description.toLowerCase().includes(search));
        
        // Category filter
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        
        // Subcategory filter
        const matchesSubcategory = !selectedSubcategory || product.subcategory === selectedSubcategory;
        
        return matchesSearch && matchesCategory && matchesSubcategory;
    });

    // Simulate loading when filters change
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [selectedCategory, selectedSubcategory, search]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSelectedSubcategory(null); // Reset subcategory when category changes
    };

    const handleSubcategoryChange = (subcategory) => {
        setSelectedSubcategory(subcategory);
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
    };

    const hasActiveFilters = selectedCategory || selectedSubcategory;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
                <div className="absolute top-4 left-4 z-20"><BackButton /></div>
                <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                    {/* Header */}
                    <div className="flex flex-col items-start pt-12 w-full">
                        <div className="mb-4">
                            {/* BackButton is now absolute */}
                        </div>
                        <div className="flex items-center justify-between w-full mb-6">
                            <div className="flex flex-col items-start">
                                <p className="text-2xl font-medium">All Products</p>
                                <div className="w-16 h-0.5 bg-orange-600 rounded-full mt-2"></div>
                            </div>
                            
                            {/* Results count and clear filters */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
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

                        {/* Category Filter */}
                        <CategoryFilter 
                            selectedCategory={selectedCategory}
                            onCategoryChange={handleCategoryChange}
                        />

                        {/* Subcategory Filter */}
                        <SubcategoryFilter
                            selectedCategory={selectedCategory}
                            selectedSubcategory={selectedSubcategory}
                            onSubcategoryChange={handleSubcategoryChange}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="w-full">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loading size="large" text="Filtering products..." />
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
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FaFilter className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your filters or search terms
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 ease-out"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

const AllProducts = () => {
    return (
        <Suspense fallback={<Loading size="large" text="Loading products..." />}>
            <AllProductsContent />
        </Suspense>
    );
};

export default AllProducts;
