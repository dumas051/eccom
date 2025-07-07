import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'react-hot-toast';
import { useClerk } from "@clerk/nextjs";

const ProductCard = ({ product }) => {

    const { currency, router, addToCart, user } = useAppContext()
    const { openSignIn } = useClerk();

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer card-transition group"
        >
            <div className="cursor-pointer relative bg-gray-500/10 rounded-lg w-full flex items-center justify-center overflow-hidden" style={{ width: '200px', height: '200px' }}>
                <Image
                    src={product.images?.[0]?.url || assets.upload_area}
                    alt={product.name}
                    className="group-hover:scale-105 transition-transform duration-500 ease-out object-contain w-full h-full"
                    width={200}
                    height={200}
                />
                <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-200 ease-out hover:shadow-lg">
                    <Image
                        className="h-3 w-3"
                        src={assets.heart_icon}
                        alt="heart_icon"
                    />
                </button>
                {/* Overlay effect on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 ease-out"></div>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate text-transition group-hover:text-orange-600">{product.name}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>
            
            {/* Stock Information */}
            <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ease-out ${
                    product.stockStatus === 'In Stock' ? 'bg-green-100 text-green-800' :
                    product.stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {product.stockStatus || 'Out of Stock'}
                </span>
                {product.stock > 0 && (
                    <span className="text-xs text-gray-500">
                        ({product.stock} left)
                    </span>
                )}
            </div>
            
            <div className="flex items-center gap-2">
                <p className="text-xs">{4.5}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3 transition-transform duration-200 ease-out hover:scale-110"
                            src={
                                index < Math.floor(4)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between w-full mt-1">
                <div className="bg-white rounded-lg shadow p-4 text-gray-900 transition-all duration-300 ease-out group-hover:shadow-lg group-hover:scale-105">
                    <p className="text-base font-medium">{currency}{product.offerPrice}</p>
                </div>
                <button 
                    className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs button-transition hover:bg-orange-600 hover:text-white hover:border-orange-600"
                    onClick={e => {
                        e.stopPropagation();
                        if (!user) {
                            toast('Please sign in to continue', { icon: '🔒' });
                            openSignIn();
                            return;
                        }
                        addToCart(product._id);
                        router.push('/cart');
                    }}
                >
                    Buy now
                </button>
            </div>
        </div>
    )
}

export default ProductCard