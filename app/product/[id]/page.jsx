"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useClerk } from "@clerk/nextjs";

const Product = () => {

    const { id } = useParams();

    const { router, products, addToCart, currency, user } = useAppContext()
    const { openSignIn } = useClerk();

    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null);

    const fetchProductData = async () => {
        try {
            const { data } = await axios.get(`/api/product/${id}`);
            if (data.success) {
                setProductData(data.product);
                setMainImage(data.product.images[0].url);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [id])

    return productData ? (<>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 relative">
            <div className="absolute top-4 left-4 z-20"><BackButton customText="Back to Products" customHref="/all-products" /></div>
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="px-5 lg:px-16 xl:px-20 flex flex-col items-center">
                        <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4 flex justify-center items-center" style={{ maxWidth: '400px', maxHeight: '400px', width: '100%', height: '100%' }}>
                            <Image
                                src={mainImage || productData.images[0].url}
                                alt="alt"
                                className="object-contain w-full h-full"
                                width={400}
                                height={400}
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            {productData.images.map((image, index) => (
                                <div
                                    key={index}
                                    onClick={() => setMainImage(image.url)}
                                    className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 flex justify-center items-center"
                                    style={{ maxWidth: '80px', maxHeight: '80px', width: '100%', height: '100%' }}
                                >
                                    <Image
                                        src={image.url}
                                        alt="alt"
                                        className="object-contain w-full h-full"
                                        width={80}
                                        height={80}
                                    />
                                </div>

                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                            {productData.name}
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                                <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                                <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                                <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                                <Image
                                    className="h-4 w-4"
                                    src={assets.star_dull_icon}
                                    alt="star_dull_icon"
                                />
                            </div>
                            <p>(4.5)</p>
                        </div>
                        <p className="text-gray-600 mt-3">
                            {productData.description}
                        </p>
                        <p className="text-3xl font-medium mt-6">
                            {currency}{productData.offerPrice}
                            <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                                {currency}{productData.price}
                            </span>
                        </p>
                        <hr className="bg-gray-600 my-6" />
                        <div className="overflow-x-auto">
                            <table className="table-auto border-collapse w-full max-w-72">
                                <tbody>
                                    <tr>
                                        <td className="text-gray-600 font-medium">Brand</td>
                                        <td className="text-gray-800/50 ">Generic</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600 font-medium">Color</td>
                                        <td className="text-gray-800/50 ">Multi</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600 font-medium">Category</td>
                                        <td className="text-gray-800/50">
                                            {productData.category}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600 font-medium">Stock Status</td>
                                        <td className="text-gray-800/50">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                productData.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
                                                productData.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {productData.stockStatus || 'Out of Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600 font-medium">Available Stock</td>
                                        <td className="text-gray-800/50">
                                            {productData.stock > 0 ? `${productData.stock} units` : 'Out of stock'}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center mt-10 gap-4">
                            <button 
                                onClick={() => {
                                    if (!user) {
                                        toast('Please sign in to continue', { icon: '🔒' });
                                        openSignIn();
                                        return;
                                    }
                                    addToCart(productData._id)
                                }} 
                                className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
                                Add to Cart
                            </button>
                            <button 
                                onClick={() => {
                                    if (!user) {
                                        toast('Please sign in to continue', { icon: '🔒' });
                                        openSignIn();
                                        return;
                                    }
                                    addToCart(productData._id); 
                                    router.push('/cart')
                                }} 
                                className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
                                Buy now
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center mb-4 mt-16">
                        <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                        {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                    </div>
                    <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                        See more
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    </>
    ) : <Loading />
};

export default Product;