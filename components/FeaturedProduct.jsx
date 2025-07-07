import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    image: assets.footer3,
    title: "Experience precision and speed with the ThunderStrike RGB Gaming Mouse",
    description: "High-precision optical sensor, enjoy lightning-fast tracking and responsiveness.",
  },
  {
    id: 2,
    image: assets.footer2,
    title: "Illuminate Your Game with the Ultimate NeonPulse Gaming Keyboard",
    description: "Experience the vibrant, tactile switches, and a durable design. Now only ₱699!",
  },
  {
    id: 3,
    image: assets.footer1,
    title: "Elevate setup with the perfect blend of style and precision.",
    description: "Shop the durable keys for precise and responsive performance.",
  },
];

const FeaturedProduct = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`mt-14 transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium transition-all duration-500 ease-out hover:text-orange-600">Featured Products</p>
        <div className="w-20 h-0.5 bg-orange-600 mt-2 transition-all duration-300 ease-out hover:w-32"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {products.map(({ id, image, title, description }, index) => (
          <div 
            key={id} 
            className={`relative group overflow-hidden rounded-lg transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-orange-500/20 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            <Image
              src={image}
              alt={title}
              className="group-hover:scale-110 transition-transform duration-700 ease-out w-full h-auto object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div>
            
            <div className="group-hover:-translate-y-4 transition-all duration-500 ease-out absolute bottom-8 left-8 text-white space-y-2">
              <p className="font-medium text-xl lg:text-2xl transition-all duration-300 ease-out group-hover:text-orange-400">{title}</p>
              <p className="text-sm lg:text-base leading-5 max-w-60 transition-all duration-300 ease-out group-hover:text-gray-200">
                {description}
              </p>
              <button 
                className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded button-transition hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/30" 
                onClick={() => router.push('/all-products')}
              >
                Buy now 
                <Image 
                  className="h-3 w-3 transition-transform duration-300 ease-out group-hover:translate-x-1" 
                  src={assets.redirect_icon} 
                  alt="Redirect Icon" 
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
