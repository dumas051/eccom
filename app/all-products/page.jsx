'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";

const AllProducts = () => {
    const { products } = useAppContext();
    const searchParams = useSearchParams();
    const search = searchParams.get('search')?.toLowerCase() || '';

    const filteredProducts = products.filter(product => {
        if (!product || !product.name) return false;
        if (!search) return true;
        return (
            product.name.toLowerCase().includes(search) ||
            (product.description && product.description.toLowerCase().includes(search))
        );
    });

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
                <div className="flex flex-col items-end pt-12">
                    <p className="text-2xl font-medium">All products</p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
                    {filteredProducts.map((product, index) => (
                      <div key={index} className="bg-white rounded-lg shadow p-4 text-gray-900">
                        <ProductCard product={product} />
                      </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
